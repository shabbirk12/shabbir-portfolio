import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    return null;
  }
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
      // Keep well under Supabase session-mode pooler limit of 15
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return global._pgPool;
}

export const pool = {
  query: (text: string, params?: unknown[]) => {
    const p = getPool();
    if (!p) throw new Error("DATABASE_URL is not set.");
    return p.query(text, params);
  },
};

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const p = getPool();
  if (!p) {
    throw new Error("DATABASE_URL is not set.");
  }
  const result = await p.query(text, params);
  return result.rows as T[];
}
