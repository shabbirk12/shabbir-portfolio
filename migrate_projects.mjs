import pkg from "pg";
const { Client } = pkg;
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projects = JSON.parse(readFileSync(join(__dirname, "data/projects.json"), "utf8"));

const client = new Client({
  connectionString: "postgresql://postgres.lujkfwuempbdemfaikyk:AsharSamir%40321@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

await client.connect();
console.log("Connected. Migrating", projects.length, "projects...");

const existing = await client.query("SELECT slug FROM projects");
const existingSlugs = new Set(existing.rows.map(r => r.slug));
console.log("Already in DB:", [...existingSlugs]);

let inserted = 0;
let skipped = 0;
for (let i = 0; i < projects.length; i++) {
  const p = projects[i];
  if (existingSlugs.has(p.slug)) {
    console.log("  SKIP (already exists):", p.slug);
    skipped++;
  } else {
    await client.query(
      "INSERT INTO projects (slug, sort_order, data) VALUES ($1, $2, $3)",
      [p.slug, i + 1, JSON.stringify(p)]
    );
    console.log("  INSERT:", p.slug);
    inserted++;
  }
}

await client.end();
console.log("Done. Inserted:", inserted, "Skipped:", skipped);
