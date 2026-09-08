"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Buttery smooth scrolling, respects reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const root = document.documentElement;
    const unsubscribe = lenis.on("scroll", ({ velocity }) => {
      const duration = Math.round(900 - Math.min(Math.abs(velocity) / 25, 1) * 500);
      root.style.setProperty("--reveal-duration", `${duration}ms`);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      root.style.removeProperty("--reveal-duration");
      lenis.destroy();
    };
  }, []);

  return null;
}
