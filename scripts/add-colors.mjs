import { Pool } from "pg";

const DB_URL = process.env.DATABASE_URL || "postgresql://postgres.lujkfwuempbdemfaikyk:AsharSamir%40321@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await pool.query(`
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS primary_color TEXT;
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_color TEXT;
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bg_color TEXT;
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS text_color TEXT;
  `);
  console.log("✅ site_settings color columns added successfully!");
  const res = await pool.query("SELECT * FROM site_settings WHERE id = 1");
  console.log("Current row:", res.rows[0]);
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
