"use client";

import Link from "next/link";
import { profile } from "@/lib/data";

export default function ResumePage() {
  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper print:bg-white print:text-black">
      {/* Top Action Bar — hidden when printing */}
      <header className="print:hidden sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-line px-6 md:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs tracking-widest2 text-muted hover:text-lime transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>BACK TO PORTFOLIO</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 border border-line px-4 py-2 rounded-full font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors"
          >
            🖨️ PRINT RESUME
          </button>
          <a
            href="/cv.pdf"
            download="Shabbir_Khan_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform shadow-sm hover:shadow-glow-lime/40"
          >
            📥 DOWNLOAD PDF
          </a>
        </div>
      </header>

      {/* Resume Container */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 print:p-0 print:max-w-none">
        {/*
          Dark themed container on website screen (matches portfolio)
          Switches automatically to clean white paper + black text when printed
        */}
        <article className="bg-surface/50 border border-line rounded-xl shadow-2xl p-8 sm:p-14 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">

          {/* ─── HEADER ────────────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-paper print:text-black">
              {profile.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm font-semibold tracking-widest2 text-lime print:text-black mt-1.5 uppercase">
              Web Developer &amp; Graphic Designer
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted print:text-black/80">
              <a href={`mailto:${profile.email}`} className="text-paper print:text-black hover:text-lime underline-offset-4 hover:underline">
                {profile.email}
              </a>
              <span>·</span>
              <span>{profile.location}</span>
              <span>·</span>
              <a href="https://shabbirkhan.dev" className="text-paper print:text-black hover:text-lime underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                shabbirkhan.dev
              </a>
              <span>·</span>
              <a href={`https://${profile.linkedin}`} className="text-paper print:text-black hover:text-lime underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span>·</span>
              <a href={`https://${profile.github}`} className="text-paper print:text-black hover:text-lime underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span>·</span>
              <a href="https://instagram.com/shabbirk.design" className="text-paper print:text-black hover:text-lime underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>

          <hr className="border-line print:border-black/50 mb-6" />

          {/* ─── SUMMARY ────────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              EXECUTIVE PROFILE &amp; SUMMARY
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />
            <p className="font-body text-sm leading-relaxed text-paper/90 print:text-black">
              Hybrid designer-developer with multidisciplinary expertise architecting distinct brand identities and engineering
              production-grade full-stack web applications. Specializing in high-impact campaign systems for the hospitality and events
              scene, custom Next.js applications, and conversion-focused digital products. Proven track record turning complex briefs
              into iconic visual languages and clean, scalable code.
            </p>
          </section>

          {/* ─── SKILLS ─────────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              CORE SKILLS &amp; TOOLKIT
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />
            <div className="flex flex-col gap-2.5 font-mono text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-bold text-lime print:text-black w-28 shrink-0">Design</span>
                <span className="text-paper/90 print:text-black">
                  Brand Identity Systems, Art Direction, Adobe Photoshop, Illustrator, InDesign, Figma, Typography, Print &amp; Packaging
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-bold text-lime print:text-black w-28 shrink-0">Engineering</span>
                <span className="text-paper/90 print:text-black">
                  React, Next.js 14, TypeScript, Node.js · Express, PostgreSQL, Supabase, Tailwind CSS, Python, REST APIs
                </span>
              </div>
            </div>
          </section>

          {/* ─── EXPERIENCE ─────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              PROFESSIONAL EXPERIENCE
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-4" />

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-sm sm:text-base font-bold uppercase text-paper print:text-black">
                    Lead Freelance Designer &amp; Creative Developer
                  </h3>
                  <span className="font-mono text-xs text-lime print:text-black/80 shrink-0">2021 — PRESENT</span>
                </div>
                <p className="font-mono text-xs text-muted print:text-black/70 mt-0.5">
                  Self-employed · Global Clients — Brand &amp; Full-Stack Web Platforms
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-paper/85 print:text-black/90 space-y-1.5 mt-2.5">
                  <li>Designed end-to-end brand identity and multi-page web platform for luxury asset firm The Camden Brokers in London.</li>
                  <li>Shipped 15+ bespoke brand systems for London and international nightlife, club nights, and hospitality venues.</li>
                  <li>Engineered custom Next.js/React web applications with interactive 3D particle shaders and sub-second load times.</li>
                  <li>Delivered physical menu systems, packaging, and large-format festival key art ready for high-volume commercial print.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-sm sm:text-base font-bold uppercase text-paper print:text-black">
                    Full-Stack Product Engineer — WatBee WhatsApp SaaS
                  </h3>
                  <span className="font-mono text-xs text-lime print:text-black/80 shrink-0">2025 — PRESENT</span>
                </div>
                <p className="font-mono text-xs text-muted print:text-black/70 mt-0.5">
                  WatBee Product Team · Automated Conversational Platform
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-paper/85 print:text-black/90 space-y-1.5 mt-2.5">
                  <li>Architected frontend UI and backend microservice sidecar keeping WhatsApp Web QR sessions alive independently.</li>
                  <li>Built responsive client portal and campaign broadcasting queue with FastAPI, Node.js, and MongoDB.</li>
                  <li>Reduced onboarding friction by 60% through streamlined conversational QR scanning and interactive preview states.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-sm sm:text-base font-bold uppercase text-paper print:text-black">
                    Brand &amp; Visual Designer
                  </h3>
                  <span className="font-mono text-xs text-lime print:text-black/80 shrink-0">2021 — 2024</span>
                </div>
                <p className="font-mono text-xs text-muted print:text-black/70 mt-0.5">
                  Hospitality, Events &amp; Creative Venues — Visual Identity &amp; Digital Collateral
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-paper/85 print:text-black/90 space-y-1.5 mt-2.5">
                  <li>Crafted visual identity packages, typographic layouts, and social campaign assets for high-profile hospitality brands.</li>
                  <li>Collaborated closely with venue managers, event promoters, and marketing teams to meet strict turnaround deadlines.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ─── EDUCATION ──────────────────────────────────────────── */}
          <section>
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest2 text-lime print:text-black mb-2">
              EDUCATION &amp; CREDENTIALS
            </h2>
            <hr className="border-line/60 print:border-black/30 mb-3" />
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 font-mono text-xs sm:text-sm">
              <div>
                <p className="text-paper print:text-black font-semibold">Bachelor of Science in Computer Science / Visual Media</p>
                <p className="text-muted print:text-black/70 text-xs">Specialization in Human-Computer Interaction &amp; Digital Design</p>
              </div>
              <span className="text-muted print:text-black/70 text-xs">Islamabad, PK</span>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

