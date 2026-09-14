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

  const themeOverrides = [
    settings.primaryColor
      ? `.text-lime { color: ${settings.primaryColor} !important; } .bg-lime { background-color: ${settings.primaryColor} !important; } .border-lime { border-color: ${settings.primaryColor} !important; } :root { --color-lime: ${settings.primaryColor}; }`
      : null,
    settings.secondaryColor
      ? `.text-mint { color: ${settings.secondaryColor} !important; } .bg-mint { background-color: ${settings.secondaryColor} !important; } .border-mint { border-color: ${settings.secondaryColor} !important; } :root { --color-mint: ${settings.secondaryColor}; }`
      : null,
    settings.bgColor
      ? `body { background-color: ${settings.bgColor} !important; } :root { --color-ink: ${settings.bgColor}; }`
      : null,
    settings.textColor
      ? `body { color: ${settings.textColor} !important; } :root { --color-paper: ${settings.textColor}; }`
      : null,
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
