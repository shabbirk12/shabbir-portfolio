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

function getContrastInk(hexColor: string): string {
  try {
    const hex = hexColor.replace("#", "").trim();
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? "#121212" : "#ffffff";
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? "#121212" : "#ffffff";
    }
  } catch {}
  return "#121212";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const primary = settings.primaryColor || "#c6ff3d";
  const limeInk = getContrastInk(primary);
  const darkBg = settings.bgColor || "#0a0a0a";
  const darkText = settings.textColor || "#f2f1ed";
  const gradient = settings.accentGradient?.trim() || "";

  const themeOverrides = `
    :root {
      --color-lime: ${primary};
      --color-mint: ${primary};
      --color-lime-ink: ${limeInk};
      --color-mint-ink: ${limeInk};
      ${gradient ? `--accent-gradient: ${gradient};` : ""}
    }

    :root, [data-theme="dark"], .dark {
      --color-ink: ${darkBg};
      --color-paper: ${darkText};
      --color-surface: #131313;
      --color-surface2: #1a1a1a;
      --color-line: #242424;
      --color-muted: #8f9490;
    }

    [data-theme="light"], .light {
      --color-ink: #f7f7f5;
      --color-paper: #111827;
      --color-surface: #ffffff;
      --color-surface2: #f0f0ee;
      --color-line: #e2e4e8;
      --color-muted: #64748b;
    }

    body {
      background-color: var(--color-ink) !important;
      color: var(--color-paper) !important;
    }

    ::selection {
      background-color: var(--color-lime) !important;
      color: var(--color-lime-ink) !important;
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('site_theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: themeOverrides }} />
      </head>
      <body className="font-body bg-ink text-paper antialiased">
        <div className="grain-overlay bg-grain" aria-hidden="true" />
        <Spotlight />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
