"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function hexToRgbChannels(hex: string, fallback = "198 255 61"): string {
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

function applyTheme(settings: {
  primaryColor?: string;
  bgColor?: string;
  textColor?: string;
  accentGradient?: string;
}) {
  const primary = settings.primaryColor || "#c6ff3d";
  const bg = settings.bgColor || "#0a0a0a";
  const text = settings.textColor || "#f2f1ed";
  const gradient = settings.accentGradient?.trim() || "";

  const primaryRgb = hexToRgbChannels(primary, "198 255 61");
  const bgRgb = hexToRgbChannels(bg, "10 10 10");
  const paperRgb = hexToRgbChannels(text, "242 241 237");
  const limeInk = getContrastInkColor(primary);
  const limeGlow = `rgba(${primaryRgb.split(" ").join(", ")}, 0.45)`;

  const el = document.documentElement;
  el.style.setProperty("--color-lime-rgb", primaryRgb);
  el.style.setProperty("--color-lime", primary);
  el.style.setProperty("--color-lime-ink", limeInk);
  el.style.setProperty("--color-lime-glow", limeGlow);
  el.style.setProperty("--color-mint-rgb", primaryRgb);
  el.style.setProperty("--color-mint", primary);
  el.style.setProperty("--color-mint-ink", limeInk);
  el.style.setProperty("--color-ink-rgb", bgRgb);
  el.style.setProperty("--color-ink", bg);
  el.style.setProperty("--color-paper-rgb", paperRgb);
  el.style.setProperty("--color-paper", text);

  if (gradient) {
    el.style.setProperty("--accent-gradient", gradient);
  } else {
    el.style.removeProperty("--accent-gradient");
  }

  // Also update body background and text color directly
  document.body.style.backgroundColor = bg;
  document.body.style.color = text;
}

export default function ThemeProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((settings) => {
        if (!cancelled) applyTheme(settings);
      })
      .catch(() => {/* silently ignore — SSR style tag still covers first render */});
    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
