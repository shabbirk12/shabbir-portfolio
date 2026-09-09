-- Shabbir Khan portfolio — database schema
-- Run this once against your Postgres database before first deploy.
-- Safe to re-run: every statement is IF NOT EXISTS / idempotent.

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON password_reset_tokens(user_id);

-- Single-row table: site-wide branding shown in Nav/Footer/metadata.
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Shabbir Khan — Graphic Designer & Web Developer',
  logo_url TEXT,
  avatar_url TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO site_settings (id, title, logo_url, avatar_url)
VALUES (1, 'Shabbir Khan — Graphic Designer & Web Developer', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Projects: the full case-study object is stored as JSONB. This mirrors the
-- existing WorkItem shape exactly (see lib/types.ts) — no separate migration
-- of nested fields into columns needed, and the admin form/validation code
-- barely has to change.
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);

-- Content collections: skills, services, lab, stats, about-details, toolkit.
-- Each is stored whole as JSONB under its name, same shape as the old
-- data/*.json files — same reasoning as projects above.
CREATE TABLE IF NOT EXISTS content_collections (
  name TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
