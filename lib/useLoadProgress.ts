"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Real load-progress tracking: counts actual network resources as they finish
 * (via PerformanceObserver on "resource" entries) against a running estimate
 * of the total, and jumps to 100 on the window "load" event. The percentage
 * is genuinely derived from browser loading events, not a fake timer.
 *
 * Completion is intentionally decoupled from the easing animation: once we
 * know loading is done, a plain timeout reveals the site — it never depends
 * on an asymptotic value crossing an exact threshold inside the render loop,
 * which is what caused an earlier version of this hook to occasionally get
 * stuck just under 100 and never reveal the page.
 */
export function useLoadProgress(minDurationMs = 900, maxDurationMs = 4000) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip loader if the page has already loaded in this session
    if (sessionStorage.getItem("site_loaded")) {
      setProgress(100);
      setDone(true);
      return;
    }

    const startedAt = performance.now();
    let target = 0;
    let displayed = 0;
    let raf = 0;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;
    let hardTimer: ReturnType<typeof setTimeout> | null = null;

    const finish = () => {
      if (completionTimer || hardTimer === null) {
        // already finishing or already cleaned up
      }
      cancelAnimationFrame(raf);
      if (completionTimer) clearTimeout(completionTimer);
      if (hardTimer) clearTimeout(hardTimer);
      sessionStorage.setItem("site_loaded", "1");
      setProgress(100);
      setDone(true);
    };

    const scheduleCompletion = () => {
      if (completionTimer) return; // already scheduled
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minDurationMs - elapsed);
      completionTimer = setTimeout(finish, remaining + 150);
    };

    const estimateFromResources = () => {
      try {
        const entries = performance.getEntriesByType("resource");
        const finished = entries.filter(
          (e) => (e as PerformanceResourceTiming).responseEnd > 0
        ).length;
        const estimatedTotal = Math.max(entries.length, finished, 6);
        const pct = Math.min(96, (finished / estimatedTotal) * 100);
        target = Math.max(target, pct);
      } catch {
        // Resource Timing unsupported in this environment — load-event and
        // the hard timeout below still guarantee completion.
      }
    };

    estimateFromResources();

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver(() => estimateFromResources());
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // Unsupported — fine, load-event + hard timeout cover us.
    }

    const onLoad = () => {
      target = 100;
      scheduleCompletion();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    // Absolute safety net: no matter what happens above, never leave the
    // loader on screen forever.
    hardTimer = setTimeout(finish, maxDurationMs);

    const tick = () => {
      displayed += (target - displayed) * 0.15;
      const shown = Math.min(99, Math.round(displayed));
      setProgress((prev) => (shown !== prev ? shown : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("load", onLoad);
      if (completionTimer) clearTimeout(completionTimer);
      if (hardTimer) clearTimeout(hardTimer);
    };
  }, [minDurationMs, maxDurationMs]);

  return { progress, done };
}
