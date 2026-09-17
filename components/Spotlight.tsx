"use client";

import { useEffect, useRef } from "react";

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      ref.current?.style.setProperty("--x", `${e.clientX}px`);
      ref.current?.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
      style={{
        background:
          "radial-gradient(560px circle at var(--x, 50%) var(--y, 20%), color-mix(in srgb, var(--color-lime, #c6ff3d) 8%, transparent), transparent 65%)",
      }}
    />
  );
}
