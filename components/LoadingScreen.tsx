"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLoadProgress } from "@/lib/useLoadProgress";

export default function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const { progress, done } = useLoadProgress();

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
        >
          <div className="flex items-baseline gap-2 font-display tabular-nums">
            <motion.span
              key={Math.floor(progress / 100)}
              className="text-[22vw] leading-none text-paper sm:text-[16vw] md:text-[12vw]"
            >
              {progress}
            </motion.span>
            <span className="text-3xl text-muted sm:text-4xl md:text-5xl">%</span>
          </div>

          <div className="mt-6 h-px w-40 overflow-hidden bg-line sm:w-56">
            <motion.div
              className="h-full bg-lime"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            Loading site
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
