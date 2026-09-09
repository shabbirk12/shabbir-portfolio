import { Pool } from "pg";
import bcrypt from "bcryptjs";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("Set DATABASE_URL before running this script.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DB_URL,
  ssl: DB_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

const username = process.env.ADMIN_USERNAME || "shabbirk12";
const newPassword = process.env.ADMIN_PASSWORD || "AsharSamir@321";

const hash = bcrypt.hashSync(newPassword, 12);
await pool.query(
  "UPDATE admin_users SET password_hash = $1 WHERE username = $2",
  [hash, username]
);
console.log(`✅ Password updated for user "${username}"`);

const rows = await pool.query("SELECT id, username, email FROM admin_users");
console.log("Admin users in DB:", rows.rows);
await pool.end();
