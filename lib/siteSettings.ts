import "server-only";
import { query } from "@/lib/db";

export type SiteSettings = {
  title: string;
  logoUrl: string | null;
  avatarUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  bgColor: string | null;
  textColor: string | null;
  accentGradient: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
  title: "Shabbir Khan — Graphic Designer & Web Developer",
  logoUrl: null,
  avatarUrl: null,
  primaryColor: null,
  secondaryColor: null,
  bgColor: null,
  textColor: null,
  accentGradient: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await query<{
      title: string;
      logo_url: string | null;
      avatar_url: string | null;
      primary_color?: string | null;
      secondary_color?: string | null;
      bg_color?: string | null;
      text_color?: string | null;
      accent_gradient?: string | null;
    }>("SELECT * FROM site_settings WHERE id = 1");

    if (rows.length === 0) return DEFAULT_SETTINGS;
    return {
      title: rows[0].title,
      logoUrl: rows[0].logo_url,
      avatarUrl: rows[0].avatar_url ?? null,
      primaryColor: rows[0].primary_color ?? null,
      secondaryColor: rows[0].secondary_color ?? null,
      bgColor: rows[0].bg_color ?? null,
      textColor: rows[0].text_color ?? null,
      accentGradient: rows[0].accent_gradient ?? null,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = await getSiteSettings();
  const nextTitle = settings.title !== undefined ? settings.title : current.title;
  const nextLogo = settings.logoUrl !== undefined ? settings.logoUrl : current.logoUrl;
  const nextAvatar = settings.avatarUrl !== undefined ? settings.avatarUrl : current.avatarUrl;
  const nextPrimary = settings.primaryColor !== undefined ? settings.primaryColor : current.primaryColor;
  const nextSecondary = settings.secondaryColor !== undefined ? settings.secondaryColor : current.secondaryColor;
  const nextBg = settings.bgColor !== undefined ? settings.bgColor : current.bgColor;
  const nextText = settings.textColor !== undefined ? settings.textColor : current.textColor;
  const nextGradient = settings.accentGradient !== undefined ? settings.accentGradient : current.accentGradient;

  await query(
    `INSERT INTO site_settings (id, title, logo_url, avatar_url, primary_color, secondary_color, bg_color, text_color, accent_gradient)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       title = $1,
       logo_url = $2,
       avatar_url = $3,
       primary_color = $4,
       secondary_color = $5,
       bg_color = $6,
       text_color = $7,
       accent_gradient = $8`,
    [nextTitle, nextLogo, nextAvatar, nextPrimary, nextSecondary, nextBg, nextText, nextGradient]
  );
}
