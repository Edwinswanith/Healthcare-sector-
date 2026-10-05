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
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <div ref={box} className="cursor-img" aria-hidden="true">
      <img ref={img} alt="" width={960} height={536} decoding="async" />
    </div>
  );
}
