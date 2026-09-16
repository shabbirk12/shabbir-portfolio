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
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS accent_gradient TEXT;
    ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      company TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT[] DEFAULT '{}',
      read_time TEXT DEFAULT '4 min read',
      published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("✅ Database schema updated with reviews, blog_posts, and gemini_api_key!");

  // Seed default approved reviews if none exist
  const revCount = await pool.query("SELECT COUNT(*) FROM reviews");
  if (parseInt(revCount.rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO reviews (name, role, company, rating, content, status) VALUES
      ('Marcus Vance', 'Managing Director', 'The Camden Brokers', 5, 'Shabbir delivered a brand identity and high-converting web platform that immediately repositioned our multi-asset brokerage. The aesthetic polish and technical speed are second to none.', 'approved'),
      ('Elena Rostova', 'Founder & Creative Lead', 'Nocturne London', 5, 'Exceptional eye for detail and visual rhythm. From event key art to digital campaign collateral, Shabbir turned our club night into London''s most recognizable underground brand.', 'approved'),
      ('Tariq Al-Mansoor', 'Product Lead', 'WatBee SaaS', 5, 'Working with Shabbir bridged the gap between complex WhatsApp automation logic and slick, intuitive UI. He doesn''t just design — he engineers with real craft.', 'approved')
    `);
    console.log("✅ Seeded initial approved reviews!");
  }

  // Seed default blog posts if none exist
  const blogCount = await pool.query("SELECT COUNT(*) FROM blog_posts");
  if (parseInt(blogCount.rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, read_time, published) VALUES
      (
        'Designing Identity Systems for the Underground Hospitality Scene',
        'designing-identity-systems-hospitality',
        'How high-contrast typography, kinetic posters, and physical menu print survive in demanding, low-light club and bar environments.',
        '# Designing Identity Systems for the Underground Hospitality Scene\n\nNightlife and boutique hospitality demand a fundamentally different visual language than corporate enterprise design. When your brand lives primarily on mobile feeds at 1 AM, printed on tactile textured cardstock under dim amber lighting, or animated across LED festival screens, legibility and atmospheric energy must coexist.\n\n## 1. High Contrast & Ambient Lighting\nIn a dimly lit venue, subtle gradients and delicate gray text vanish entirely. We prioritize stark typographic contrasts: brutalist sans-serif headers paired with bespoke editorial script flourishes. The color palette must cut through shadows without feeling clinical.\n\n## 2. Print Runs That Take a Beating\nA luxury cocktail menu or club night flyer is not just a digital asset exported to PDF. Paper stock weight, soft-touch matte lamination, and metallic foil stamping transform a brand from a mere logo into a tactile luxury experience.\n\n## 3. Kinetic Visuals for Social Motion\nModern hospitality brands live on Instagram Stories and TikTok. Static posters must be conceived from day one with motion in mind — animated loops, reactive typography, and sound-synced rhythm.',
        '/images/work-hiphop.jpg',
        ARRAY['Branding', 'Design Systems', 'Hospitality'],
        '4 min read',
        true
      ),
      (
        'Building Next-Generation Portfolios with Next.js 14 and Custom Shaders',
        'building-nextjs-portfolio-shaders',
        'A technical deep dive into GPU-accelerated cursor physics, halftone particle fields, and zero-compromise page performance.',
        '# Building Next-Generation Portfolios with Next.js 14 and Custom Shaders\n\nCreative development shouldn''t mean sacrificing Core Web Vitals. For this portfolio, the mandate was uncompromising: fluid 60fps interactive particle fields, GPU-accelerated halftone backgrounds, and instantaneous page navigation without bloated asset bundles.\n\n## Architecture & Tech Stack\n- **Framework**: Next.js 14 App Router with Server Components for static SEO speed\n- **Styling**: Tailwind CSS with dynamic custom CSS variables for instant theme personalization\n- **Canvas & Physics**: Lightweight requestAnimationFrame canvas particle loops that throttle automatically when scrolled offscreen\n- **Database**: Supabase PostgreSQL for live content management with zero local JSON dependency\n\n## Zero-Lag Focus & Clean Typography\nEvery pixel is calibrated for intent. By combining custom Fontshare typefaces (General Sans and Switzer) with editorial accents, we establish a signature aesthetic that feels timeless rather than trendy.',
        '/images/work-camden.jpg',
        ARRAY['Web Development', 'Next.js', 'Performance'],
        '5 min read',
        true
      )
    `);
    console.log("✅ Seeded initial blog posts!");
  }

  const res = await pool.query("SELECT * FROM site_settings WHERE id = 1");
  console.log("Current site_settings:", res.rows[0]);
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
