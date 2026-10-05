"use client";

import { useRef } from "react";
import { specialties, websites } from "@/content/site";
import { frameStore, useFrameStore } from "@/lib/frame/store";
import { Arrow } from "@/components/ui/Arrow";
import { Roll } from "@/components/ui/Roll";

/** Accessible tablist that drives the Media Frame's concept site. */
export function SpecialtyPicker() {
  const { specialty } = useFrameStore();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = specialties.find((s) => s.slug === specialty) ?? specialties[0];

  const select = (slug: string, focus = false) => {
    if (slug === specialty) return;
    const i = specialties.findIndex((s) => s.slug === slug);
    if (focus) tabs.current[i]?.focus();
    if (document.documentElement.classList.contains("frame-live")) {
      window.dispatchEvent(new Event("frame:swap"));
      window.setTimeout(() => frameStore.set({ specialty: slug }), 230);
    } else {
      frameStore.set({ specialty: slug });
    }
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = specialties.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(specialties[to].slug, true);
  };

  return (
    <div className="picker">
      <div className="picker-tabs" role="tablist" aria-label="Choose a specialty">
        {specialties.map((s, i) => (
          <button
            key={s.slug}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tab-${s.slug}`}
            aria-selected={s.slug === specialty}
            aria-controls="specialty-panel"
            tabIndex={s.slug === specialty ? 0 : -1}
            className="chip"
            onClick={() => select(s.slug)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {s.short}
          </button>
        ))}
        <a className="chip chip--ghost" href={websites.notListed.href}>{websites.notListed.label}</a>
      </div>
      <div className="picker-panel" role="tabpanel" id="specialty-panel" aria-labelledby={`tab-${current.slug}`} aria-live="polite">
        <p className="mono picker-meta"><span>{current.organ}</span><span>{current.style}</span><span className="tag">{websites.conceptLabel}</span></p>
        <h3 className="picker-name">{current.name}</h3>
        <p className="picker-desc">{current.description}</p>
        <a className="link" href={`/contact?interest=website&specialty=${current.slug}`}><Roll>{websites.panelCta}</Roll><Arrow /></a>
      </div>
    </div>
  );
}
