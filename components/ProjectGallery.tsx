"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectGallery({
  gallery,
}: {
  gallery: { label: string; image: string }[];
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const active = selectedIdx !== null ? gallery[selectedIdx] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((g, i) => (
          <div
            key={g.label || i}
            onClick={() => setSelectedIdx(i)}
            className="section-frame relative border border-line bg-surface/40 overflow-hidden group cursor-pointer hover:border-lime transition-all duration-300 hover:shadow-glow-sm"
          >
            <span className="corner-bracket top-2 left-2 border-t border-l" />
            <span className="corner-bracket bottom-2 right-2 border-b border-r" />

            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={g.image}
                alt={g.label || `Gallery view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink/30 backdrop-blur-[2px]">
                <span className="rounded-full bg-lime text-lime-ink px-3 py-1 font-mono text-[0.65rem] tracking-widest2">
                  VIEW FULLSCREEN ↗
                </span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-line/60">
              <p className="font-mono text-[0.65rem] tracking-widest2 text-paper uppercase truncate">
                {g.label || `VIEW 0${i + 1}`}
              </p>
              <span className="font-mono text-[0.65rem] text-lime">0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 font-mono text-xs tracking-widest2 border border-line px-4 py-2 hover:border-lime hover:text-lime transition-colors text-paper"
            >
              CLOSE [ESC] ✕
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[80vh] aspect-[16/10] border border-line bg-surface overflow-hidden rounded shadow-2xl"
            >
              <Image
                src={active.image}
                alt={active.label}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            <div className="mt-4 flex items-center justify-between max-w-5xl w-full text-paper">
              <p className="font-mono text-xs tracking-widest2 uppercase text-lime">
                {active.label}
              </p>
              <p className="font-mono text-xs text-muted">
                {selectedIdx! + 1} / {gallery.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
