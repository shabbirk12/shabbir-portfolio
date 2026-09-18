"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { profile } from "@/lib/data";

/* -------------------------------------------------------------------------
 * BlurText — letter/word reveal used for the tagline
 * ---------------------------------------------------------------------- */
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 40,
  animateBy = "words",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const segments = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy]
  );

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(14px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(-24px)",
            transition: `filter 0.7s ease-out ${i * delay}ms, opacity 0.7s ease-out ${
              i * delay
            }ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

/* -------------------------------------------------------------------------
 * HalftoneField — canvas grid of dots that liquifies around the cursor.
 * Each dot's radius (halftone) and position (liquid displacement) respond
 * to distance from the pointer, eased with lerp for a fluid feel.
 * ---------------------------------------------------------------------- */
const HalftoneField: React.FC<{ accent: string }> = ({ accent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, targetX: -9999, targetY: -9999 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const spacing = 26;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handlePointer = (x: number, y: number) => {
      mouse.current.targetX = x;
      mouse.current.targetY = y;
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handlePointer(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) handlePointer(t.clientX - rect.left, t.clientY - rect.top);
    };
    const onLeave = () => {
      mouse.current.targetX = -9999;
      mouse.current.targetY = -9999;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && raf.current === 0) raf.current = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    const draw = () => {
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.12;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const influence = 190;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * spacing;
          const baseY = row * spacing;

          const dx = baseX - mouse.current.x;
          const dy = baseY - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / influence);
          const eased = t * t * (3 - 2 * t); // smoothstep — liquid falloff

          const push = eased * 10;
          const angle = Math.atan2(dy, dx);
          const x = baseX + Math.cos(angle) * push;
          const y = baseY + Math.sin(angle) * push;

          const r = 1.1 + eased * 3.4;
          const alpha = 0.16 + eased * 0.72;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle =
            eased > 0.04
              ? `${accent}${Math.round(alpha * 255)
                  .toString(16)
                  .padStart(2, "0")}`
              : `rgba(255,255,255,${alpha * 0.35})`;
          ctx.fill();
        }
      }

      if (visible) {
        raf.current = requestAnimationFrame(draw);
      } else {
        raf.current = 0;
      }
    };
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

/* -------------------------------------------------------------------------
 * InvertedCursor — a circle that follows the pointer with mix-blend-mode:
 * difference, so it inverts whatever color sits beneath it.
 * ---------------------------------------------------------------------- */
const InvertedCursor: React.FC<{ containerRef: React.RefObject<HTMLElement> }> = ({
  containerRef,
}) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pos.current.tx = e.clientX - rect.left;
      pos.current.ty = e.clientY - rect.top;
    };
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.18;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none absolute left-0 top-0 z-40 hidden rounded-full bg-white mix-blend-difference transition-[width,height,opacity] duration-300 ease-out md:block"
      style={{
        width: active ? 56 : 0,
        height: active ? 56 : 0,
        opacity: active ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
};

/* -------------------------------------------------------------------------
 * Hero
 * ---------------------------------------------------------------------- */
const DEFAULT_ACCENT = "#c6ff3d";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--color-lime").trim();
      if (c) setAccent(c);
    }
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />

      <section
        ref={heroRef}
        id="top"
        data-hide-cursor
        className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
      >
        {/* Liquid halftone dot field */}
        <HalftoneField accent={accent} />

        {/* Inverted-color circle following the cursor */}
        <InvertedCursor containerRef={heroRef} />

        {/* Main hero content */}
        <div className="relative z-20 mx-auto flex min-h-screen max-w-screen-2xl flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pt-28">
          {/* Title block with dotted backdrop */}
          <div className="relative flex flex-1 flex-col items-center justify-center text-center">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                maskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 50%, black 40%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 50%, black 40%, transparent 75%)",
              }}
              aria-hidden="true"
            />

            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Available for freelance — Islamabad
            </span>

            <h1 className="select-none font-display text-[15vw] font-bold uppercase leading-[0.85] tracking-tighter sm:text-[13vw] md:text-[9vw] lg:text-[7.5vw]">
              Shabbir
              <br />
              Khan
            </h1>

            <BlurText
              text="Brand identity, print & packaging, and websites that actually ship."
              animateBy="words"
              delay={45}
              className="mt-6 max-w-xl justify-center px-4 font-sans text-sm text-paper/50 sm:text-base"
            />
          </div>

          {/* Bottom row: big stat + CTAs */}
          <div className="mt-10 grid grid-cols-1 items-end gap-8 md:grid-cols-[auto_1fr_auto]">
            {/* Big stat / personal blurb */}
            <div className="max-w-xs">
              <div className="font-display text-6xl font-bold leading-none tracking-tight text-lime sm:text-7xl">
                100%
              </div>
              <p className="mt-2 font-sans text-sm leading-snug text-paper/50">
                Hands-on, start to finish. I help brands and founders in
                Islamabad turn rough ideas into identities and interfaces
                people trust.
              </p>
            </div>

            {/* Spacer */}
            <div />

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={() => scrollTo("#work")}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                See the Work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-lime hover:text-lime"
              >
                Let&apos;s Build
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="/resume"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-lime hover:text-lime"
              >
                Resume ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
