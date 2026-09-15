import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Spotlight from "@/components/Spotlight";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const primary = settings.primaryColor || "#c6ff3d";
  const bg = settings.bgColor || "#0a0a0a";
  const text = settings.textColor || "#f2f1ed";
  const gradient = settings.accentGradient?.trim() || "";

  const themeOverrides = [
    `:root { --color-lime: ${primary}; --color-mint: ${primary}; --color-ink: ${bg}; --color-paper: ${text}; ${
      gradient ? `--accent-gradient: ${gradient};` : ""
    } }`,
    `.text-lime, .text-mint { color: ${primary} !important; }`,
    `.bg-lime, .bg-mint { background-color: ${primary} !important; }`,
    `.border-lime, .border-mint { border-color: ${primary} !important; }`,
    `body { background-color: ${bg} !important; color: ${text} !important; }`,
    `::selection { background-color: ${primary} !important; color: ${bg} !important; }`,
    `:focus-visible { outline-color: ${primary} !important; }`,
    gradient
      ? `.accent-gradient { background: ${gradient} !important; } .accent-gradient-text { background: ${gradient} !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="en">
      <body className="font-body bg-ink text-paper antialiased">
        {themeOverrides && (
          <style dangerouslySetInnerHTML={{ __html: themeOverrides }} />
        )}
        <div className="grain-overlay bg-grain" aria-hidden="true" />
        <Spotlight />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
