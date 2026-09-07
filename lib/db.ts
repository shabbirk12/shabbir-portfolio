import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Postgres connection string to .env.local (see db/schema.sql and the deployment guide in EDITING_GUIDE.md)."
    );
  }
  return new Pool({
    connectionString,
    // Most managed Postgres providers (Neon, Supabase, Vercel's own) require
    // SSL; local Postgres during development does not. This flag disables
    // certificate verification rather than SSL itself — fine for these
    // providers' setups, standard practice for this driver.
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
}

// Reused across hot-reloads in dev and across warm serverless invocations —
// avoids exhausting the connection limit by creating a new pool per request.
const pool = global._pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") global._pgPool = pool;

export { pool };

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
