"use client";

import { useEffect, useRef } from "react";

const N = 48;
const src = (i: number) => `/media/heart/h${String(i + 1).padStart(2, "0")}.webp`;

/**
 * Photoreal turntable heart: 48 frames from an AI-generated (Gemini still → Veo
 * orbit) clip, played as a scroll-, drag- and keyboard-driven 3D object.
 * Frames load only when the footer approaches. Reduced motion: first frame only.
 */
export function HeartSpin({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames: HTMLImageElement[] = [];
    let loaded = 0, started = false, visible = false, raf = 0;
    let cur = 0, drag = 0, idle = 0, dragging = false, lastX = 0, kb = 0, drawn = -1;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; drawn = -1; }
    };
    const pingpong = (f: number) => {
      const period = 2 * N - 2;
      const m = ((Math.round(f) % period) + period) % period;
      return m < N ? m : period - m;
    };
    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth || i === drawn) return;
      size();
      const s = Math.min(canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - s) / 2, (canvas.height - s) / 2, s, s);
      drawn = i;
    };
    const load = () => {
      if (started) return;
      started = true;
      for (let i = 0; i < N; i++) {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => { loaded++; if (i === 0) draw(0); };
        im.src = src(i);
        frames.push(im);
        if (reduce) break;
      }
    };
    const tick = () => {
      raf = 0;
      const r = canvas.getBoundingClientRect();
      const scrollF = (1 - (r.top + r.height / 2) / window.innerHeight) * N * 0.9;
      if (!dragging) idle += 0.12;
      const target = scrollF + drag + idle + kb;
      cur += (target - cur) * 0.12;
      draw(loaded >= N ? pingpong(cur) : 0);
      if (visible && !reduce) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting || e.boundingClientRect.top < window.innerHeight * 2) load();
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }, { rootMargin: "600px 0px" });
    io.observe(canvas);

    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.classList.add("is-drag"); };
    const move = (e: PointerEvent) => { if (!dragging) return; drag += (e.clientX - lastX) * 0.18; lastX = e.clientX; };
    const up = () => { dragging = false; canvas.classList.remove("is-drag"); };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { kb += 3; e.preventDefault(); }
      if (e.key === "ArrowLeft") { kb -= 3; e.preventDefault(); }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("keydown", key);
    const onResize = () => { drawn = -1; size(); };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`heart-spin ${className}`}
      role="img"
      aria-label="Rotating anatomical heart, AI-generated illustration. Drag or use arrow keys to turn it."
      tabIndex={0}
    />
  );
}
