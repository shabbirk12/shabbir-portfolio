import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Spotlight from "@/components/Spotlight";
import { getSiteSettings } from "@/lib/siteSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL("https://shabbirk.com"),
    title: settings.title,
    description:
      "Freelance designer-developer building brand identities, event campaigns and full-stack products for hospitality, finance and the events scene.",
    icons: settings.logoUrl ? { icon: settings.logoUrl } : undefined,
    openGraph: {
      title: settings.title,
      description: "Brand systems, product engineering and codeless web builds.",
      url: "https://shabbirk.com",
      siteName: "Shabbir Khan",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* General Sans (display) + Switzer (body) via Fontshare — closest free match
            to the reference site's grotesk. Loaded at runtime, not bundled at build. */}
        
        
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
