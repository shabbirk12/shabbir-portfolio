"use client";

import { useEffect, useState } from "react";
import useActiveSection from "@/lib/useActiveSection";

function useLondonClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/London",
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setProgress(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function useCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return pos;
}

const SECTION_LABELS: Record<string, string> = {
  about: "01 — ABOUT",
  services: "02 — SERVICES",
  work: "03 — WORK",
  lab: "04 — LAB",
  contact: "05 — CONTACT",
};

export default function HudBar({ section }: { section?: string }) {
  const time = useLondonClock();
  const progress = useScrollProgress();
  const cursor = useCursor();
  const active = useActiveSection();
  const [themeColor, setThemeColor] = useState("#C6FF3D");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--color-lime").trim();
      if (c) setThemeColor(c.toUpperCase());
    }
  }, []);

  const label = section ?? (active ? SECTION_LABELS[active] : "00 — INTRO");

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 hidden md:flex items-center justify-between
                 px-6 h-9 border-t border-line bg-ink/85 backdrop-blur-sm font-mono text-[0.65rem]
                 tracking-widest2 text-muted select-none"
      aria-hidden="true"
    >
      <div className="flex items-center gap-6">
        <span>
          SCRL <span className="text-paper">{progress.toFixed(2)}%</span>
        </span>
        <span>
          CRSR{" "}
          <span className="text-paper">
            {String(cursor.x).padStart(4, "0")}, {String(cursor.y).padStart(4, "0")}
          </span>
        </span>
      </div>

      <span className="text-lime">{label}</span>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          THEME <span className="w-2.5 h-2.5 bg-lime inline-block" /> {themeColor}
        </span>
        <span className="text-lime">
          {time} — LDN
        </span>
      </div>
    </div>
  );
}
