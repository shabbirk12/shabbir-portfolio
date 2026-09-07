"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

export default function LiquidImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const filterId = `liquid-${useId().replace(/:/g, "")}`;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const turb = turbRef.current;
    const disp = dispRef.current;
    if (!wrap || !turb || !disp) return;

    let scale = 0;
    let target = 0;
    let seed = 0;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
      target = 14 + speed * 1.6;
      seed += 1;
    };
    const onEnter = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onLeave = () => {
      target = 0;
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    const tick = () => {
      scale += (target - scale) * 0.12;
      target *= 0.9; // natural decay so it settles even while the mouse holds still
      disp.setAttribute("scale", scale.toFixed(1));
      if (scale > 0.3) {
        turb.setAttribute("seed", String(Math.floor(seed / 3)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012 0.025"
              numOctaves={2}
              seed={0}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover"
        style={{ filter: `url(#${filterId})` }}
      />
    </div>
  );
}
