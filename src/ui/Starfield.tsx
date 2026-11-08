"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle animated starfield — a flat, low-cost canvas background (not a 3D
 * scene). Drifting dots with a faint parallax, matching the premium reference.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas = canvasEl; // non-null, stable for closures
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const ctx = ctx2d;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; z: number; r: number };
    let stars: Star[] = [];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(), // depth 0..1
        r: Math.random() * 1.4 + 0.3,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      // faint vignette glow
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(40,54,96,0.25)");
      grad.addColorStop(1, "rgba(10,12,18,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.y += (0.02 + s.z * 0.06) * (reduce ? 0 : 1);
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
        const alpha = 0.25 + s.z * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${180 + s.z * 60},${195 + s.z * 50},255,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}
