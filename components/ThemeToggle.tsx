"use client";

import { useEffect, useState } from "react";

export function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("site_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  } catch {}
  return "dark";
}

export function applyTheme(theme: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
  try {
    localStorage.setItem("site_theme", theme);
  } catch {}
  window.dispatchEvent(new CustomEvent("site_theme_change", { detail: { theme } }));
}

export default function ThemeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = getInitialTheme();
    setTheme(current);
    applyTheme(current);

    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.theme === "light" || detail.theme === "dark")) {
        setTheme(detail.theme);
      }
    };

    window.addEventListener("site_theme_change", onThemeChange);
    return () => window.removeEventListener("site_theme_change", onThemeChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full border border-line p-2 text-xs opacity-0 ${className}`}
        aria-hidden="true"
      >
        🌓
      </div>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className={`inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wider uppercase transition-colors hover:text-lime ${className}`}
      >
        <span>{theme === "dark" ? "☀️" : "🌙"}</span>
        <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 font-mono text-[0.65rem] tracking-widest2 text-paper transition-all hover:border-lime hover:text-lime ${className}`}
    >
      <span
        className="inline-block transition-transform duration-300 group-hover:rotate-45"
        aria-hidden="true"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
      <span className="uppercase text-[0.6rem] font-semibold">
        {theme === "dark" ? "LIGHT" : "DARK"}
      </span>
    </button>
  );
}

