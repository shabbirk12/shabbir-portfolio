import pkg from "pg";
const { Client } = pkg;
const sql = "CREATE TABLE IF NOT EXISTS brands (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', logo_url TEXT, display_order INT NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())";
const client = new Client({ connectionString: "postgresql://postgres.lujkfwuempbdemfaikyk:AsharSamir%40321@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres", ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query(sql);
const r = await client.query("SELECT COUNT(*) as count FROM brands");
const count = Number(r.rows[0].count);
if (count === 0) { await client.query("INSERT INTO brands (name, category, display_order) VALUES ($1,$2,$3),($4,$5,$6),($7,$8,$9),($10,$11,$12),($13,$14,$15),($16,$17,$18),($19,$20,$21),($22,$23,$24)", ["The Camden Brokers","Luxury Asset Brokerage London",1,"Nocturne London","Nightlife and Festival Art",2,"WatBee SaaS","Automated Conversational Platform",3,"Aridian Array","Software Society PMAS",4,"Soft Wise Solution","Enterprise Software and Systems",5,"Ariesian Tech","Full-Stack Web Engineering",6,"Studio Nine","Creative Direction and Brand Identity",7,"Drive Tech BPO","Global Communications and Tech",8]); console.log("Seeded."); } else { console.log("Skip: " + count); }
await client.end();
console.log("Done.");
