"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value.replace(/[0-9.]/g, (c) => (c === "." ? "." : "0")));

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^(-?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, sign, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const isDecimal = numStr.includes(".");

    const controls = animate(0, target, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplay(`${sign}${isDecimal ? v.toFixed(1) : Math.round(v)}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}
