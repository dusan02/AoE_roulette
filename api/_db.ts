// Shared Neon Postgres connection for API routes
// Uses @neondatabase/serverless which works in Vercel serverless functions
import { Pool, neonConfig } from '@neondatabase/serverless';

// Use websockets for better serverless compatibility
neonConfig.webSocketConstructor = undefined as any;

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
