// Shared Neon Postgres connection for API routes
// Uses @neondatabase/serverless which works in Vercel serverless functions
import { Pool } from '@neondatabase/serverless';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

if (!connectionString) {
  console.warn('[db] No POSTGRES_URL / DATABASE_URL env var found.');
}

export const pool = new Pool({ connectionString });
export type DB = typeof pool;
