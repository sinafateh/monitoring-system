import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.API_PORT || 3001);
const workspaceKey = process.env.WORKSPACE_KEY || "monitoring-system";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST || undefined,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE || undefined,
  user: process.env.PGUSER || undefined,
  password: process.env.PGPASSWORD || undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");
    res.json({ ok: true, database: "connected", databaseTime: result.rows[0].database_time });
  } catch (error) {
    res.status(503).json({ ok: false, database: "unavailable", error: error.message });
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
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.put("/api/state", async (req, res) => {
  const payload = req.body?.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ ok: false, error: "payload must be a JSON object" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO app_state (workspace_key, payload, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (workspace_key)
       DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
       RETURNING updated_at`,
      [workspaceKey, JSON.stringify(payload)],
    );
    res.json({ ok: true, workspaceKey, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Monitoring API listening on http://localhost:${port}`);
});

