"use client";

import { useEffect, useRef } from "react";
import { organCloud, type OrganKey } from "@/lib/field/shapes";

type Props = {
  organ: OrganKey;
  /** Animate only while true; otherwise one static frame is drawn. */
  active: boolean;
  ink?: string;
  accent?: string;
  density?: number;
  zoom?: number;
  className?: string;
};

const N = 1600;

/** Small 2D point-cloud study used inside the Media Frame (decorative). */
export function MiniField({ organ, active, ink = "#F3F0E8", accent = "#E5482F", density = N, zoom = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ from: Float32Array; to: Float32Array; acc: Float32Array; t: number; rot: number; raf: number; organ?: OrganKey }>(null);
  const activeRef = useRef(active);
  const colors = useRef({ ink, accent, zoom });

  useEffect(() => {
    colors.current = { ink, accent, zoom };
  }, [ink, accent, zoom]);

  useEffect(() => {
    const cloud = organCloud(organ, density);
    const s = state.current;
    if (!s) {
      state.current = { from: cloud.pos.slice(), to: cloud.pos, acc: cloud.accent, t: 1, rot: Math.random() * 6, raf: 0, organ };
    } else if (s.organ !== organ) {
      // Morph from the current interpolated cloud to the new organ.
      const cur = new Float32Array(s.to.length);
      const e = ease(s.t);
      for (let i = 0; i < cur.length; i++) cur[i] = s.from[i] + (s.to[i] - s.from[i]) * e;
      s.from = cur;
      s.to = cloud.pos;
      s.acc = cloud.accent;
      s.t = 0;
      s.organ = organ;
      draw(0.016);
    }
    // draw is stable within this effect's closure scope
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organ, density]);

  function ease(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function draw(dt: number) {
    const c = ref.current, s = state.current;
    if (!c || !s) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    if (c.width !== Math.round(w * dpr)) c.width = Math.round(w * dpr);
    if (c.height !== Math.round(h * dpr)) c.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    s.t = Math.min(1, s.t + dt / 0.9);
    s.rot += dt * 0.35;
    const e = ease(s.t);
    const cos = Math.cos(s.rot), sin = Math.sin(s.rot);
    const scale = Math.min(w, h) * 0.42 * colors.current.zoom;
    const cx = w / 2, cy = h / 2;
    const n = s.to.length / 3;
    for (let i = 0; i < n; i++) {
      const d = (i % 97) / 97 * 0.35;
      const m = Math.min(1, Math.max(0, (e - d) / (1 - d)));
      const x0 = s.from[i * 3] + (s.to[i * 3] - s.from[i * 3]) * m;
      const y0 = s.from[i * 3 + 1] + (s.to[i * 3 + 1] - s.from[i * 3 + 1]) * m;
      const z0 = s.from[i * 3 + 2] + (s.to[i * 3 + 2] - s.from[i * 3 + 2]) * m;
      const x = x0 * cos + z0 * sin;
      const z = -x0 * sin + z0 * cos;
      const p = 2.6 / (2.6 - z);
      const a = s.acc[i] > 0.5;
      ctx.globalAlpha = Math.max(0.15, Math.min(1, 0.55 + z * 0.6));
      ctx.fillStyle = a ? colors.current.accent : colors.current.ink;
      const r = (a ? 1.7 : 1.2) * p;
      ctx.fillRect(cx + x * scale * p - r / 2, cy - y0 * scale * p - r / 2, r, r);
    }
    ctx.globalAlpha = 1;
  }

  useEffect(() => {
    activeRef.current = active;
    const s = state.current;
    if (!s) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      if (activeRef.current || (state.current && state.current.t < 1)) s.raf = requestAnimationFrame(loop);
    };
    cancelAnimationFrame(s.raf);
    if (active) s.raf = requestAnimationFrame(loop);
    else draw(0);
    return () => cancelAnimationFrame(s.raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, organ]);

  useEffect(() => {
    const onResize = () => draw(0);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
