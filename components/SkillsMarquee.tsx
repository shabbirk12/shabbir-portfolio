"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";

export default function SkillsMarquee({ skills }: { skills: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    let groupWidth = group.scrollWidth;
    const ro = new ResizeObserver(() => {
      groupWidth = group.scrollWidth;
    });
    ro.observe(group);

    let lastScrollY = window.scrollY;
    let targetDir = 1; // 1 = scrolling down (marquee runs left → right), -1 = scrolling up

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastScrollY) > 1) {
        targetDir = y > lastScrollY ? 1 : -1;
        lastScrollY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let offset = 0;
    let velocity = 1.1; // current speed (px/frame), eased toward target below
    const baseSpeed = 1.1;
    let raf = 0;

    const tick = () => {
      const targetVelocity = baseSpeed * targetDir;
      // Ease current velocity toward the target — this is what makes a direction
      // reversal feel like it has real inertia instead of snapping instantly.
      velocity += (targetVelocity - velocity) * 0.02;
      offset += velocity;

      if (groupWidth > 0) {
        offset = ((offset % groupWidth) + groupWidth) % groupWidth;
      }
      track.style.transform = `translateX(${-offset}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Reveal className="relative overflow-hidden border-y border-line py-5 bg-surface/30 select-none">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group} ref={group === 0 ? groupRef : undefined} className="flex items-center">
            {skills.map((skill, i) => (
              <span key={`${group}-${i}`} className="flex items-center pr-10 whitespace-nowrap">
                <span className="font-display text-xl md:text-3xl uppercase text-paper">
                  {skill}
                </span>
                <span className="mx-10 w-1.5 h-1.5 rounded-full bg-mint" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
