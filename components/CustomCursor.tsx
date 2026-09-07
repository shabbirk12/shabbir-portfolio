"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "default" | "pointer" | "move" | "hidden";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 22, stiffness: 380, mass: 0.4 });
  const springY = useSpring(y, { damping: 22, stiffness: 380, mass: 0.4 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      if (target.closest("[data-hide-cursor]")) {
        setMode("hidden");
      } else if (target.closest("a, button, input, textarea")) {
        setMode("pointer");
      } else if (target.closest('[data-cursor="move"]')) {
        setMode("move");
      } else {
        setMode("default");
      }
    };
    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [x, y, visible]);

  const size = mode === "move" ? 84 : mode === "pointer" ? 48 : 28;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:flex items-center justify-center
                 rounded-full border border-mint mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        opacity: mode === "hidden" ? 0 : visible ? 1 : 0,
        backgroundColor:
          mode === "default" ? "rgba(195,255,252,0.15)" : "rgba(195,255,252,0.12)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {mode === "move" && (
        <motion.svg
          viewBox="0 0 84 84"
          width={84}
          height={84}
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 mix-blend-normal"
        >
          <defs>
            <path id="cursor-move-path" d="M 42,42 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
          </defs>
          <text fill="#c3fffc" fontSize="9" letterSpacing="2" fontFamily="var(--font-mono)">
            <textPath href="#cursor-move-path" startOffset="0%">
              MOVE • MOVE • MOVE • MOVE •
            </textPath>
          </text>
        </motion.svg>
      )}
    </motion.div>
  );
}
