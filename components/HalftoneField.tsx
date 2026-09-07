"use client";

import { useEffect, useRef } from "react";

export default function HalftoneField({
  className = "",
  spacing = 22,
  dotColor = "195,255,252",
  maxRadius = 3.2,
  influence = 130,
  interactive = true,
}: {
  className?: string;
  spacing?: number;
  dotColor?: string;
  maxRadius?: number;
  influence?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Target mouse position (instant) vs. rendered position (spring-integrated) —
    // a real mass/spring/damper model, not just a lerp, so the ripple has actual
    // inertia and settles like a physical object rather than snapping or gliding evenly.
    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    const vel = { x: 0, y: 0 };
    const stiffness = 90;
    const damping = 14;
    const mass = 1;
    let inside = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Pause the whole render loop when off-screen — otherwise this keeps
    // recalculating every dot every frame forever, even scrolled far away.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && raf === 0) raf = requestAnimationFrame(render);
    });
    io.observe(container);

    // Listens on window (not the container) so it keeps tracking the cursor even
    // when other elements (e.g. the hero's particle-text canvases) sit visually on
    // top — mousemove only bubbles up the ancestor chain, never to a sibling.
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };
    const onLeaveWindow = () => {
      inside = false;
    };

    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    }

    let raf = 0;
    let t = 0;
    const dt = 1 / 60;

    const render = () => {
      t += 0.012;

      if (interactive) {
        // Spring-damper integration: F = -k(x - target) - c*v
        const ax = (-stiffness * (pos.x - target.x) - damping * vel.x) / mass;
        const ay = (-stiffness * (pos.y - target.y) - damping * vel.y) / mass;
        vel.x += ax * dt;
        vel.y += ay * dt;
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
      }

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing;
          const y = row * spacing;

          let radius = 0.9;
          let alpha = 0.16;

          if (interactive) {
            const dx = x - pos.x;
            const dy = y - pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (inside && dist < influence) {
              const tt = 1 - dist / influence;
              const wave = Math.sin(tt * Math.PI * 0.5);
              radius = 0.9 + wave * maxRadius;
              alpha = 0.16 + wave * 0.55;
            }
          } else {
            // Gentle ambient shimmer — a slow diagonal wave, no cursor involved.
            const wave = Math.sin((col + row) * 0.35 + t) * 0.5 + 0.5;
            radius = 0.9 + wave * 0.7;
            alpha = 0.12 + wave * 0.14;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(${dotColor}, ${alpha.toFixed(3)})`;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (visible) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    if (visible) raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      }
    };
  }, [spacing, dotColor, maxRadius, influence, interactive]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
