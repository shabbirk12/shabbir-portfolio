"use client";

import Link from "next/link";
import { profile } from "@/lib/data";

export default function CVPage() {
  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper print:bg-white print:text-black">
      {/* Top Action Bar (hidden when printing) */}
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
            🖨️ PRINT CV
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

      {/* CV Paper Container */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 print:p-0 print:max-w-none">
        <article className="border border-line print:border-none p-8 sm:p-14 rounded-lg bg-surface/30 print:bg-white">
          {/* Header */}
          <header className="border-b border-line print:border-black/30 pb-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight print:text-black">
                  {profile.name}
                </h1>
                <p className="font-mono text-sm tracking-widest2 text-lime print:text-black font-semibold mt-1">
                  GRAPHIC DESIGNER &amp; FULL-STACK WEB DEVELOPER
                </p>
              </div>
              <div className="font-mono text-xs text-muted print:text-black/70 sm:text-right space-y-1">
                <p>{profile.location}</p>
                <p>{profile.email}</p>
                <p>shabbirkhan.dev · linkedin.com/in/{profile.linkedin}</p>
              </div>
            </div>
          </header>

          {/* Executive Summary */}
          <section className="mb-10">
            <h2 className="font-mono text-xs tracking-widest2 text-lime print:text-black uppercase mb-3 font-semibold">
              EXECUTIVE PROFILE
            </h2>
            <p className="font-body text-paper/90 print:text-black text-sm sm:text-base leading-relaxed">
              Hybrid designer-developer with 5+ years of multidisciplinary experience architecting distinct brand
              identities and engineering production-grade full-stack web applications. Specializing in high-impact
              campaign systems for the hospitality and events industries, custom Next.js web applications, and
              conversion-focused digital products. Proven track record turning complex client briefs into iconic,
              scalable visual languages.
            </p>
          </section>

          {/* Core Competencies Grid */}
          <section className="mb-10">
            <h2 className="font-mono text-xs tracking-widest2 text-lime print:text-black uppercase mb-3 font-semibold">
              CORE COMPETENCIES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: "Brand Identity Systems", desc: "Logos, marks, typography & brand guidelines" },
                { title: "Full-Stack Development", desc: "Next.js 14, React, TypeScript, APIs & Postgres" },
                { title: "Hospitality & Event Art", desc: "Large-format print, menu design & festival collateral" },
                { title: "UI/UX & Design Systems", desc: "Figma component kits, responsive layouts & micro-interactions" },
                { title: "SaaS & Automation", desc: "WhatsApp API microservices, client portals & dashboards" },
                { title: "Performance Engineering", desc: "SEO architecture, Core Web Vitals & shader animations" },
              ].map((c) => (
                <div key={c.title} className="p-3 border border-line/60 print:border-black/20 rounded bg-ink/40 print:bg-transparent">
                  <p className="font-display text-xs font-semibold uppercase text-paper print:text-black">{c.title}</p>
                  <p className="font-mono text-[0.65rem] text-muted print:text-black/70 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Timeline */}
          <section className="mb-10">
            <h2 className="font-mono text-xs tracking-widest2 text-lime print:text-black uppercase mb-4 font-semibold">
              PROFESSIONAL EXPERIENCE
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-base font-semibold uppercase text-paper print:text-black">
                    Lead Freelance Designer &amp; Creative Developer
                  </h3>
                  <span className="font-mono text-xs text-muted print:text-black/70">2021 — PRESENT</span>
                </div>
                <p className="font-mono text-xs text-lime print:text-black mb-2">Self-employed · Global Clients</p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-muted print:text-black/80 space-y-1.5">
                  <li>Designed end-to-end brand identity and multi-page web platform for luxury asset firm The Camden Brokers.</li>
                  <li>Shipped 15+ bespoke brand systems for London and international nightlife, club nights, and hospitality venues.</li>
                  <li>Engineered custom Next.js/React applications with custom interactive 3D particle shaders and sub-second load times.</li>
                  <li>Delivered physical menu systems, packaging, and large-format festival key art ready for high-volume commercial print.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-base font-semibold uppercase text-paper print:text-black">
                    Full-Stack Product Engineer — WatBee WhatsApp SaaS
                  </h3>
                  <span className="font-mono text-xs text-muted print:text-black/70">2025 — 2026</span>
                </div>
                <p className="font-mono text-xs text-lime print:text-black mb-2">WatBee Product Team</p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-muted print:text-black/80 space-y-1.5">
                  <li>Architected frontend UI and backend microservice sidecar keeping WhatsApp Web QR sessions alive independently.</li>
                  <li>Built responsive client portal and campaign broadcasting queue with FastAPI, Node.js, and MongoDB.</li>
                  <li>Reduced onboarding friction by 60% through streamlined conversational QR scanning and interactive preview states.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Toolkit */}
          <section className="mb-10">
            <h2 className="font-mono text-xs tracking-widest2 text-lime print:text-black uppercase mb-3 font-semibold">
              TECHNICAL TOOLKIT
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 border border-line/60 print:border-black/20 rounded">
                <p className="font-bold text-paper print:text-black mb-2 uppercase">DESIGN &amp; CREATIVE</p>
                <p className="text-muted print:text-black/70 leading-relaxed">
                  Figma, Adobe Illustrator, Photoshop, InDesign, After Effects, Brand Architecture, Grid Systems, Typography, Print Pre-press
                </p>
              </div>
              <div className="p-4 border border-line/60 print:border-black/20 rounded">
                <p className="font-bold text-paper print:text-black mb-2 uppercase">ENGINEERING &amp; WEB</p>
                <p className="text-muted print:text-black/70 leading-relaxed">
                  Next.js 14, React, TypeScript, Tailwind CSS, PostgreSQL, Supabase, Node.js, Fastify/FastAPI, Framer Motion, Three.js / WebGL
                </p>
              </div>
            </div>
          </section>

          {/* Education & Credentials */}
          <section>
            <h2 className="font-mono text-xs tracking-widest2 text-lime print:text-black uppercase mb-3 font-semibold">
              EDUCATION &amp; CERTIFICATIONS
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 font-mono text-xs">
              <div>
                <p className="text-paper print:text-black font-semibold">Bachelor of Science in Computer Science / Visual Arts</p>
                <p className="text-muted print:text-black/70">Specialization in Human-Computer Interaction &amp; Digital Media</p>
              </div>
              <span className="text-muted print:text-black/70">Islamabad, PK</span>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
