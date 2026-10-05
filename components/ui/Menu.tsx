"use client";
/* eslint-disable @next/next/no-img-element -- small pre-encoded WebP thumbnails */

import { useEffect, useRef, useState } from "react";
import { enquire, nav } from "@/content/site";
import { Roll } from "./Roll";

const GRID = ["g-studio", "g-glassheart", "g-edit", "g-clinic"];

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

/** Full-screen menu: modal dialog with focus trap, Escape and focus return, image grid on hover. */
export function Menu() {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState(-1);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        button.current?.focus();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    lenis()?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
      lenis()?.start();
    };
  }, [open]);

  const close = () => { setOpen(false); setHot(-1); };
  const items = [...nav, enquire];

  return (
    <>
      <button ref={button} className="menu-btn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
        <span className="menu-btn-label">{open ? "Close" : "Menu"}</span>
        <span className="menu-btn-icon" aria-hidden="true"><i /><i /></span>
      </button>
      <div id="site-menu" ref={panel} className={`menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" hidden={!open}>
        <div className="menu-grid" aria-hidden="true">
          {GRID.map((g, i) => (
            <figure key={g} className={`menu-img${hot >= 0 && hot % GRID.length === i ? " is-hot" : ""}${hot >= 0 && hot % GRID.length !== i ? " is-dim" : ""}`} style={{ ["--i" as string]: i }}>
              <img src={`/media/gen/${g}-960.webp`} alt="" width={960} height={536} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <div className="menu-side">
          <ul className="menu-list">
            {items.map((n, i) => (
              <li key={n.href} style={{ ["--i" as string]: i }}>
                <a href={n.href} onClick={close} onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} onMouseLeave={() => setHot(-1)}>
                  <span className="mono">0{i + 1}</span>
                  <Roll>{n.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
          <button className="menu-close mono" onClick={() => { close(); button.current?.focus(); }}>Close menu</button>
        </div>
      </div>
    </>
  );
}
