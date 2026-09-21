"use client";

import React, { useEffect, useState } from "react";

interface Brand {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  display_order: number;
  active: boolean;
}

// Fallback SVG wordmarks for the initial seeded brands
function FallbackSVG({ name }: { name: string }) {
  const n = name.toLowerCase();

  if (n.includes("camden"))
    return (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="22" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" letterSpacing="0.08em">CAMDEN</text>
        <text x="0" y="33" fontFamily="monospace" fontSize="7.5" letterSpacing="0.32em" opacity="0.6">BROKERS LONDON</text>
      </svg>
    );

  if (n.includes("nocturne"))
    return (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="25" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="900" letterSpacing="-0.03em">NOCTURNE</text>
        <circle cx="150" cy="18" r="4" fill="var(--color-lime, #c6ff3d)" />
      </svg>
    );

  if (n.includes("watbee"))
    return (
      <svg viewBox="0 0 140 36" className="h-6 sm:h-7 w-auto fill-current">
        <path d="M4 8 L14 28 L24 8 M14 28 L24 28" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="24" fontFamily="system-ui, sans-serif" fontSize="19" fontWeight="bold" letterSpacing="-0.02em">WatBee</text>
      </svg>
    );

  if (n.includes("aridian"))
    return (
      <svg viewBox="0 0 180 36" className="h-6 sm:h-7 w-auto fill-current">
        <polygon points="10,6 20,28 0,28" stroke="var(--color-lime, #c6ff3d)" strokeWidth="2.5" fill="none" />
        <text x="28" y="20" fontFamily="monospace" fontSize="14" fontWeight="bold" letterSpacing="0.1em">ARIDIAN</text>
        <text x="29" y="31" fontFamily="monospace" fontSize="8" letterSpacing="0.25em" opacity="0.6">ARRAY SOCIETY</text>
      </svg>
    );

  if (n.includes("soft") && n.includes("wise"))
    return (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <rect x="2" y="8" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <rect x="7" y="13" width="6" height="6" fill="var(--color-lime, #c6ff3d)" />
        <text x="26" y="23" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.04em">SOFTWISE</text>
      </svg>
    );

  if (n.includes("ariesian"))
    return (
      <svg viewBox="0 0 150 36" className="h-6 sm:h-7 w-auto fill-current">
        <path d="M4 26 L13 8 L22 26 M8 20 L18 20" stroke="currentColor" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <text x="30" y="23" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.05em">ARIESIAN</text>
      </svg>
    );

  if (n.includes("studio nine") || (n.includes("studio") && n.includes("nine")))
    return (
      <svg viewBox="0 0 150 36" className="h-6 sm:h-7 w-auto fill-current">
        <text x="0" y="23" fontFamily="Georgia, serif" fontSize="19" fontStyle="italic" letterSpacing="0.04em">Studio Nine</text>
        <text x="114" y="21" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="var(--color-lime, #c6ff3d)">09</text>
      </svg>
    );

  if (n.includes("drive"))
    return (
      <svg viewBox="0 0 160 36" className="h-6 sm:h-7 w-auto fill-current">
        <circle cx="12" cy="18" r="9" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <path d="M12 12 L12 24 M7 18 L17 18" stroke="var(--color-lime, #c6ff3d)" strokeWidth="2" strokeLinecap="round" />
        <text x="28" y="23" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.06em">DRIVE TECH</text>
      </svg>
    );

  // Generic fallback — display name as text wordmark
  const words = name.toUpperCase().split(" ");
  const first = words[0];
  const rest = words.slice(1).join(" ");
  return (
    <svg viewBox="0 0 200 36" className="h-6 sm:h-7 w-auto fill-current">
      <text x="0" y="23" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="800" letterSpacing="0.02em">{first}</text>
      {rest && <text x="0" y="33" fontFamily="monospace" fontSize="8" letterSpacing="0.22em" opacity="0.6">{rest}</text>}
    </svg>
  );
}

export default function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data: Brand[]) => {
        const active = Array.isArray(data) ? data.filter((b) => b.active) : [];
        setBrands(active);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || brands.length === 0) return null;

  // Triplicate for seamless infinite scroll
  const list = [...brands, ...brands, ...brands];

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
        style={{ background: "linear-gradient(to right, var(--color-ink, #0a0a0a), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10"
        style={{ background: "linear-gradient(to left, var(--color-ink, #0a0a0a), transparent)" }}
      />

      {/* Infinite smooth right-to-left marquee track */}
      <div className="relative flex w-full overflow-hidden">
        <div className="flex shrink-0 items-center gap-14 sm:gap-20 py-2 animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
          {list.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="group flex shrink-0 items-center gap-3 text-paper/45 hover:text-lime transition-colors duration-300 select-none cursor-default"
              title={`${brand.name} — ${brand.category}`}
            >
              <div className="transition-transform duration-300 group-hover:scale-105">
                {brand.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-6 sm:h-7 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <FallbackSVG name={brand.name} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
