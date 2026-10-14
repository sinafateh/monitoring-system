import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import path from "node:path";
import { existsSync, readFileSync, mkdirSync, createReadStream, unlinkSync, statSync } from "node:fs";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const workspaceKey = process.env.WORKSPACE_KEY || "monitoring-system";
const currentFile = fileURLToPath(import.meta.url);
const serverDirectory = path.dirname(currentFile);
const projectDirectory = path.resolve(serverDirectory, "..");
const distDirectory = path.join(projectDirectory, "dist");
const distIndex = path.join(distDirectory, "index.html");
const deviceSchemaPath = path.join(serverDirectory, "device-schema.sql");
const floorPlanSchemaPath = path.join(serverDirectory, "floor-plan-schema.sql");
const floorPlanUploadDirectory = path.join(projectDirectory, "uploads", "plans");
const configuredOrigins = (process.env.CORS_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean);
const corsOptions = configuredOrigins.length ? { origin: (origin, callback) => callback(null, !origin || configuredOrigins.includes(origin)) } : undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST || undefined,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE || undefined,
  user: process.env.PGUSER || undefined,
  password: process.env.PGPASSWORD || undefined,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

app.disable("x-powered-by");
// Trust only a local reverse proxy (such as the bundled Nginx config) for client IP headers.
app.set("trust proxy", "loopback");
app.use((req, res, next) => {
  if (req.path.startsWith("/api/esp/")) return next();
  return cors(corsOptions)(req, res, next);
});
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    console.log(`${req.ip} ${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});
// Project images can be large; device and admin APIs only need small JSON bodies.
app.use((req, res, next) => {
  const isDeviceApi = req.path.startsWith("/api/esp/") || req.path.startsWith("/api/talk/");
  return express.json({ limit: isDeviceApi ? "16kb" : "25mb" })(req, res, next);
});

const adminSessions = new Map();
const loginAttempts = new Map();
const ADMIN_SESSION_COOKIE = "talk_admin";
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const DEVICE_ONLINE_WINDOW_SECONDS = 45;
const DEVICE_COMMAND_TTL_SECONDS = 90;
let deviceSchemaPromise;
let floorPlanSchemaPromise;

function ensureFloorPlanSchema() {
  if (!floorPlanSchemaPromise) {
    floorPlanSchemaPromise = pool.query(readFileSync(floorPlanSchemaPath, "utf8")).catch((error) => {
      floorPlanSchemaPromise = null;
      throw error;
    });
  }
  return floorPlanSchemaPromise;
}

mkdirSync(floorPlanUploadDirectory, { recursive: true });
const floorPlanUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, floorPlanUploadDirectory),
    filename: (_req, _file, callback) => callback(null, `${randomUUID()}.pdf`),
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === "application/pdf"),
});

const sha256 = (value) => createHash("sha256").update(value).digest();
const safeEqual = (left, right) => {
  const a = Buffer.isBuffer(left) ? left : sha256(String(left ?? ""));
  const b = Buffer.isBuffer(right) ? right : sha256(String(right ?? ""));
  return a.length === b.length && timingSafeEqual(a, b);
};

async function ensureDeviceSchema() {
  if (!deviceSchemaPromise) {
    deviceSchemaPromise = pool.query(readFileSync(deviceSchemaPath, "utf8")).catch((error) => {
      deviceSchemaPromise = null;
      throw error;
    });
  }
  return deviceSchemaPromise;
}

function getAdminSession(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  const sessionId = cookie ? decodeURIComponent(cookie.slice(ADMIN_SESSION_COOKIE.length + 1)) : "";
  const session = adminSessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    if (sessionId) adminSessions.delete(sessionId);
    return null;
  }
  session.expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  return { id: sessionId, ...session };
}

function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  const expectedOrigin = `${req.protocol}://${req.get("host")}`;
  if (!origin || origin !== expectedOrigin) return res.status(403).json({ ok: false, error: "Same-origin request required" });
  return next();
}

function requireHttps(req, res, next) {
  if (process.env.NODE_ENV === "production" && !req.secure) return res.status(426).json({ ok: false, error: "HTTPS is required" });
  return next();
}

function requireAdmin(req, res, next) {
  const session = getAdminSession(req);
  if (!session) return res.status(401).json({ ok: false, error: "Administrator login required" });
  req.adminSession = session;
  return next();
}

const sendDeviceDatabaseError = (res) => res.status(503).json({ ok: false, error: "Device service temporarily unavailable" });

async function authenticateDevice(req, res, next) {
  const deviceId = req.params.deviceId || req.get("x-device-id") || "";
  const match = (req.get("authorization") || "").match(/^Bearer ([A-Za-z0-9_-]{40,100})$/);
  if (!deviceId || !match) return res.status(401).json({ ok: false, error: "Device credentials required" });
  try {
    await ensureDeviceSchema();
    const result = await pool.query(
      "SELECT device_id, token_hash, revoked_at FROM esp_devices WHERE device_id = $1",
      [deviceId],
    );
    const device = result.rows[0];
    if (!device || device.revoked_at || !safeEqual(device.token_hash, sha256(match[1]))) {
      return res.status(401).json({ ok: false, error: "Invalid device credentials" });
    }
    req.espDevice = device;
    return next();
  } catch (error) {
    console.error("ESP device authentication error:", error);
    return sendDeviceDatabaseError(res);
  }
}

app.get("/api/talk/session", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ authenticated: Boolean(getAdminSession(req)) });
});

app.post("/api/talk/login", requireHttps, requireSameOrigin, (req, res) => {
  const configuredPassword = process.env.ESP_ADMIN_PASSWORD || "";
  if (configuredPassword.length < 24) return res.status(503).json({ ok: false, error: "ESP administrator password is not configured" });
  const ip = req.ip || "unknown";
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (attempt?.blockedUntil > now) return res.status(429).json({ ok: false, error: "Too many login attempts; try again later" });
  const providedPassword = typeof req.body?.password === "string" ? req.body.password : "";
  if (!safeEqual(configuredPassword, providedPassword)) {
    const next = !attempt || attempt.resetAt <= now ? { count: 1, resetAt: now + 15 * 60 * 1000 } : { ...attempt, count: attempt.count + 1 };
    if (next.count >= 5) next.blockedUntil = now + 15 * 60 * 1000;
    loginAttempts.set(ip, next);
    return res.status(next.blockedUntil ? 429 : 401).json({ ok: false, error: "Incorrect password" });
  }
  loginAttempts.delete(ip);
  const sessionId = randomBytes(32).toString("base64url");
  adminSessions.set(sessionId, { expiresAt: now + ADMIN_SESSION_TTL_MS });
  const secure = req.secure || process.env.NODE_ENV === "production";
  res.set("Set-Cookie", `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/api/talk; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_TTL_MS / 1000}${secure ? "; Secure" : ""}`);
  res.set("Cache-Control", "no-store");
  return res.json({ ok: true });
});

app.post("/api/talk/logout", requireHttps, requireSameOrigin, (req, res) => {
  const session = getAdminSession(req);
  if (session) adminSessions.delete(session.id);
  const secure = req.secure || process.env.NODE_ENV === "production";
  res.set("Set-Cookie", `${ADMIN_SESSION_COOKIE}=; Path=/api/talk; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`);
  return res.json({ ok: true });
});

app.post("/api/talk/pairing", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 100) : "";
  const projectId = typeof req.body?.projectId === "string" && req.body.projectId.length <= 100 ? req.body.projectId : null;
  try {
    await ensureDeviceSchema();
    const code = randomBytes(24).toString("base64url");
    await pool.query("DELETE FROM esp_pairing_tokens WHERE expires_at <= NOW() OR used_at IS NOT NULL");
    await pool.query("INSERT INTO esp_pairing_tokens (token_hash, device_name, project_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes')", [sha256(code), name, projectId]);
    res.set("Cache-Control", "no-store");
    return res.status(201).json({ ok: true, provisioningCode: code, expiresInSeconds: 600 });
  } catch (error) {
    console.error("ESP pairing token creation error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.get("/api/talk/devices", requireAdmin, async (_req, res) => {
  try {
    await ensureDeviceSchema();
    const result = await pool.query(
      `SELECT d.device_id AS "deviceId", d.name, d.project_id AS "projectId", d.firmware_version AS "firmwareVersion",
              d.last_seen_at AS "lastSeenAt", d.last_ip AS "lastIp", d.created_at AS "createdAt", d.metadata,
              (d.last_seen_at >= NOW() - ($1::int * INTERVAL '1 second')) AS online
       FROM esp_devices d WHERE d.revoked_at IS NULL ORDER BY d.created_at DESC`,
      [DEVICE_ONLINE_WINDOW_SECONDS],
    );
    res.set("Cache-Control", "no-store");
    return res.json({ ok: true, devices: result.rows });
  } catch (error) {
    console.error("ESP device listing error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.delete("/api/talk/devices/:deviceId", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  try {
    await ensureDeviceSchema();
    const result = await pool.query(
      "UPDATE esp_devices SET revoked_at = NOW(), token_hash = $2 WHERE device_id = $1 AND revoked_at IS NULL RETURNING device_id",
      [req.params.deviceId, randomBytes(32)],
    );
    if (!result.rowCount) return res.status(404).json({ ok: false, error: "Device not found" });
    await pool.query("UPDATE esp_commands SET status = 'expired' WHERE device_id = $1 AND status IN ('pending', 'claimed')", [req.params.deviceId]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("ESP device revocation error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.post("/api/talk/devices/:deviceId/commands", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  const command = typeof req.body?.command === "string" ? req.body.command.trim() : "";
  if (!command || command.length > 256 || /[\u0000-\u001f\u007f]/.test(command)) {
    return res.status(400).json({ ok: false, error: "Command must be 1–256 printable characters" });
  }
  try {
    await ensureDeviceSchema();
    const device = await pool.query("SELECT device_id FROM esp_devices WHERE device_id = $1 AND revoked_at IS NULL", [req.params.deviceId]);
    if (!device.rowCount) return res.status(404).json({ ok: false, error: "Device not found" });
    const pending = await pool.query("SELECT count(*)::int AS count FROM esp_commands WHERE device_id = $1 AND status IN ('pending', 'claimed') AND expires_at > NOW()", [req.params.deviceId]);
    if (pending.rows[0].count >= 10) return res.status(429).json({ ok: false, error: "Device command queue is full" });
    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO esp_commands (id, device_id, command, expires_at)
       VALUES ($1, $2, $3, NOW() + ($4::int * INTERVAL '1 second'))
       RETURNING id, command, status, created_at AS "createdAt", expires_at AS "expiresAt"`,
      [id, req.params.deviceId, command, DEVICE_COMMAND_TTL_SECONDS],
    );
    return res.status(201).json({ ok: true, command: result.rows[0] });
  } catch (error) {
    console.error("ESP command enqueue error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.get("/api/talk/devices/:deviceId/commands", requireAdmin, async (req, res) => {
  try {
    await ensureDeviceSchema();
    const result = await pool.query(
      `SELECT c.id, c.command, c.status, c.response, c.error, c.created_at AS "createdAt", c.claimed_at AS "claimedAt", c.completed_at AS "completedAt", c.expires_at AS "expiresAt"
       FROM esp_commands c JOIN esp_devices d ON d.device_id = c.device_id
       WHERE c.device_id = $1 AND c.created_at > COALESCE(GREATEST(d.commands_cleared_at, d.history_cleared_at), '-infinity'::timestamptz)
       ORDER BY c.created_at DESC LIMIT 50`,
      [req.params.deviceId],
    );
    return res.json({ ok: true, commands: result.rows });
  } catch (error) {
    console.error("ESP command history error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.get("/api/talk/devices/:deviceId/messages", requireAdmin, async (req, res) => {
  try {
    await ensureDeviceSchema();
    const result = await pool.query(
      `SELECT m.id, m.sender, m.message, m.created_at AS "createdAt", m.delivered_at AS "deliveredAt"
       FROM esp_chat_messages m JOIN esp_devices d ON d.device_id = m.device_id
       WHERE m.device_id = $1 AND m.created_at > COALESCE(GREATEST(d.messages_cleared_at, d.history_cleared_at), '-infinity'::timestamptz)
       ORDER BY m.created_at DESC LIMIT 100`,
      [req.params.deviceId],
    );
    return res.json({ ok: true, messages: result.rows.reverse() });
  } catch (error) {
    console.error("ESP chat history error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.delete("/api/talk/devices/:deviceId/commands/history", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  const client = await pool.connect().catch(() => null);
  if (!client) return sendDeviceDatabaseError(res);
  try {
    await ensureDeviceSchema();
    await client.query("BEGIN");
    const device = await client.query(
      "UPDATE esp_devices SET commands_cleared_at = clock_timestamp() WHERE device_id = $1 AND revoked_at IS NULL RETURNING commands_cleared_at",
      [req.params.deviceId],
    );
    if (!device.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "Device not found" });
    }
    const cutoff = device.rows[0].commands_cleared_at;
    const commands = await client.query(
      "DELETE FROM esp_commands WHERE device_id = $1 AND status IN ('completed', 'failed', 'expired') AND created_at <= $2",
      [req.params.deviceId, cutoff],
    );
    await client.query("COMMIT");
    return res.json({ ok: true, removedCommands: commands.rowCount });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("ESP command history clear error:", error);
    return sendDeviceDatabaseError(res);
  } finally {
    client.release();
  }
});

app.delete("/api/talk/devices/:deviceId/messages", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  const client = await pool.connect().catch(() => null);
  if (!client) return sendDeviceDatabaseError(res);
  try {
    await ensureDeviceSchema();
    await client.query("BEGIN");
    const device = await client.query(
      "UPDATE esp_devices SET messages_cleared_at = clock_timestamp() WHERE device_id = $1 AND revoked_at IS NULL RETURNING messages_cleared_at",
      [req.params.deviceId],
    );
    if (!device.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "Device not found" });
    }
    const messages = await client.query(
      "DELETE FROM esp_chat_messages WHERE device_id = $1 AND created_at <= $2",
      [req.params.deviceId, device.rows[0].messages_cleared_at],
    );
    await client.query("COMMIT");
    return res.json({ ok: true, removedMessages: messages.rowCount });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("ESP chat clear error:", error);
    return sendDeviceDatabaseError(res);
  } finally {
    client.release();
  }
});

app.post("/api/talk/devices/:deviceId/messages", requireHttps, requireSameOrigin, requireAdmin, async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 256 || /[\u0000-\u001f\u007f]/.test(message)) {
    return res.status(400).json({ ok: false, error: "Message must be 1–256 printable characters" });
  }
  try {
    await ensureDeviceSchema();
    const device = await pool.query("SELECT device_id FROM esp_devices WHERE device_id = $1 AND revoked_at IS NULL", [req.params.deviceId]);
    if (!device.rowCount) return res.status(404).json({ ok: false, error: "Device not found" });
    const pending = await pool.query("SELECT count(*)::int AS count FROM esp_chat_messages WHERE device_id = $1 AND sender = 'web' AND delivered_at IS NULL", [req.params.deviceId]);
    if (pending.rows[0].count >= 50) return res.status(429).json({ ok: false, error: "Device message queue is full" });
    const result = await pool.query(
      `INSERT INTO esp_chat_messages (id, device_id, sender, message) VALUES ($1, $2, 'web', $3)
       RETURNING id, sender, message, created_at AS "createdAt", delivered_at AS "deliveredAt"`,
      [randomUUID(), req.params.deviceId, message],
    );
    return res.status(201).json({ ok: true, message: result.rows[0] });
  } catch (error) {
    console.error("ESP chat enqueue error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.post("/api/esp/v1/provision", requireHttps, async (req, res) => {
  const { provisioningCode, deviceId, name, firmwareVersion } = req.body || {};
  if (typeof provisioningCode !== "string" || !/^[A-Za-z0-9_-]{32}$/.test(provisioningCode)
      || typeof deviceId !== "string" || !/^[A-Za-z0-9._:-]{3,80}$/.test(deviceId)
      || (name !== undefined && (typeof name !== "string" || name.length > 100))
      || (firmwareVersion !== undefined && (typeof firmwareVersion !== "string" || firmwareVersion.length > 64))) {
    return res.status(400).json({ ok: false, error: "Invalid provisioning request" });
  }
  const client = await pool.connect().catch(() => null);
  if (!client) return sendDeviceDatabaseError(res);
  try {
    await ensureDeviceSchema();
    await client.query("BEGIN");
    const tokenResult = await client.query(
      "SELECT token_hash, device_name, project_id FROM esp_pairing_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW() FOR UPDATE",
      [sha256(provisioningCode)],
    );
    if (!tokenResult.rowCount) {
      await client.query("ROLLBACK");
      return res.status(401).json({ ok: false, error: "Provisioning code is invalid, expired, or already used" });
    }
    const deviceToken = randomBytes(32).toString("base64url");
    await client.query("UPDATE esp_pairing_tokens SET used_at = NOW() WHERE token_hash = $1", [sha256(provisioningCode)]);
    const enrollment = await client.query(
      `INSERT INTO esp_devices (device_id, name, project_id, token_hash, firmware_version, last_seen_at, last_ip)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)
       ON CONFLICT (device_id) DO UPDATE SET name = EXCLUDED.name, project_id = EXCLUDED.project_id,
         token_hash = EXCLUDED.token_hash, firmware_version = EXCLUDED.firmware_version,
         last_seen_at = NOW(), last_ip = EXCLUDED.last_ip, metadata = '{}'::jsonb,
         revoked_at = NULL, created_at = NOW()
       WHERE esp_devices.revoked_at IS NOT NULL
       RETURNING device_id`,
      [deviceId, tokenResult.rows[0].device_name || name?.trim() || deviceId, tokenResult.rows[0].project_id, sha256(deviceToken), firmwareVersion || null, req.ip],
    );
    if (!enrollment.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ ok: false, error: "Device ID is already registered" });
    }
    await client.query("UPDATE esp_commands SET status = 'expired' WHERE device_id = $1 AND status IN ('pending', 'claimed')", [deviceId]);
    await client.query("COMMIT");
    res.set("Cache-Control", "no-store");
    return res.status(201).json({ ok: true, deviceId, deviceToken, apiVersion: 1, pollIntervalSeconds: 2, heartbeatIntervalSeconds: 15 });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    if (error.code === "23505") return res.status(409).json({ ok: false, error: "Device ID is already registered" });
    console.error("ESP provisioning error:", error);
    return sendDeviceDatabaseError(res);
  } finally {
    client.release();
  }
});

app.post("/api/esp/v1/heartbeat", requireHttps, authenticateDevice, async (req, res) => {
  const firmwareVersion = typeof req.body?.firmwareVersion === "string" ? req.body.firmwareVersion.slice(0, 64) : null;
  const uptimeSeconds = Number.isSafeInteger(req.body?.uptimeSeconds) && req.body.uptimeSeconds >= 0 ? req.body.uptimeSeconds : null;
  const rssiDbm = Number.isInteger(req.body?.rssiDbm) && req.body.rssiDbm >= -127 && req.body.rssiDbm <= 0 ? req.body.rssiDbm : null;
  try {
    await pool.query(
      `UPDATE esp_devices SET last_seen_at = NOW(), last_ip = $2,
       firmware_version = COALESCE($3, firmware_version),
       metadata = jsonb_strip_nulls(jsonb_build_object('uptimeSeconds', $4::int, 'rssiDbm', $5::int))
       WHERE device_id = $1`,
      [req.espDevice.device_id, req.ip, firmwareVersion, uptimeSeconds, rssiDbm],
    );
    return res.json({ ok: true, serverTime: new Date().toISOString(), pollIntervalSeconds: 2 });
  } catch (error) {
    console.error("ESP heartbeat error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.get("/api/esp/v1/commands/next", requireHttps, authenticateDevice, async (req, res) => {
  try {
    await pool.query("UPDATE esp_devices SET last_seen_at = NOW(), last_ip = $2 WHERE device_id = $1", [req.espDevice.device_id, req.ip]);
    await pool.query("UPDATE esp_commands SET status = 'expired' WHERE device_id = $1 AND status IN ('pending', 'claimed') AND expires_at <= NOW()", [req.espDevice.device_id]);
    const result = await pool.query(
      `UPDATE esp_commands SET status = 'claimed', claimed_at = NOW(), attempts = attempts + 1
       WHERE id = (
         SELECT id FROM esp_commands WHERE device_id = $1 AND status = 'pending' AND expires_at > NOW()
         ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
       )
       RETURNING id, command, created_at AS "createdAt", expires_at AS "expiresAt"`,
      [req.espDevice.device_id],
    );
    return res.json({ ok: true, command: result.rows[0] || null, serverTime: new Date().toISOString() });
  } catch (error) {
    console.error("ESP command poll error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.get("/api/esp/v1/chat/next", requireHttps, authenticateDevice, async (req, res) => {
  const client = await pool.connect().catch(() => null);
  if (!client) return sendDeviceDatabaseError(res);
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE esp_chat_messages SET delivered_at = NOW()
       WHERE id = (SELECT id FROM esp_chat_messages WHERE device_id = $1 AND sender = 'web' AND delivered_at IS NULL
                  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
       RETURNING id, message, created_at AS "createdAt"`,
      [req.espDevice.device_id],
    );
    await client.query("COMMIT");
    return res.json({ ok: true, message: result.rows[0] || null });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("ESP chat poll error:", error);
    return sendDeviceDatabaseError(res);
  } finally {
    client.release();
  }
});

app.post("/api/esp/v1/chat", requireHttps, authenticateDevice, async (req, res) => {
  const clientMessageId = typeof req.body?.clientMessageId === "string" ? req.body.clientMessageId : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!/^[A-Za-z0-9._:-]{1,80}$/.test(clientMessageId) || !message || message.length > 256 || /[\u0000-\u001f\u007f]/.test(message)) {
    return res.status(400).json({ ok: false, error: "Invalid chat message" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO esp_chat_messages (id, device_id, client_message_id, sender, message)
       VALUES ($1, $2, $3, 'device', $4) ON CONFLICT (device_id, client_message_id) DO NOTHING
       RETURNING id`,
      [randomUUID(), req.espDevice.device_id, clientMessageId, message],
    );
    return res.status(201).json({ ok: true, accepted: true, duplicate: !result.rowCount });
  } catch (error) {
    console.error("ESP chat send error:", error);
    return sendDeviceDatabaseError(res);
  }
});

app.post("/api/esp/v1/commands/:commandId/result", requireHttps, authenticateDevice, async (req, res) => {
  const success = req.body?.success === true;
  const response = typeof req.body?.response === "string" ? req.body.response : "";
  const errorText = typeof req.body?.error === "string" ? req.body.error : "";
  if (!/^[0-9a-f-]{36}$/i.test(req.params.commandId) || response.length > 4096 || errorText.length > 512) {
    return res.status(400).json({ ok: false, error: "Invalid command result" });
  }
  try {
    const result = await pool.query(
      `UPDATE esp_commands SET status = $3, response = $4, error = $5, completed_at = NOW()
       WHERE id = $1 AND device_id = $2 AND status = 'claimed' AND expires_at > NOW() RETURNING id`,
      [req.params.commandId, req.espDevice.device_id, success ? "completed" : "failed", response, errorText],
    );
    if (!result.rowCount) return res.status(409).json({ ok: false, error: "Command is unknown, expired, or already completed" });
    return res.json({ ok: true, commandId: req.params.commandId });
  } catch (error) {
    console.error("ESP command result error:", error);
    return sendDeviceDatabaseError(res);
  }
});

// Floor plans are stored independently from the application JSON state.
app.post("/api/floor-plans", floorPlanUpload.single("pdf"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ ok: false, error: "A PDF file is required" });
  const projectId = String(req.body?.projectId || "").trim().slice(0, 120);
  if (!projectId) { unlinkSync(file.path); return res.status(400).json({ ok: false, error: "Select a project before uploading a floor plan" }); }
  try {
    const bytes = readFileSync(file.path);
    if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
      unlinkSync(file.path);
      return res.status(400).json({ ok: false, error: "The uploaded file is not a valid PDF" });
    }
    let document;
    try {
      document = await PDFDocument.load(bytes, { ignoreEncryption: false });
    } catch (error) {
      unlinkSync(file.path);
      console.warn("Floor plan PDF could not be parsed:", error.message);
      return res.status(400).json({ ok: false, error: "The uploaded file is not a readable PDF" });
    }
    const pages = document.getPages();
    if (!pages.length) throw new Error("PDF has no pages");
    const { width, height } = pages[0].getSize();
    const id = randomUUID();
    const name = (typeof req.body?.name === "string" ? req.body.name.trim() : "").slice(0, 160) || path.basename(file.originalname, path.extname(file.originalname)).slice(0, 160) || "Floor plan";
    await ensureFloorPlanSchema();
    await pool.query("INSERT INTO floor_plans (id,name,pdf_path,page_count,width,height,project_id) VALUES ($1,$2,$3,$4,$5,$6,$7)", [id, name, file.path, pages.length, width, height, projectId]);
    return res.status(201).json({ ok: true, plan: { id, name, projectId, pageCount: pages.length, width, height } });
  } catch (error) {
    if (existsSync(file.path)) unlinkSync(file.path);
    console.error("Floor plan upload error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

app.get("/api/floor-plans", async (_req, res) => {
  try {
    await ensureFloorPlanSchema();
    const result = await pool.query("SELECT id,name,project_id AS \"projectId\",page_count AS \"pageCount\",width,height,created_at AS \"createdAt\" FROM floor_plans ORDER BY created_at DESC");
    return res.json({ ok: true, plans: result.rows });
  } catch (error) {
    console.error("Floor plan list error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

app.get("/api/floor-plans/:id/file", async (req, res) => {
  try {
    await ensureFloorPlanSchema();
    const result = await pool.query("SELECT pdf_path FROM floor_plans WHERE id=$1", [req.params.id]);
    const pdfPath = result.rows[0]?.pdf_path;
    if (!pdfPath || !existsSync(pdfPath)) return res.sendStatus(404);
    res.set({ "Content-Type": "application/pdf", "Content-Length": String(statSync(pdfPath).size), "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" });
    return createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error("Floor plan PDF read error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

// A migrated floor plan can be assigned once; subsequent project changes are rejected.
app.post("/api/floor-plans/:id/project", async (req, res) => {
  const projectId = String(req.body?.projectId || "").trim().slice(0, 120);
  if (!projectId) return res.status(400).json({ ok: false, error: "A project is required" });
  try {
    await ensureFloorPlanSchema();
    const result = await pool.query("UPDATE floor_plans SET project_id=$2 WHERE id=$1 AND project_id IS NULL RETURNING project_id AS \"projectId\"", [req.params.id, projectId]);
    if (result.rowCount) return res.json({ ok: true, projectId: result.rows[0].projectId });
    const existing = await pool.query("SELECT project_id AS \"projectId\" FROM floor_plans WHERE id=$1", [req.params.id]);
    if (!existing.rowCount) return res.sendStatus(404);
    if (existing.rows[0].projectId !== projectId) return res.status(409).json({ ok: false, error: "The project assigned to a floor plan cannot be changed" });
    return res.json({ ok: true, projectId });
  } catch (error) {
    console.error("Floor plan project assignment error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

// Remove a floor plan and its cascaded device layout, then delete its stored PDF.
app.delete("/api/floor-plans/:id", async (req, res) => {
  try {
    await ensureFloorPlanSchema();
    const existing = await pool.query("SELECT pdf_path FROM floor_plans WHERE id=$1", [req.params.id]);
    if (!existing.rowCount) return res.sendStatus(404);

    const pdfPath = path.resolve(existing.rows[0].pdf_path);
    const planRoot = path.resolve(floorPlanUploadDirectory);
    const relativePath = path.relative(planRoot, pdfPath);
    const isManagedUpload = relativePath && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
    if (!isManagedUpload) return res.status(400).json({ ok: false, error: "The stored PDF is outside the floor plan upload directory" });

    const deleted = await pool.query("DELETE FROM floor_plans WHERE id=$1 RETURNING id", [req.params.id]);
    if (!deleted.rowCount) return res.sendStatus(404);
    if (existsSync(pdfPath)) unlinkSync(pdfPath);
    return res.json({ ok: true, id: deleted.rows[0].id });
  } catch (error) {
    console.error("Floor plan delete error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

app.get("/api/floor-plans/:id/layout", async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  try {
    await ensureFloorPlanSchema();
    const plan = await pool.query("SELECT id FROM floor_plans WHERE id=$1", [req.params.id]);
    if (!plan.rowCount) return res.sendStatus(404);
    const result = await pool.query(
      `SELECT id,device_id AS "deviceId",panel_id AS "panelId",device_type AS "deviceType",loop_no AS loop,address,zone,label,norm_x AS "normX",norm_y AS "normY",rotation
       FROM floor_plan_devices WHERE floor_plan_id=$1 AND page_number=$2 ORDER BY id`, [req.params.id, page]);
    return res.json({ ok: true, devices: result.rows });
  } catch (error) {
    console.error("Floor plan layout read error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  }
});

app.post("/api/floor-plans/:id/layout", async (req, res) => {
  const page = Number(req.body?.page || 1);
  const devices = req.body?.devices;
  if (!Number.isInteger(page) || page < 1 || !Array.isArray(devices) || devices.length > 5000) {
    return res.status(400).json({ ok: false, error: "Invalid page or device list" });
  }
  const allowedTypes = new Set(["SD", "HD", "MS", "MCP", "SND/FL", "MOD", "FACP"]);
  const normalized = [];
  for (const device of devices) {
    const normX = Number(device?.normX), normY = Number(device?.normY), rotation = Number(device?.rotation || 0);
    if (!allowedTypes.has(device?.deviceType) || !Number.isFinite(normX) || !Number.isFinite(normY) || normX < 0 || normX > 1 || normY < 0 || normY > 1 || !Number.isInteger(rotation)) {
      return res.status(400).json({ ok: false, error: "Invalid device mapping" });
    }
    normalized.push({
      projectId: String(device.projectId || "").slice(0, 120),
      values: [randomUUID(), req.params.id, page, String(device.deviceId || "").slice(0, 120) || null, String(device.panelId || "").slice(0, 120) || null, device.deviceType,
        String(device.loop || "").slice(0, 40), String(device.address || "").slice(0, 80), String(device.zone || "").slice(0, 80), String(device.label || "").slice(0, 160), normX, normY, rotation % 360],
    });
  }
  const client = await pool.connect().catch(() => null);
  if (!client) return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  try {
    await ensureFloorPlanSchema();
    await client.query("BEGIN");
    const plan = await client.query("SELECT id,page_count,project_id FROM floor_plans WHERE id=$1 FOR UPDATE", [req.params.id]);
    if (!plan.rowCount || page > plan.rows[0].page_count) {
      await client.query("ROLLBACK");
      return res.sendStatus(plan.rowCount ? 400 : 404);
    }
    if (normalized.some((item) => item.projectId !== String(plan.rows[0].project_id || ""))) {
      await client.query("ROLLBACK");
      return res.status(400).json({ ok: false, error: "A floor plan can only contain devices from its assigned project" });
    }
    await client.query("DELETE FROM floor_plan_devices WHERE floor_plan_id=$1 AND page_number=$2", [req.params.id, page]);
    for (const item of normalized) await client.query(
      `INSERT INTO floor_plan_devices (id,floor_plan_id,page_number,device_id,panel_id,device_type,loop_no,address,zone,label,norm_x,norm_y,rotation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, item.values);
    await client.query("COMMIT");
    return res.json({ ok: true, count: normalized.length });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Floor plan layout save error:", error);
    return res.status(503).json({ ok: false, error: "Floor plan service temporarily unavailable" });
  } finally { client.release(); }
});

app.get("/api/floor-plans/:id/export", async (req, res) => {
  const pageNumber = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  try {
    await ensureFloorPlanSchema();
    const result = await pool.query("SELECT name,pdf_path,page_count FROM floor_plans WHERE id=$1", [req.params.id]);
    const plan = result.rows[0];
    if (!plan || !existsSync(plan.pdf_path)) return res.sendStatus(404);
    if (pageNumber > plan.page_count) return res.sendStatus(400);
    const pdf = await PDFDocument.load(readFileSync(plan.pdf_path));
    const page = pdf.getPage(pageNumber - 1);
    const { width, height } = page.getSize();
    const rows = await pool.query("SELECT device_type AS type,address,zone,label,norm_x AS x,norm_y AS y,rotation FROM floor_plan_devices WHERE floor_plan_id=$1 AND page_number=$2", [req.params.id, pageNumber]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const ink = rgb(0.02, 0.15, 0.30), white = rgb(1, 1, 1);
    const drawCenteredGlyph = (text, centerX, centerY, rotation) => {
      // Size and rotate the glyph around the symbol center so it stays inside its frame.
      const maxTextWidth = 18;
      const size = Math.min(7, maxTextWidth / Math.max(font.widthOfTextAtSize(text, 7), 0.1) * 7);
      const textWidth = font.widthOfTextAtSize(text, size);
      const textHeight = font.heightAtSize(size);
      const radians = rotation * Math.PI / 180;
      const cosine = Math.cos(radians), sine = Math.sin(radians);
      const originX = centerX - cosine * textWidth / 2 + sine * textHeight / 2;
      const originY = centerY - sine * textWidth / 2 - cosine * textHeight / 2;
      page.drawText(text, { x: originX, y: originY, size, font, color: ink, rotate: degrees(rotation) });
    };
    for (const device of rows.rows) {
      const x = device.x * width, y = height - device.y * height;
      // Draw each marker from PDF vector primitives so the original plan stays vector-quality.
      if (["SD", "HD", "MS"].includes(device.type)) {
        page.drawCircle({ x, y, size: 9, color: white, borderColor: ink, borderWidth: 1.4, rotate: degrees(device.rotation) });
        const radians = device.rotation * Math.PI / 180;
        const dx = Math.cos(radians) * 4, dy = Math.sin(radians) * 4;
        page.drawLine({ start: { x: x - dx, y: y - dy }, end: { x: x + dx, y: y + dy }, thickness: 0.8, color: ink });
        page.drawLine({ start: { x: x + dy, y: y - dx }, end: { x: x - dy, y: y + dx }, thickness: 0.8, color: ink });
        if (device.type === "MS") page.drawCircle({ x, y, size: 2, color: ink });
      } else {
        const radians = device.rotation * Math.PI / 180;
        const cosine = Math.cos(radians), sine = Math.sin(radians);
        // pdf-lib rotates rectangles around their lower-left origin. Move that
        // origin so the rotated rectangle remains centered on the saved point.
        const boxX = x - cosine * 12 + sine * 8;
        const boxY = y - sine * 12 - cosine * 8;
        page.drawRectangle({ x: boxX, y: boxY, width: 24, height: 16, color: white, borderColor: ink, borderWidth: 1.4, rotate: degrees(device.rotation) });
        const glyph = device.type === "SND/FL" ? "S/F" : device.type;
        drawCenteredGlyph(glyph, x, y, device.rotation);
      }
      const tag = String(device.address || device.label || device.type).replace(/[^\x20-\x7E]/g, "").slice(0, 40);
      if (tag) page.drawText(tag, { x: x + 15, y: y - 3, size: 7, font, color: ink });
      if (device.zone) {
        const zone = String(device.zone).replace(/[^\x20-\x7E]/g, "").slice(0, 30);
        if (zone) page.drawText(zone, { x: x + 15, y: y - 11, size: 6, font, color: ink });
      }
    }
    const bytes = await pdf.save();
    const filename = `${plan.name.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 80) || "floor-plan"}-mapped.pdf`;
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"`, "X-Content-Type-Options": "nosniff" });
    return res.send(Buffer.from(bytes));
  } catch (error) {
    console.error("Floor plan export error:", error);
    return res.status(500).json({ ok: false, error: "Could not export this floor plan" });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");
    res.json({ ok: true, database: "connected", databaseTime: result.rows[0].database_time });
  } catch (error) {
    res.status(503).json({ ok: false, database: "unavailable", error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message });
  }
});

app.get("/api/state", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT payload, updated_at FROM app_state WHERE workspace_key = $1",
      [workspaceKey],
    );
    if (!result.rowCount) return res.json({ workspaceKey, payload: null, updatedAt: null });
    res.json({ workspaceKey, payload: result.rows[0].payload, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    res.status(503).json({ ok: false, error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message });
  }
});

app.get("/api/projects/:projectId/image", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT payload FROM app_state WHERE workspace_key = $1",
      [workspaceKey],
    );
    const project = result.rows[0]?.payload?.projects?.find((item) => item?.id === req.params.projectId);
    const source = typeof project?.image === "string" ? project.image : "";
    const match = source.match(/^data:image\/(png|jpeg|jpg|webp|gif|avif|bmp);base64,([A-Za-z0-9+/=]+)$/i);
    if (!match) return res.sendStatus(404);

    const contentType = match[1].toLowerCase() === "jpg" ? "image/jpeg" : `image/${match[1].toLowerCase()}`;
    res.set({
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    return res.send(Buffer.from(match[2], "base64"));
  } catch (error) {
    return res.status(503).json({ ok: false, error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message });
  }
});

app.get("/api/projects/:projectId/images/:imageId", async (req, res) => {
  try {
    const result = await pool.query("SELECT payload FROM app_state WHERE workspace_key = $1", [workspaceKey]);
    const project = result.rows[0]?.payload?.projects?.find((item) => item?.id === req.params.projectId);
    const gallery = Array.isArray(project?.images) ? project.images : [];
    const image = gallery.find((item) => (typeof item === "string" ? `${project.id}-image-${gallery.indexOf(item) + 1}` : item?.id) === req.params.imageId);
    const source = typeof image === "string" ? image : image?.src || "";
    const match = source.match(/^data:image\/(png|jpeg|jpg|webp|gif|avif|bmp);base64,([A-Za-z0-9+/=]+)$/i);
    if (!match) return res.sendStatus(404);
    const contentType = match[1].toLowerCase() === "jpg" ? "image/jpeg" : `image/${match[1].toLowerCase()}`;
    res.set({ "Content-Type": contentType, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    return res.send(Buffer.from(match[2], "base64"));
  } catch (error) {
    return res.status(503).json({ ok: false, error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message });
  }
});

const saveState = async (req, res) => {
  const payload = req.body?.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ ok: false, error: "payload must be a JSON object" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO app_state (workspace_key, payload, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (workspace_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW() RETURNING updated_at",
      [workspaceKey, JSON.stringify(payload)],
    );
    res.json({ ok: true, workspaceKey, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    res.status(503).json({ ok: false, error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message });
  }
};

app.put("/api/state", saveState);
app.post("/api/state", saveState);

if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory, { index: "index.html" }));
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
    if (req.method !== "GET" || !existsSync(distIndex)) return next();
    res.sendFile(distIndex, (error) => { if (error) next(error); });
  });
}

const server = app.listen(port, "0.0.0.0", () => {
  console.log("Monitoring API listening on port " + port);
});

const shutdown = async (signal) => {
  console.log(signal + " received; shutting down gracefully.");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
