import { Pool } from "pg";
import fs from "fs";

const DB_URL = process.env.DATABASE_URL || "postgresql://postgres.lujkfwuempbdemfaikyk:AsharSamir%40321@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const services = JSON.parse(fs.readFileSync("data/services.json", "utf8"));
  await pool.query(
    "INSERT INTO content_collections (name, data, updated_at) VALUES ($1, $2, now()) ON CONFLICT (name) DO UPDATE SET data = $2, updated_at = now()",
    ["services", JSON.stringify(services)]
  );
  console.log("✅ Services content collection successfully updated in DB!");
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
