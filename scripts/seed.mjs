// One-time migration: loads the existing data/*.json files into Postgres,
// and creates the initial admin user. Safe to re-run (uses upserts).
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/seed.mjs
// (or just `node scripts/seed.mjs` if DATABASE_URL is already in your shell env —
//  it does NOT read .env.local automatically, since this runs outside Next.js)

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Set DATABASE_URL before running this script.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

function readJSON(file) {
  const p = path.join(ROOT, "data", file);
  if (!existsSync(p)) {
    console.warn(`  (skipping ${file} — not found)`);
    return null;
  }
  return JSON.parse(readFileSync(p, "utf8"));
}

async function main() {
  console.log("Applying schema...");
  const schema = readFileSync(path.join(ROOT, "db", "schema.sql"), "utf8");
  await pool.query(schema);

  console.log("Seeding projects...");
  const projects = readJSON("projects.json");
  if (projects) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await pool.query(
        `INSERT INTO projects (slug, sort_order, data)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET data = $3, sort_order = $2`,
        [p.slug, i, JSON.stringify(p)]
      );
    }
    console.log(`  ${projects.length} projects seeded.`);
  }

  console.log("Seeding content collections...");
  const collections = [
    ["skills", "skills.json"],
    ["services", "services.json"],
    ["lab", "lab.json"],
    ["stats", "stats.json"],
    ["about-details", "about-details.json"],
    ["toolkit", "toolkit.json"],
  ];
  for (const [name, file] of collections) {
    const data = readJSON(file);
    if (data === null) continue;
    await pool.query(
      `INSERT INTO content_collections (name, data)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET data = $2`,
      [name, JSON.stringify(data)]
    );
    console.log(`  ${name} seeded.`);
  }

  console.log("Creating initial admin user...");
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const email = process.env.SEED_ADMIN_EMAIL || "contact@shabbirkhan.dev";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      "  SEED_ADMIN_PASSWORD not set — skipping admin user creation.\n" +
        "  Re-run with SEED_ADMIN_PASSWORD=yourpassword to create one, e.g.:\n" +
        "  DATABASE_URL=... SEED_ADMIN_PASSWORD=... node scripts/seed.mjs"
    );
  } else {
    const hash = bcrypt.hashSync(password, 12);
    await pool.query(
      `INSERT INTO admin_users (username, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO UPDATE SET password_hash = $3, email = $2`,
      [username, email, hash]
    );
    console.log(`  Admin user "${username}" ready (email: ${email}).`);
  }

  console.log("\nDone.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
