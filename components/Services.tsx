"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { ServiceItem } from "@/lib/contentStore";

export default function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section id="services" className="px-6 md:px-10 py-24 md:py-32 border-t border-line">
      <Reveal className="mb-14">
        <p className="eyebrow mb-3">02 / WHAT I DO</p>
        <h2 className="font-display text-4xl md:text-6xl uppercase">Services</h2>
      </Reveal>

      <div>
        {services.map((s, i) => (
          <motion.div
            key={s.index}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6
                       border-b border-line py-6 md:py-8 px-2 -mx-2 overflow-hidden"
          >
            {/* Ambient background hover sweep */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out
                         bg-gradient-to-r from-transparent via-lime/10 to-transparent pointer-events-none"
            />

            {/* Left: Index & Title (shrink-0 so title stays crisp on one line) */}
            <div className="relative flex items-center gap-4 md:gap-6 shrink-0 z-10">
              <span className="font-mono text-xs text-muted group-hover:text-lime transition-colors">
                {s.index}
              </span>
              <h3
                className="font-display font-semibold text-xl md:text-3xl uppercase origin-left transition-all duration-500 group-hover:translate-x-3 group-hover:text-lime group-hover:glow-text group-hover:scale-[1.02]"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                {s.title}
              </h3>
            </div>

            {/* Middle: Full Available Width Auto-Adjusting Thumbnail (faded only on left and right) */}
            {s.image ? (
              <div
                className="relative hidden md:flex flex-1 min-w-[100px] h-16 md:h-20 items-center justify-center overflow-hidden mx-3 lg:mx-6 transition-transform duration-500 group-hover:scale-[1.01]"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500 filter brightness-95 contrast-105"
                />
              </div>
            ) : (
              <div className="hidden md:block flex-1 min-w-[20px]" />
            )}

            {/* Mobile Thumbnail with same left/right faded edges */}
            {s.image && (
              <div
                className="md:hidden relative h-20 w-full overflow-hidden my-1"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}

            {/* Right: Description (shrink-0, auto-sized, text-right on desktop) */}
            <p
              className="relative text-muted text-sm md:text-base leading-relaxed shrink-0 max-w-xs md:max-w-sm lg:max-w-md text-left md:text-right transition-transform duration-500 md:group-hover:-translate-x-3 z-10"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              {s.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
