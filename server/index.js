import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const workspaceKey = process.env.WORKSPACE_KEY || "monitoring-system";
const currentFile = fileURLToPath(import.meta.url);
const serverDirectory = path.dirname(currentFile);
const projectDirectory = path.resolve(serverDirectory, "..");
const distDirectory = path.join(projectDirectory, "dist");
const distIndex = path.join(distDirectory, "index.html");
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
app.use(cors(corsOptions));
// Project images are stored in the same JSON state as the project metadata.
// Keep enough headroom for several uploaded images in one workspace.
app.use(express.json({ limit: "25mb" }));

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
