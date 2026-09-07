"use client";

import { useRef } from "react";

export default function ToolkitRow({
  index,
  name,
  tag,
}: {
  index: string;
  name: string;
  tag: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      }}
      className="group relative flex items-baseline justify-between gap-4 border-b border-line py-5 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(180px circle at var(--mx, 50%) 50%, rgba(195,255,252,0.08), transparent 70%)",
      }}
    >
      <div
        className="flex items-baseline gap-4 md:gap-6 transition-transform duration-500 group-hover:translate-x-3"
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <span className="font-mono text-xs text-muted group-hover:text-mint transition-colors">
          {index}
        </span>
        <h4 className="font-display text-2xl md:text-3xl uppercase group-hover:text-mint transition-colors">
          {name}
        </h4>
      </div>
      <span
        className="font-mono text-[0.6rem] tracking-widest2 text-muted whitespace-nowrap transition-all duration-500 group-hover:-translate-x-3 group-hover:text-mint/70"
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {tag}
      </span>
    </div>
  );
}
