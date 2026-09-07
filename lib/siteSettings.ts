import "server-only";
import { query } from "@/lib/db";

export type SiteSettings = { title: string; logoUrl: string | null };

const DEFAULT_SETTINGS: SiteSettings = {
  title: "Shabbir Khan — Graphic Designer & Web Developer",
  logoUrl: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await query<{ title: string; logo_url: string | null }>(
      "SELECT title, logo_url FROM site_settings WHERE id = 1"
    );
    if (rows.length === 0) return DEFAULT_SETTINGS;
    return { title: rows[0].title, logoUrl: rows[0].logo_url };
  } catch {
    // DB not reachable/seeded yet — fall back rather than break every page.
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  await query(
    `INSERT INTO site_settings (id, title, logo_url)
     VALUES (1, $1, $2)
     ON CONFLICT (id) DO UPDATE SET
       title = COALESCE($1, site_settings.title),
       logo_url = COALESCE($2, site_settings.logo_url)`,
    [settings.title ?? null, settings.logoUrl ?? null]
  );
}
