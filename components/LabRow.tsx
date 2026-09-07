"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LabItem } from "@/lib/contentStore";

export default function LabRow({
  item,
  delay,
}: {
  item: LabItem;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={`https://${item.link}`}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ default: { duration: 0.5, delay }, scale: { type: "spring", stiffness: 300, damping: 20 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.015 : 1 }}
      style={{
        boxShadow: hovered ? "0 0 60px -10px rgba(195,255,252,0.4)" : "0 0 0px rgba(195,255,252,0)",
      }}
      className="section-frame relative flex flex-col gap-6 overflow-hidden border border-line p-7 transition-[border-color] duration-300 hover:border-mint md:flex-row md:items-center"
    >
      {/* Directional fill: sweeps in from the left, retreats to the right */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.7 }}
        style={{ transformOrigin: hovered ? "left" : "right" }}
        className="absolute inset-0 bg-mint"
      />

      <span className="corner-bracket top-2 left-2 border-t border-l" />
      <span className="corner-bracket bottom-2 right-2 border-b border-r" />

      <span
        className={`relative shrink-0 w-10 font-mono text-xs transition-all duration-300 ${
          hovered ? "translate-x-3 text-mint-ink" : "text-mint"
        }`}
      >
        {item.index}
      </span>

      <div className={`relative flex-1 transition-transform duration-300 ${hovered ? "translate-x-3" : ""}`}>
        <div className="mb-3 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className={`font-mono text-[0.6rem] tracking-widest2 border px-2 py-1 transition-colors duration-300 ${
                hovered ? "border-mint-ink/40 text-mint-ink" : "border-line text-muted"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <h3
          className={`font-display text-2xl md:text-3xl uppercase mb-2 transition-colors duration-300 ${
            hovered ? "text-mint-ink" : ""
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-sm leading-relaxed max-w-lg transition-colors duration-300 ${
            hovered ? "text-mint-ink/80" : "text-muted"
          }`}
        >
          {item.detail}
        </p>
      </div>

      <span
        className={`relative shrink-0 font-mono text-xs tracking-widest2 transition-colors duration-300 ${
          hovered ? "text-mint-ink" : "text-mint"
        }`}
      >
        {item.link} →
      </span>
    </motion.a>
  );
}
