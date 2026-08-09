// Shared Postgres connection pool for API routes
import { Pool } from 'pg';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

if (!connectionString) {
  // We don't throw at import time so that `vercel dev` / build doesn't crash
  // when env vars are missing; individual routes will surface a clear error.
  console.warn('[db] No POSTGRES_URL / DATABASE_URL env var found.');
}

export const pool = new Pool({
  connectionString,
  // Neon / Vercel Postgres require SSL
  ssl: connectionString ? { rejectUnauthorized: false } : undefined,
  max: 5,
});

export type DB = typeof pool;
