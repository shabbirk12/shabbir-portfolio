import "server-only";
import { query } from "@/lib/db";

export type SiteSettings = {
  title: string;
  logoUrl: string | null;
  avatarUrl: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
  title: "Shabbir Khan — Graphic Designer & Web Developer",
  logoUrl: null,
  avatarUrl: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await query<{ title: string; logo_url: string | null; avatar_url: string | null }>(
      "SELECT title, logo_url, avatar_url FROM site_settings WHERE id = 1"
    );
    if (rows.length === 0) return DEFAULT_SETTINGS;
    return {
      title: rows[0].title,
      logoUrl: rows[0].logo_url,
      avatarUrl: rows[0].avatar_url ?? null,
    };
  } catch {
    // DB not reachable/seeded yet or column not yet added — fall back gracefully.
    try {
      const rows = await query<{ title: string; logo_url: string | null }>(
        "SELECT title, logo_url FROM site_settings WHERE id = 1"
      );
      if (rows.length === 0) return DEFAULT_SETTINGS;
      return { title: rows[0].title, logoUrl: rows[0].logo_url, avatarUrl: null };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = await getSiteSettings();
  const nextTitle = settings.title !== undefined ? settings.title : current.title;
  const nextLogo = settings.logoUrl !== undefined ? settings.logoUrl : current.logoUrl;
  const nextAvatar = settings.avatarUrl !== undefined ? settings.avatarUrl : current.avatarUrl;

  await query(
    `INSERT INTO site_settings (id, title, logo_url, avatar_url)
     VALUES (1, $1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET
       title = $1,
       logo_url = $2,
       avatar_url = $3`,
    [nextTitle, nextLogo, nextAvatar]
  );
}
