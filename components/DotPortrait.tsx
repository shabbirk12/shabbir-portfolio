"use client";

import { useEffect, useRef } from "react";

class DotParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx = 0;
  vy = 0;
  size: number;
  color: string;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.size = size;
    this.color = color;
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 70;

    if (distance < radius && mouseX !== -1000) {
      const force = (radius - distance) / radius;
      this.vx -= (dx / (distance || 1)) * force * 6;
      this.vy -= (dy / (distance || 1)) * force * 6;
    }

    this.vx += (this.originX - this.x) * 0.08;
    this.vy += (this.originY - this.y) * 0.08;
    this.vx *= 0.82;
    this.vy *= 0.82;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function DotPortrait({
  src,
  className = "",
  dotColor = "195,255,252",
  step = 4,
}: {
  src: string;
  className?: string;
  dotColor?: string;
  step?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: DotParticle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    const img = new Image();
    img.src = src;

    const build = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Offscreen sample pass — draw the image cover-fit into a hidden canvas
      // sized to the container so we can read pixel brightness per dot cell.
      const sample = document.createElement("canvas");
      sample.width = Math.floor(width);
      sample.height = Math.floor(height);
      const sctx = sample.getContext("2d");
      if (!sctx) return;

      const imgRatio = img.width / img.height;
      const boxRatio = width / height;
      let drawW, drawH, offX, offY;
      if (imgRatio > boxRatio) {
        drawH = height;
        drawW = height * imgRatio;
        offX = (width - drawW) / 2;
        offY = 0;
      } else {
        drawW = width;
        drawH = width / imgRatio;
        offX = 0;
        offY = (height - drawH) / 2;
      }
      sctx.filter = "grayscale(1) contrast(1.1)";
      sctx.drawImage(img, offX, offY, drawW, drawH);

      const data = sctx.getImageData(0, 0, sample.width, sample.height).data;

      particles = [];
      for (let y = 0; y < sample.height; y += step) {
        for (let x = 0; x < sample.width; x += step) {
          const i = (y * sample.width + x) * 4;
          const r = data[i];
          const a = data[i + 3];
          if (a < 40) continue;
          const brightness = r / 255;
          const size = 0.6 + brightness * 1.6;
          const alpha = 0.25 + brightness * 0.75;
          particles.push(
            new DotParticle(x, y, size, `rgba(${dotColor}, ${alpha.toFixed(2)})`)
          );
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let visible = true;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update(mouseX, mouseY);
        p.draw(ctx);
      });
      if (visible) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    let ro: ResizeObserver | null = null;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && raf === 0) raf = requestAnimationFrame(render);
    });
    io.observe(container);

    const start = () => {
      build();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
      ro = new ResizeObserver(() => build());
      ro.observe(container);
    };

    if (img.complete) {
      start();
    } else {
      img.onload = start;
    }

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [src, dotColor, step]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
