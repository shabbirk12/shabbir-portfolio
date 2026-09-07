"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import type { WorkItem } from "@/lib/types";

const THUMB_W = 300;
const THUMB_H = 210;
const EDGE_FADE = 90; // px from a viewport edge where the preview fades out

export default function WorkRow({ item, delay }: { item: WorkItem; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const [edgeFactor, setEdgeFactor] = useState(0);
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 24, stiffness: 260, mass: 0.6 });
  const springY = useSpring(y, { damping: 24, stiffness: 260, mass: 0.6 });

  // Only render the portal target after mount — avoids SSR/document mismatch.
  useEffect(() => setMounted(true), []);

  const place = (clientX: number, clientY: number) => {
    const margin = 16;
    const maxX = window.innerWidth - THUMB_W - margin;
    const maxY = window.innerHeight - THUMB_H - margin;
    x.set(Math.min(Math.max(clientX + 28, margin), Math.max(maxX, margin)));
    y.set(Math.min(Math.max(clientY - 100, margin), Math.max(maxY, margin)));

    const distToEdge = Math.min(clientX, window.innerWidth - clientX);
    setEdgeFactor(Math.min(1, Math.max(0, (EDGE_FADE - distToEdge) / EDGE_FADE)));
  };

  return (
    <div
      onMouseMove={(e) => place(e.clientX, e.clientY)}
      onMouseEnter={(e) => {
        place(e.clientX, e.clientY);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className="relative border-b border-line"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay }}
      >
        <Link
          href={`/work/${item.slug}`}
          className="group grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10 items-start py-8 md:py-10 no-underline hover:no-underline"
        >
          {/* Left: year, title, description — indents rightward on hover */}
          <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-4 md:group-hover:translate-x-6">
            <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-lime">
              {item.year}
            </span>
            <h3 className="font-display text-3xl md:text-5xl uppercase mt-1 mb-2 transition-colors duration-300 group-hover:text-lime">
              {item.title}
            </h3>
            <p className="text-muted text-sm md:text-base max-w-md truncate">{item.summary}</p>
          </div>

          {/* Right: two-line category meta with a thin separator — indents leftward on hover */}
          <div className="hidden md:flex flex-col items-end text-right shrink-0 pt-1 transition-transform duration-300 group-hover:-translate-x-6">
            <span className="text-muted text-sm leading-relaxed transition-colors duration-300 group-hover:text-paper">
              {item.tag}
            </span>
            <span className="my-1.5 h-px w-8 bg-line" />
            <span className="text-muted text-sm leading-relaxed transition-colors duration-300 group-hover:text-paper">
              {item.caseStudy.role}
            </span>
          </div>
        </Link>
      </motion.div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -3, filter: "blur(6px)" }}
                animate={{
                  opacity: 1 - edgeFactor,
                  scale: 1 - edgeFactor * 0.35,
                  rotate: 0,
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
                style={{ x: springX, y: springY, width: THUMB_W, height: THUMB_H }}
                className="pointer-events-none fixed left-0 top-0 z-[60] border border-line shadow-glow overflow-hidden"
              >
                <Image src={item.image} alt={item.title} fill sizes="300px" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
