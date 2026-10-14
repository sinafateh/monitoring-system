CREATE TABLE IF NOT EXISTS floor_plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  pdf_path TEXT NOT NULL,
  page_count INTEGER NOT NULL CHECK (page_count > 0),
  width DOUBLE PRECISION NOT NULL CHECK (width > 0),
  height DOUBLE PRECISION NOT NULL CHECK (height > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS floor_plan_devices (
  id UUID PRIMARY KEY,
  floor_plan_id UUID NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL DEFAULT 1 CHECK (page_number > 0),
  device_id TEXT,
  device_type TEXT NOT NULL,
  loop_no TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  zone TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  norm_x DOUBLE PRECISION NOT NULL CHECK (norm_x BETWEEN 0 AND 1),
  norm_y DOUBLE PRECISION NOT NULL CHECK (norm_y BETWEEN 0 AND 1),
  rotation INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS floor_plan_devices_plan_page_idx ON floor_plan_devices(floor_plan_id, page_number);
ALTER TABLE floor_plan_devices ADD COLUMN IF NOT EXISTS loop_no TEXT NOT NULL DEFAULT '';
