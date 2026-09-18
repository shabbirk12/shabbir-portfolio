"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import Reveal from "@/components/Reveal";
import HalftoneField from "@/components/HalftoneField";

type Status = "idle" | "sending" | "sent" | "error";

// Top ~60 countries by phone usage, with dial codes
const COUNTRY_CODES = [
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "IT", dial: "+39", name: "Italy" },
  { code: "ES", dial: "+34", name: "Spain" },
  { code: "NL", dial: "+31", name: "Netherlands" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "TR", dial: "+90", name: "Turkey" },
  { code: "EG", dial: "+20", name: "Egypt" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "BR", dial: "+55", name: "Brazil" },
  { code: "MX", dial: "+52", name: "Mexico" },
  { code: "AR", dial: "+54", name: "Argentina" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "TH", dial: "+66", name: "Thailand" },
  { code: "VN", dial: "+84", name: "Vietnam" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "OM", dial: "+968", name: "Oman" },
  { code: "JO", dial: "+962", name: "Jordan" },
  { code: "LB", dial: "+961", name: "Lebanon" },
  { code: "IQ", dial: "+964", name: "Iraq" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "RW", dial: "+250", name: "Rwanda" },
  { code: "RU", dial: "+7", name: "Russia" },
  { code: "UA", dial: "+380", name: "Ukraine" },
  { code: "PL", dial: "+48", name: "Poland" },
  { code: "SE", dial: "+46", name: "Sweden" },
  { code: "NO", dial: "+47", name: "Norway" },
  { code: "DK", dial: "+45", name: "Denmark" },
  { code: "FI", dial: "+358", name: "Finland" },
  { code: "CH", dial: "+41", name: "Switzerland" },
  { code: "AT", dial: "+43", name: "Austria" },
  { code: "BE", dial: "+32", name: "Belgium" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "GR", dial: "+30", name: "Greece" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "LK", dial: "+94", name: "Sri Lanka" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "MM", dial: "+95", name: "Myanmar" },
  { code: "AF", dial: "+93", name: "Afghanistan" },
];

const SERVICES = [
  "Brand Identity Design",
  "Logo & Visual Design",
  "Web Design (Codeless)",
  "Full-Stack Web Development",
  "E-Commerce Website",
  "Booking / Hospitality Website",
  "Event Campaign Design",
  "Social Media Design",
  "Product UI/UX Design",
  "WhatsApp SaaS / Automation",
  "Other / Not Sure Yet",
];

const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Let's discuss",
];

const selectClass =
  "bg-transparent border-b border-line py-3 text-paper placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors appearance-none cursor-pointer w-full";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dialCode, setDialCode] = useState("+92"); // default PK

  // Auto-detect country on mount via free ip-api
  useEffect(() => {
    fetch("https://ip-api.com/json/?fields=countryCode", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const match = COUNTRY_CODES.find((c) => c.code === d.countryCode);
        if (match) setDialCode(match.dial);
      })
      .catch(() => {}); // silently fail — default stays PK
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: phone ? `${dialCode} ${phone}` : "",
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Something went wrong.");
        return;
      }

      setStatus("sent");
      form.reset();
      setDialCode("+92");
    } catch {
      setStatus("error");
      setErrorMsg("Network error — try again.");
    }
  }

  return (
    <section id="contact" className="relative px-6 md:px-10 py-24 md:py-32 border-t border-line overflow-hidden">
      <HalftoneField className="opacity-50" spacing={24} influence={140} />
      <div className="ambient-blob w-[420px] h-[420px] -top-32 -left-20 animate-float" aria-hidden="true" />
      <div
        className="ambient-blob w-[320px] h-[320px] bottom-0 right-0 opacity-60 animate-float"
        style={{ animationDelay: "-3s" }}
        aria-hidden="true"
      />

      {/* Section heading — centered */}
      <Reveal className="relative mb-4 text-center flex flex-col items-center">
        <p className="eyebrow mb-6">05 / OPEN FOR WORK · AVAILABLE FOR FREELANCE &amp; FULL-TIME</p>
        <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.95]">Got a project</h2>
        <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.95] flex flex-wrap items-baseline justify-center gap-x-4 md:gap-x-6">
          in mind?
          <span className="font-script text-lime normal-case text-6xl md:text-9xl italic">
            let&apos;s talk.
          </span>
        </h2>
      </Reveal>

      {/* Direct email link */}
      <Reveal delay={0.1} className="relative mt-10 mb-14 text-center">
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-3 font-display text-2xl md:text-4xl text-paper hover:text-lime transition-colors"
        >
          {profile.email} ↗
        </a>
      </Reveal>

      {/* Centered form */}
      <div className="relative max-w-2xl mx-auto">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* NAME */}
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">NAME</span>
            <input
              name="name"
              required
              placeholder="Your name"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors"
            />
          </label>

          {/* EMAIL */}
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">EMAIL</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors"
            />
          </label>

          {/* MOBILE with country code */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">MOBILE <span className="text-muted/50">(optional)</span></span>
            <div className="flex gap-2 border-b border-line focus-within:border-lime transition-colors">
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="bg-transparent text-paper py-3 pr-2 focus-visible:outline-none outline-none cursor-pointer text-sm shrink-0"
                aria-label="Country code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.dial} className="bg-ink text-paper">
                    {c.code} {c.dial}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="300 1234567"
                className="bg-transparent py-3 placeholder:text-muted/50 focus-visible:outline-none outline-none transition-colors flex-1 min-w-0"
              />
            </div>
          </div>

          {/* SERVICE */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">SERVICE REQUIRED</span>
            <div className="relative">
              <select
                name="service"
                required
                defaultValue=""
                className={selectClass}
              >
                <option value="" disabled className="bg-ink text-paper">Select a service…</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s} className="bg-ink text-paper">{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted text-xs">▾</span>
            </div>
          </div>

          {/* BUDGET */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">BUDGET</span>
            <div className="relative">
              <select
                name="budget"
                required
                defaultValue=""
                className={selectClass}
              >
                <option value="" disabled className="bg-ink text-paper">Select your budget…</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b} className="bg-ink text-paper">{b}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted text-xs">▾</span>
            </div>
          </div>

          {/* MESSAGE */}
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">BRIEF</span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="What are we building?"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors resize-none"
            />
          </label>

          {/* SEND button — centered */}
          <div className="flex flex-col items-center gap-5 mt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-lime px-8 py-3.5 font-mono text-xs tracking-widest2 text-lime-ink
                         transition-transform hover:scale-105 hover:shadow-glow-lime disabled:opacity-50"
            >
              {status === "sending" ? "SENDING…" : "SEND MESSAGE ↗"}
            </button>

            {status === "sent" && (
              <p className="font-mono text-xs text-lime">
                Message sent — thanks, I&apos;ll be in touch.
              </p>
            )}
            {status === "error" && <p className="font-mono text-xs text-red-400">{errorMsg}</p>}

            {/* Social handles — below SEND button, centered */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-mono text-sm tracking-widest2 mt-2 pt-4 border-t border-line w-full justify-center">
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors text-muted"
              >
                LINKEDIN ↗
              </a>
              <span className="hidden sm:block text-line">·</span>
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors text-muted"
              >
                GITHUB ↗
              </a>
              <span className="hidden sm:block text-line">·</span>
              <a
                href="https://instagram.com/shabbirk.design"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors text-muted"
              >
                INSTAGRAM ↗
              </a>
            </div>
          </div>
        </motion.form>
      </div>

      <div className="relative mt-16 flex items-end justify-between border-t border-line pt-6 font-mono text-[0.65rem] tracking-widest2 text-muted">
        <p>ISLAMABAD · PK &nbsp; 33.7°N 73.0°E</p>
        <p className="text-lime">005 — CONTACT</p>
      </div>
    </section>
  );
}
