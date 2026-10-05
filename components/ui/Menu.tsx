"use client";

import { useEffect, useRef, useState } from "react";
import { enquire, nav } from "@/content/site";

/** Full-screen menu: modal dialog with focus trap, Escape and focus return. */
export function Menu() {
  const [open, setOpen] = useState(false);
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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button ref={button} className="menu-btn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
        <span className="menu-btn-label">{open ? "Close" : "Menu"}</span>
        <span className="menu-btn-icon" aria-hidden="true"><i /><i /></span>
      </button>
      <div id="site-menu" ref={panel} className={`menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" hidden={!open}>
        <ul className="menu-list">
          {nav.map((n, i) => (
            <li key={n.href} style={{ ["--i" as string]: i }}>
              <a href={n.href} onClick={close}><span className="mono">0{i + 1}</span>{n.label}</a>
            </li>
          ))}
          <li style={{ ["--i" as string]: nav.length }}>
            <a href={enquire.href} onClick={close}><span className="mono">0{nav.length + 1}</span>{enquire.label}</a>
          </li>
        </ul>
        <button className="menu-close mono" onClick={() => { close(); button.current?.focus(); }}>Close menu</button>
      </div>
    </>
  );
}
