"use client";

import React from "react";

interface Brand {
  name: string;
  category: string;
  svg: React.ReactNode;
}

const BRANDS: Brand[] = [
  {
    name: "The Camden Brokers",
    category: "Luxury Asset Brokerage · London",
    svg: (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="22" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" letterSpacing="0.08em">
          CAMDEN
        </text>
        <text x="0" y="33" fontFamily="monospace" fontSize="7.5" letterSpacing="0.32em" opacity="0.6">
          BROKERS LONDON
        </text>
      </svg>
    ),
  },
  {
    name: "Nocturne London",
    category: "Nightlife & Festival Art",
    svg: (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="25" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="900" letterSpacing="-0.03em">
          NOCTURNE
        </text>
        <circle cx="150" cy="18" r="4" fill="var(--color-lime)" />
      </svg>
    ),
  },
  {
    name: "WatBee SaaS",
    category: "Automated Conversational Platform",
    svg: (
      <svg viewBox="0 0 140 36" className="h-6 sm:h-7 w-auto fill-current">
        <path
          d="M4 8 L14 28 L24 8 M14 28 L24 28"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="32" y="24" fontFamily="system-ui, sans-serif" fontSize="19" fontWeight="bold" letterSpacing="-0.02em">
          WatBee
        </text>
      </svg>
    ),
  },
  {
    name: "Aridian Array",
    category: "Software Society · PMAS",
    svg: (
      <svg viewBox="0 0 180 36" className="h-6 sm:h-7 w-auto fill-current">
        <polygon points="10,6 20,28 0,28" stroke="var(--color-lime)" strokeWidth="2.5" fill="none" />
        <text x="28" y="20" fontFamily="monospace" fontSize="14" fontWeight="bold" letterSpacing="0.1em">
          ARIDIAN
        </text>
        <text x="29" y="31" fontFamily="monospace" fontSize="8" letterSpacing="0.25em" opacity="0.6">
          ARRAY SOCIETY
        </text>
      </svg>
    ),
  },
  {
    name: "Soft Wise Solution",
    category: "Enterprise Software & Systems",
    svg: (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <rect x="2" y="8" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <rect x="7" y="13" width="6" height="6" fill="var(--color-lime)" />
        <text x="26" y="23" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.04em">
          SOFTWISE
        </text>
      </svg>
    ),
  },
  {
    name: "Ariesian Tech",
    category: "Full-Stack Web Engineering",
    svg: (
      <svg viewBox="0 0 150 36" className="h-6 sm:h-7 w-auto fill-current">
        <path d="M4 26 L13 8 L22 26 M8 20 L18 20" stroke="currentColor" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <text x="30" y="23" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.05em">
          ARIESIAN
        </text>
      </svg>
    ),
  },
  {
    name: "Studio Nine",
    category: "Creative Direction & Brand Identity",
    svg: (
      <svg viewBox="0 0 150 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="23" fontFamily="Georgia, serif" fontSize="19" fontStyle="italic" letterSpacing="0.04em">
          Studio Nine
        </text>
        <text x="114" y="21" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="var(--color-lime)">
          09
        </text>
      </svg>
    ),
  },
  {
    name: "Drive Tech BPO",
    category: "Global Communications & Tech",
    svg: (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <circle cx="12" cy="18" r="9" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <path d="M12 12 L12 24 M7 18 L17 18" stroke="var(--color-lime)" strokeWidth="2" strokeLinecap="round" />
        <text x="28" y="23" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.06em">
          DRIVE TECH
        </text>
      </svg>
    ),
  },
];

export default function BrandsMarquee() {
  const list = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="relative py-12 border-t border-line overflow-hidden bg-surface/10">
      <div className="px-6 md:px-10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
          <p className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">
            TRUSTED BY TEAMS, FOUNDERS &amp; VENUES
          </p>
        </div>
        <p className="font-mono text-[0.6rem] tracking-widest2 text-muted/60 uppercase">
          BRANDS I&apos;VE WORKED WITH
        </p>
      </div>

      {/* Gradient masks on left & right edges for smooth fading */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10"
        style={{
          background: "linear-gradient(to right, var(--color-ink), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10"
        style={{
          background: "linear-gradient(to left, var(--color-ink), transparent)",
        }}
      />

      {/* Infinite smooth right-to-left marquee track */}
      <div className="relative flex w-full overflow-hidden">
        <div className="flex shrink-0 items-center gap-14 sm:gap-20 py-2 animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
          {list.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="group flex shrink-0 items-center gap-3 text-paper/45 hover:text-lime transition-colors duration-300 select-none cursor-default"
              title={`${brand.name} — ${brand.category}`}
            >
              <div className="transition-transform duration-300 group-hover:scale-105">
                {brand.svg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
