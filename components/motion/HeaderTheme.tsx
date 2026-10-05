"use client";

import { useEffect } from "react";

/** Keeps the fixed header legible over paper and ink sections. Runs with or without motion. */
export function HeaderTheme() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme].s"));
    let raf = 0;
    const update = () => {
      raf = 0;
      let theme = "paper";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) theme = s.dataset.theme ?? "paper";
      }
      if (header.dataset.theme !== theme) header.dataset.theme = theme;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return null;
}
