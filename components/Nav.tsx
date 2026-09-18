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
  { n: "04", id: "testimonials", label: "TESTIMONIALS", href: "/#testimonials" },
  { n: "05", id: "blog", label: "BLOG", href: "/blog" },
  { n: "06", id: "contact", label: "CONTACT", href: "/#contact" },
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

  // Strip any initial hash from URL on mount and intercept all hash links
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
      window.history.replaceState(null, "", window.location.pathname);
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && (href.startsWith("/#") || href.startsWith("#"))) {
        const id = href.replace(/^\/?#/, "");
        const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
        if (id === "top") {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(0, { duration: 1.4 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          window.history.replaceState(null, "", window.location.pathname);
          return;
        }
        const el = document.getElementById(id);
        if (el && window.location.pathname === "/") {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(el, { offset: -40, duration: 1.4 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
          window.history.replaceState(null, "", "/");
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, l: (typeof links)[number] | { href: string; id: string }) => {
    if (!l.href.startsWith("/#") && !l.href.startsWith("#")) {
      // Standalone page (like /blog) — let standard navigation take place
      return;
    }
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const target = document.getElementById(l.id);
      if (target) {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(target, { offset: -40, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        window.history.replaceState(null, "", "/");
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 md:py-5 transition-colors duration-300 ${
        scrolled ? "bg-ink/80 backdrop-blur-md border-b border-line" : ""
      }`}
    >
      <Link href="/" className="flex items-center gap-3 shrink-0">
        {logoUrl ? (
          <span className="relative h-7 w-7 shrink-0">
            <Image src={logoUrl} alt="Logo" fill className="object-contain" />
          </span>
        ) : (
          <span className="w-7 h-7 rounded bg-lime text-lime-ink font-display text-xs flex items-center justify-center font-bold">
            S
          </span>
        )}
        <span className="font-display text-xs sm:text-sm tracking-widest2 uppercase">
          SHABBIR<span className="text-lime">.</span>
          <span className="text-muted/60 hidden md:inline"> PORTFOLIO/2026</span>
        </span>
      </Link>

      <nav className="hidden lg:flex items-center gap-4 xl:gap-7 font-mono text-[0.68rem] tracking-widest2 text-muted">
        {links.map((l) => {
          const isActive = active === l.id;
          return (
            <a
              key={l.n}
              href={l.href}
              onClick={(e) => handleNavClick(e, l)}
              className={`underline-sweep transition-colors whitespace-nowrap ${
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
          onClick={(e) => handleNavClick(e, { id: "contact", href: "/#contact" })}
          className="rounded-full bg-lime text-lime-ink px-4 xl:px-5 py-2 font-mono text-[0.65rem] tracking-widest2 whitespace-nowrap font-semibold hover:shadow-glow-lime transition-shadow"
        >
          GET IN TOUCH
        </a>
      </nav>

      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden font-mono text-[0.68rem] tracking-widest2 border border-line px-3.5 py-2 rounded hover:border-lime text-paper transition-colors flex items-center gap-2"
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-lime" />
        {open ? "CLOSE" : "MENU"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-ink/95 backdrop-blur-xl border-t border-b border-line px-6 py-8 flex flex-col gap-5 shadow-2xl max-h-[calc(100vh-75px)] overflow-y-auto"
          >
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.n}
                  href={l.href}
                  onClick={(e) => {
                    setOpen(false);
                    handleNavClick(e, l);
                  }}
                  className={`font-mono text-sm tracking-widest2 transition-colors flex items-center justify-between py-1 border-b border-line/40 ${
                    isActive ? "text-lime" : "text-muted hover:text-lime"
                  }`}
                >
                  <span>{l.n} / {l.label}</span>
                  {isActive && <span className="text-lime text-xs">●</span>}
                </a>
              );
            })}
            <a
              href="/#contact"
              onClick={(e) => {
                setOpen(false);
                handleNavClick(e, { id: "contact", href: "/#contact" });
              }}
              className="mt-2 rounded-full bg-lime text-lime-ink px-5 py-3 text-center font-mono text-xs tracking-widest2 font-semibold shadow-glow-lime/30"
            >
              GET IN TOUCH →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
