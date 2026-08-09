-- ============================================================
-- AoE IV Roulette – Database Schema
-- Run this once in your Vercel Postgres / Neon console
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id               TEXT PRIMARY KEY,
  date             TEXT NOT NULL,
  map_id           TEXT NOT NULL,
  player1_civ_id   TEXT NOT NULL,
  player1_color_id TEXT NOT NULL DEFAULT '',
  player2_civ_id   TEXT NOT NULL,
  player2_color_id TEXT NOT NULL DEFAULT '',
  winner           TEXT NOT NULL,
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing matches newest-first
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches (created_at DESC);
