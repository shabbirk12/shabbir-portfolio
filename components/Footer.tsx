"use client";

import { useEffect, useRef, useState } from "react";
import HalftoneField from "@/components/HalftoneField";
import { profile } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading slightly before it's on screen
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-line">
      {/* Background video loop — only mounted once scrolled near, so it never
          competes with initial page load for bandwidth. */}
      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          src="https://assets.mixkit.co/hu698q7kx95o7e2e9933n4eu4zqv"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
      <HalftoneField className="opacity-40" spacing={26} interactive={false} />

      <div className="relative px-6 md:px-10 py-16 md:py-20">
        <Reveal delay={0.1} className="grid md:grid-cols-3 gap-10 border-b border-line pb-10 font-mono text-xs tracking-widest2">
          <div>
            <p className="text-muted mb-3">CONTACT</p>
            <a href={`mailto:${profile.email}`} className="block text-paper hover:text-lime transition-colors mb-1">
              {profile.email}
            </a>
            <a
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="block text-paper hover:text-lime transition-colors mb-1"
            >
              {profile.linkedin}
            </a>
            <a
              href={`https://${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="block text-paper hover:text-lime transition-colors"
            >
              {profile.github}
            </a>
          </div>

          <div>
            <p className="text-muted mb-3">LOCATION</p>
            <p className="text-paper">ISLAMABAD · PK</p>
            <p className="text-muted mt-1">33.7°N 73.0°E</p>
          </div>

          <div>
            <p className="text-muted mb-3">SITE</p>
            <a href="/#top" className="block text-paper hover:text-lime transition-colors mb-1">
              BACK TO TOP ↑
            </a>
            <a href="/blog" className="block text-paper hover:text-lime transition-colors mb-1">
              ARTICLES &amp; BLOG ↗
            </a>
            <a href="/resume" className="block text-paper hover:text-lime transition-colors">
              RESUME ↗
            </a>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[0.65rem] tracking-widest2 text-muted">
          <p>© {new Date().getFullYear()} SHABBIR KHAN. ALL RIGHTS RESERVED.</p>
          <a href="/#top" className="text-lime hover:opacity-80 transition-opacity">
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
