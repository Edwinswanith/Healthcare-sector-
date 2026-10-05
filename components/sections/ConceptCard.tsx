"use client";

import { specialties } from "@/content/site";
import { specialtyOrgan } from "@/lib/field/shapes";
import { MiniField } from "@/components/frame/MiniField";

/** Small code-rendered concept-site tile for the Work wall (decorative). */
export function ConceptCard({ slug }: { slug: string }) {
  const s = specialties.find((x) => x.slug === slug)!;
  const serif = !s.style.startsWith("Grotesque");
  return (
    <div className="cc" data-tilt style={{ ["--sb" as string]: s.palette.bg, ["--si" as string]: s.palette.ink, ["--sa" as string]: s.palette.accent }}>
      <div className="cc-bar"><i /><i /><i /><span>{s.slug}</span></div>
      <div className="cc-art"><MiniField organ={specialtyOrgan[s.slug] ?? "heart"} active={false} ink={s.palette.ink} accent={s.palette.accent} density={900} zoom={1.1} /></div>
      <p className={`cc-title${serif ? " cc-title--serif" : ""}`}>{s.hero}</p>
      <p className="cc-meta">{s.name} · Concept</p>
    </div>
  );
}
