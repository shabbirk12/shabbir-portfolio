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
            className="group relative grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr_1fr] gap-4 md:gap-8 items-center
                       border-b border-line py-6 md:py-8 px-2 -mx-2 overflow-hidden"
          >
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out
                         bg-gradient-to-r from-transparent via-mint/10 to-transparent pointer-events-none"
            />
            <span className="relative font-mono text-xs text-muted group-hover:text-mint transition-colors">
              {s.index}
            </span>
            <h3
              className="relative font-display font-semibold text-xl md:text-3xl uppercase origin-left transition-all duration-500 group-hover:translate-x-4 group-hover:text-mint group-hover:glow-text group-hover:font-bold group-hover:scale-[1.03]"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              {s.title}
            </h3>
            <p
              className="relative text-muted text-sm md:text-base leading-relaxed col-span-2 md:col-span-1 text-right transition-transform duration-500 md:group-hover:-translate-x-4"
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
