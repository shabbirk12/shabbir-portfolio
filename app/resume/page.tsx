"use client";

import Link from "next/link";
import { profile } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";

export default function ResumePage() {
  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper transition-colors duration-300 print:bg-white print:text-black">
      {/* Top Action Bar — hidden when printing */}
      <header className="print:hidden sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-line px-6 md:px-12 py-4 flex items-center justify-between transition-colors">
        <Link
          href="/"
          className="font-mono text-xs tracking-widest2 text-muted hover:text-lime transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>BACK TO PORTFOLIO</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 border border-line px-4 py-2 rounded-full font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors"
          >
            🖨️ PRINT RESUME
          </button>
          <a
            href={profile.cv || "/cv.pdf"}
            download
            className="inline-flex items-center gap-2 rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform"
          >
            📥 DOWNLOAD PDF
          </a>
        </div>
      </header>

      {/* Resume Paper Container */}
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16 print:p-0 print:max-w-none">
        {/*
          Screen: Adaptive card styling matching website theme (dark mode = atmospheric dark surface, light mode = clean white surface)
          Print: Flips to pure white background with black text via globals.css @media print
        */}
        <article className="resume-sheet rounded-xl border border-line bg-surface/50 backdrop-blur-sm p-8 sm:p-12 shadow-2xl transition-colors duration-300 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">

          {/* ─── HEADER ────────────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold leading-none tracking-tight font-display text-paper print:text-black uppercase">
              {profile.name}
            </h1>
            <p className="text-base font-semibold text-lime print:text-black mt-1.5 font-mono text-sm tracking-wider">
              {profile.role}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted print:text-black/80">
              <a href={`mailto:${profile.email}`} className="text-lime hover:underline print:text-blue-700 print:underline">
                {profile.email}
              </a>
              <span>·</span>
              <a href="tel:+923398884234" className="hover:underline print:text-black">
                +92 339 888 4234
              </a>
              <span>·</span>
              <span>{profile.location}</span>
              <span>·</span>
              <a href="https://shabbirkhan.dev" className="text-lime hover:underline print:text-blue-700 print:underline" target="_blank" rel="noreferrer">
                shabbirkhan.dev
              </a>
              <span>·</span>
              <a href={`https://${profile.github}`} className="hover:underline print:text-blue-700 print:underline" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span>·</span>
              <a href={`https://${profile.linkedin}`} className="hover:underline print:text-blue-700 print:underline" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span>·</span>
              <a href="https://instagram.com/shabbirk.design" className="hover:underline print:text-blue-700 print:underline" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>

          <hr className="border-line print:border-black mb-6" />

          {/* ─── SUMMARY ────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              SUMMARY
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />
            <p className="text-sm leading-relaxed text-paper/90 print:text-black font-body">
              A developer who designs, and a designer who ships. Multi-disciplinary specialist with 5+ years of experience
              architecting distinctive brand identity systems, physical print collateral, and production-grade full-stack web
              applications. Proven track record turning complex client briefs into scalable, high-converting digital products for
              hospitality, event venues, fintech, and modern SaaS startups. Experienced in full lifecycle execution: from concept,
              wireframing, and custom design systems to performant, scalable code that delivers measurable business growth.
            </p>
          </section>

          {/* ─── SKILLS ─────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              SKILLS
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />
            <div className="flex flex-col gap-2.5 text-sm font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-bold text-paper print:text-black w-28 shrink-0 uppercase">Design</span>
                <span className="text-muted print:text-black">
                  Figma, Adobe Illustrator, Photoshop, InDesign, Brand Systems, Visual Identity, Layout &amp; UI/UX, Print Pre-press &amp; Packaging
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-bold text-paper print:text-black w-28 shrink-0 uppercase">Engineering</span>
                <span className="text-muted print:text-black">
                  React, Next.js 14, TypeScript, Tailwind CSS, Node · Express, PostgreSQL, Supabase, MongoDB, REST &amp; GraphQL APIs, Python
                </span>
              </div>
            </div>
          </section>

          {/* ─── EXPERIENCE ─────────────────────────────────────────── */}
          <section>
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              EXPERIENCE
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />

            <div className="flex flex-col gap-5">
              {[
                {
                  title: "Lead Freelance Designer & Developer",
                  dates: "2021 — PRESENT",
                  org: "Independent · Global Clients — Brand systems, custom Next.js web platforms, and large-format event collateral",
                },
                {
                  title: "Full-Stack Product Engineer — WatBee WhatsApp SaaS",
                  dates: "2025 — PRESENT",
                  org: "WatBee Product Team — Built client portal, automated conversational sidecars, and campaign delivery engines",
                },
                {
                  title: "Brand Identity & Web Specialist — The Camden Brokers",
                  dates: "2023 — 2024",
                  org: "Luxury Asset Brokerage (London) — Complete brand overhaul, luxury print collateral, and bespoke web platform",
                },
                {
                  title: "Creative Director & Event Art Designer — London Nightlife & Hospitality",
                  dates: "2021 — 2023",
                  org: "Nocturne & London Venues — Designed 15+ bespoke brand systems, menus, festival key art, and marketing collateral",
                },
                {
                  title: "UI/UX Designer & Frontend Developer",
                  dates: "2019 — 2021",
                  org: "Agency & Freelance Projects — High-performance responsive websites, design tokens, and conversion optimization",
                },
              ].map((exp) => (
                <div key={exp.title}>
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-paper print:text-black font-display uppercase tracking-wide">
                      {exp.title}
                    </h3>
                    <span className="font-mono text-xs text-lime print:text-black/70 shrink-0 font-medium">
                      {exp.dates}
                    </span>
                  </div>
                  <p className="text-xs text-muted print:text-black/70 mt-1 leading-relaxed">
                    {exp.org}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}


