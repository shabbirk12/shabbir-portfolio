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

  const themeVariables = [
    settings.primaryColor ? `--color-lime: ${settings.primaryColor};` : null,
    settings.secondaryColor ? `--color-mint: ${settings.secondaryColor};` : null,
    settings.bgColor ? `--color-ink: ${settings.bgColor};` : null,
    settings.textColor ? `--color-paper: ${settings.textColor};` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="en">
      <head>
        {themeVariables && (
          <style dangerouslySetInnerHTML={{ __html: `:root { ${themeVariables} }` }} />
        )}
      </head>
      <body className="font-body bg-ink text-paper antialiased">
        <div className="grain-overlay bg-grain" aria-hidden="true" />
        <Spotlight />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
