"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useActiveSection from "@/lib/useActiveSection";
import ThemeToggle from "@/components/ThemeToggle";

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
              onClick={(e) => handleNavClick(e, l)}
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
        <ThemeToggle />
        <a
          href="/#contact"
          onClick={(e) => handleNavClick(e, { id: "contact", href: "/#contact" })}
          className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-[0.65rem] tracking-widest2
                     hover:shadow-glow-lime transition-shadow"
        >
          GET IN TOUCH
        </a>
      </nav>

      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle compact />
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-[0.68rem] tracking-widest2 border border-line px-3 py-2 hover:border-lime transition-colors"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-ink border-t border-line px-6 py-6 flex flex-col gap-4 shadow-xl"
          >
            {links.map((l) => (
              <a
                key={l.n}
                href={l.href}
                onClick={(e) => {
                  setOpen(false);
                  handleNavClick(e, l);
                }}
                className="font-mono text-sm tracking-widest2 text-muted hover:text-lime"
              >
                {l.n}/{l.label}
              </a>
            ))}
            <div className="pt-2 flex items-center justify-between border-t border-line">
              <span className="font-mono text-xs tracking-widest2 text-muted uppercase">THEME</span>
              <ThemeToggle />
            </div>
            <a
              href="/#contact"
              onClick={(e) => {
                setOpen(false);
                handleNavClick(e, { id: "contact", href: "/#contact" });
              }}
              className="rounded-full bg-lime text-lime-ink px-5 py-3 text-center font-mono text-xs tracking-widest2 font-semibold"
            >
              GET IN TOUCH
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
