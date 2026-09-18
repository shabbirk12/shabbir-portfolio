"use client";

import { useEffect, useRef } from "react";

/* ---------- helpers (mirrored from layout.tsx server-side) ---------- */

function hexToRgbChannels(hex: string, fallback: string): string {
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

function getContrastInk(hex: string): string {
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

/* ---------- component ---------- */

export default function ThemeProvider() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function apply() {
      try {
        const res = await fetch("/api/site-settings", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const s = await res.json();

        const primary = s.primaryColor || "#c6ff3d";
        const bg = s.bgColor || "#0a0a0a";
        const text = s.textColor || "#f2f1ed";
        const gradient = s.accentGradient?.trim() || "";

        const primaryRgb = hexToRgbChannels(primary, "198 255 61");
        const bgRgb = hexToRgbChannels(bg, "10 10 10");
        const paperRgb = hexToRgbChannels(text, "242 241 237");
        const limeInk = getContrastInk(primary);
        const channels = primaryRgb.split(" ");
        const limeGlow = `rgba(${channels.join(", ")}, 0.45)`;

        const root = document.documentElement;

        root.style.setProperty("--color-lime-rgb", primaryRgb);
        root.style.setProperty("--color-lime", primary);
        root.style.setProperty("--color-lime-ink", limeInk);
        root.style.setProperty("--color-lime-glow", limeGlow);
        root.style.setProperty("--color-mint-rgb", primaryRgb);
        root.style.setProperty("--color-mint", primary);
        root.style.setProperty("--color-mint-ink", limeInk);
        root.style.setProperty("--color-ink-rgb", bgRgb);
        root.style.setProperty("--color-ink", bg);
        root.style.setProperty("--color-paper-rgb", paperRgb);
        root.style.setProperty("--color-paper", text);

        document.body.style.backgroundColor = bg;
        document.body.style.color = text;

        /* gradient overrides via style tag */
        if (styleRef.current) {
          styleRef.current.remove();
          styleRef.current = null;
        }

        if (gradient) {
          root.style.setProperty("--accent-gradient", gradient);
          const tag = document.createElement("style");
          tag.setAttribute("data-theme-gradient", "");
          tag.textContent = [
            `button.bg-lime, a.bg-lime, .bg-lime { background: ${gradient} !important; }`,
            `.accent-gradient-text { background: ${gradient} !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }`,
          ].join("\n");
          document.head.appendChild(tag);
          styleRef.current = tag;
        } else {
          root.style.removeProperty("--accent-gradient");
          const tag = document.createElement("style");
          tag.setAttribute("data-theme-gradient", "");
          tag.textContent = `.accent-gradient-text { color: ${primary} !important; -webkit-text-fill-color: initial !important; background: none !important; }`;
          document.head.appendChild(tag);
          styleRef.current = tag;
        }
      } catch {
        // Settings fetch failed — keep server-rendered defaults
      }
    }

    apply();

    return () => {
      cancelled = true;
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, []);

  return null;
}
