import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Spotlight from "@/components/Spotlight";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteSettings } from "@/lib/siteSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL("https://shabbirkhan.dev"),
    title: settings.title,
    description:
      "Freelance designer-developer building brand identities, event campaigns and full-stack products for hospitality, finance and the events scene.",
    icons: settings.logoUrl ? { icon: settings.logoUrl } : undefined,
    openGraph: {
      title: settings.title,
      description: "Brand systems, product engineering and codeless web builds.",
      url: "https://shabbirkhan.dev",
      siteName: "Shabbir Khan",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
    },
  };
}

function hexToRgbChannels(hex: string, fallback: string = "198 255 61"): string {
  try {
    const clean = hex.replace("#", "").trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `${r} ${g} ${b}`;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `${r} ${g} ${b}`;
    }
  } catch {}
  return fallback;
}

function getContrastInkColor(hex: string): string {
  try {
    const clean = hex.replace("#", "").trim();
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 135 ? "#0a0a0a" : "#ffffff";
    }
  } catch {}
  return "#0a0a0a";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const primary = settings.primaryColor || "#c6ff3d";
  const bg = settings.bgColor || "#0a0a0a";
  const text = settings.textColor || "#f2f1ed";
  const gradient = settings.accentGradient?.trim() || "";

  const primaryRgb = hexToRgbChannels(primary, "198 255 61");
  const bgRgb = hexToRgbChannels(bg, "10 10 10");
  const paperRgb = hexToRgbChannels(text, "242 241 237");
  const limeInk = getContrastInkColor(primary);
  const limeGlow = `rgba(${primaryRgb.split(" ").join(", ")}, 0.45)`;

  const themeOverrides = [
    `:root {
      --color-lime-rgb: ${primaryRgb};
      --color-lime: ${primary};
      --color-lime-ink: ${limeInk};
      --color-lime-glow: ${limeGlow};
      --color-mint-rgb: ${primaryRgb};
      --color-mint: ${primary};
      --color-mint-ink: ${limeInk};
      --color-ink-rgb: ${bgRgb};
      --color-ink: ${bg};
      --color-paper-rgb: ${paperRgb};
      --color-paper: ${text};
      ${gradient ? `--accent-gradient: ${gradient};` : ""}
    }`,
    `body { background-color: ${bg} !important; color: ${text} !important; }`,
    `::selection { background-color: ${primary} !important; color: ${bg} !important; }`,
    gradient
      ? `button.bg-lime, a.bg-lime, .bg-lime { background: ${gradient} !important; }
         .accent-gradient-text { background: ${gradient} !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }`
      : `.accent-gradient-text { color: ${primary} !important; -webkit-text-fill-color: initial !important; background: none !important; }`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <html lang="en">
      <body className="font-body bg-ink text-paper antialiased">
        {themeOverrides && (
          <style dangerouslySetInnerHTML={{ __html: themeOverrides }} />
        )}
        <div className="grain-overlay bg-grain" aria-hidden="true" />
        <Spotlight />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
