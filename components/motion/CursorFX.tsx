"use client";
/* eslint-disable @next/next/no-img-element -- small pre-encoded WebP preview */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Pointer-only hover layer: an image that follows the cursor over
 * [data-hover-img] rows (tilting with velocity), and magnetic buttons.
 * Disabled on coarse pointers and reduced motion; never required for any action.
 */
export function CursorFX() {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = box.current, im = img.current;
    if (!fine || reduce || !el || !im) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3" });
    let lastX = 0, current = "", active = false;

    // 3D tilt with glare on [data-tilt] cards
    type Tilt = { rx: (v: number) => void; ry: (v: number) => void };
    const tilts = new WeakMap<HTMLElement, Tilt>();
    let tilted: HTMLElement | null = null;
    const tiltOf = (t: HTMLElement) => {
      let q = tilts.get(t);
      if (!q) {
        gsap.set(t, { transformPerspective: 900 });
        q = { rx: gsap.quickTo(t, "rotationX", { duration: 0.6, ease: "power3" }), ry: gsap.quickTo(t, "rotationY", { duration: 0.6, ease: "power3" }) };
        tilts.set(t, q);
      }
      return q;
    };
    const untilt = () => {
      if (!tilted) return;
      const q = tiltOf(tilted);
      q.rx(0);
      q.ry(0);
      tilted.style.setProperty("--go", "0");
      tilted = null;
    };

    const show = (src: string) => {
      if (src !== current) {
        current = src;
        im.src = `/media/gen/${src}-960.webp`;
      }
      if (!active) {
        active = true;
        gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        gsap.fromTo(im, { scale: 1.3 }, { scale: 1, duration: 0.8, ease: "power3.out" });
      }
    };
    const hide = () => {
      if (!active) return;
      active = false;
      gsap.to(el, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: "power2.in", overwrite: "auto" });
    };
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
      const tt = (e.target as Element | null)?.closest?.("[data-tilt]") as HTMLElement | null;
      if (tt !== tilted) untilt();
      if (tt) {
        tilted = tt;
        const r = tt.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        const q = tiltOf(tt);
        q.ry(nx * 12);
        q.rx(-ny * 9);
        tt.style.setProperty("--gx", `${((nx + 0.5) * 100).toFixed(1)}%`);
        tt.style.setProperty("--gy", `${((ny + 0.5) * 100).toFixed(1)}%`);
        tt.style.setProperty("--go", "1");
      }
      const t = (e.target as Element | null)?.closest?.("[data-hover-img]") as HTMLElement | null;
      if (t && t.dataset.hoverImg) show(t.dataset.hoverImg);
      else hide();
    };

    // Magnetic buttons
    const mags = Array.from(document.querySelectorAll<HTMLElement>(".btn, .menu-btn"));
    const offs = mags.map((m) => {
      const mx = gsap.quickTo(m, "x", { duration: 0.5, ease: "power3" });
      const my = gsap.quickTo(m, "y", { duration: 0.5, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.36);
      };
      const leave = () => { mx(0); my(0); };
      m.addEventListener("pointermove", move);
      m.addEventListener("pointerleave", leave);
      return () => { m.removeEventListener("pointermove", move); m.removeEventListener("pointerleave", leave); gsap.set(m, { x: 0, y: 0 }); };
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    const leaveAll = () => { hide(); untilt(); };
    document.documentElement.addEventListener("pointerleave", leaveAll);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", leaveAll);
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <div ref={box} className="cursor-img" aria-hidden="true">
      <img ref={img} alt="" width={960} height={536} decoding="async" />
    </div>
  );
}
