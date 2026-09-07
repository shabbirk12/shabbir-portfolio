"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useActiveSection from "@/lib/useActiveSection";

const links = [
  { n: "01", id: "about", label: "ABOUT", href: "/#about" },
  { n: "02", id: "services", label: "SERVICES", href: "/#services" },
  { n: "03", id: "work", label: "WORK", href: "/#work" },
  { n: "04", id: "lab", label: "LAB", href: "/#lab" },
  { n: "05", id: "contact", label: "CONTACT", href: "/#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((json) => setLogoUrl(json.logoUrl ?? null))
      .catch(() => {});
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 transition-colors duration-300 ${
        scrolled ? "bg-ink/70 backdrop-blur-md border-b border-line" : ""
      }`}
    >
      <Link href="/" className="flex items-center gap-3">
        {logoUrl ? (
          <span className="relative h-7 w-7 shrink-0">
            <Image src={logoUrl} alt="Logo" fill className="object-contain" />
          </span>
        ) : (
          <span className="w-7 h-7 rounded bg-lime text-lime-ink font-display text-xs flex items-center justify-center">
            S
          </span>
        )}
        <span className="font-display text-sm tracking-widest2 uppercase hidden sm:inline">
          SHABBIR<span className="text-lime">.</span> PORTFOLIO/2026
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-7 font-mono text-[0.68rem] tracking-widest2 text-muted">
        {links.map((l) => {
          const isActive = active === l.id;
          return (
            <a
              key={l.n}
              href={l.href}
              className={`underline-sweep transition-colors ${
                isActive ? "text-lime" : "hover:text-lime"
              }`}
            >
              {isActive ? "( " : ""}
              {l.n}/{l.label}
              {isActive ? " )" : ""}
            </a>
          );
        })}
        <a
          href="/#contact"
          className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-[0.65rem] tracking-widest2
                     hover:shadow-glow-lime transition-shadow"
        >
          GET IN TOUCH
        </a>
      </nav>

      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden font-mono text-[0.68rem] tracking-widest2 border border-line px-3 py-2 hover:border-lime transition-colors"
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        {open ? "CLOSE" : "MENU"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-ink border-t border-line px-6 py-6 flex flex-col gap-4"
          >
            {links.map((l) => (
              <a
                key={l.n}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm tracking-widest2 text-muted hover:text-lime"
              >
                {l.n}/{l.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-lime text-lime-ink px-5 py-3 text-center font-mono text-xs tracking-widest2"
            >
              GET IN TOUCH
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
