"use client";

import Link from "next/link";

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
          The article uses pure white bg + black text for both screen (with a card style)
          and print. All colours flip via print media query in globals.css.
        */}
        <article className="bg-white text-black rounded-lg shadow-2xl print:shadow-none p-8 sm:p-12 print:p-0">

          {/* ─── HEADER ────────────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold leading-none tracking-tight text-black">
              Malik Hadi Zulfiqar
            </h1>
            <p className="text-base font-semibold text-black mt-1">
              Web Developer &amp; Graphic Designer
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-black/80">
              <a href="mailto:malikhadi.webdev@gmail.com" className="text-blue-700 underline">
                malikhadi.webdev@gmail.com
              </a>
              <span>·</span>
              <a href="tel:+923398884234" className="text-blue-700 underline">
                +92 339 888 4234
              </a>
              <span>·</span>
              <span>Rawalpindi, Pakistan</span>
              <span>·</span>
              <a href="https://www.malikhadi.me" className="text-blue-700 underline" target="_blank" rel="noreferrer">
                www.malikhadi.me
              </a>
              <span>·</span>
              <a href="https://github.com/malikhadi" className="text-blue-700 underline" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span>·</span>
              <a href="https://instagram.com/malikhadi.design" className="text-blue-700 underline" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>

          <hr className="border-black mb-6" />

          {/* ─── SUMMARY ────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black mb-2">SUMMARY</h2>
            <hr className="border-black/30 mb-3" />
            <p className="text-sm leading-relaxed text-black">
              A developer who designs, and a designer who ships. Eight years drawing brand systems in Adobe; the last two
              turning them into production software — so your product never gets lost in the gap between how it looks and
              how it works. As a BSCS Artificial Intelligence graduate and software society leader, I combine creative intuition
              with structured, algorithmic problem-solving. I design brand-grade interfaces, engineer scalable architectures,
              and ship production-ready code that drives actual business value.
            </p>
          </section>

          {/* ─── SKILLS ─────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black mb-2">SKILLS</h2>
            <hr className="border-black/30 mb-3" />
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex gap-4">
                <span className="font-bold text-black w-24 shrink-0">Design</span>
                <span className="text-black">Photoshop, Illustrator, Brand Systems, Layout &amp; UI</span>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-black w-24 shrink-0">Engineering</span>
                <span className="text-black">React, Next.js, TypeScript, Node · Express, MongoDB, Supabase, Python</span>
              </div>
            </div>
          </section>

          {/* ─── EXPERIENCE ─────────────────────────────────────────── */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-black mb-2">EXPERIENCE</h2>
            <hr className="border-black/30 mb-3" />

            <div className="flex flex-col gap-4">
              {[
                {
                  title: "General Secretary",
                  dates: "2025 — 2026",
                  org: "Aridian Array Software Society · PMAS Arid University — Leadership",
                },
                {
                  title: "MERN Web Developer",
                  dates: "Dec 2024 — Now",
                  org: "Soft Wise Solution — Development",
                },
                {
                  title: "Graphic Designer",
                  dates: "2024 — 2025",
                  org: "Aridian Array Software Society · PMAS Arid University — Design",
                },
                {
                  title: "Frontend Dev Intern",
                  dates: "Summer 2024",
                  org: "Ariesian Tech — Internship",
                },
                {
                  title: "Personal Tutor",
                  dates: "2021 — 2024",
                  org: "Independent · 1-on-1 mentorship — Mentorship",
                },
                {
                  title: "Telemarketing Rep",
                  dates: "2020",
                  org: "Drive Tech BPO — Comms",
                },
                {
                  title: "Freelance Graphic Designer",
                  dates: "2018 — Now",
                  org: "Independent · brand & visual work — Design",
                },
              ].map((exp) => (
                <div key={exp.title}>
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-black">{exp.title}</h3>
                    <span className="text-xs text-black/70 shrink-0">{exp.dates}</span>
                  </div>
                  <p className="text-xs text-black/60 mt-0.5">{exp.org}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

