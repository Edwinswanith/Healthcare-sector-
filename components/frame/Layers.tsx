"use client";

import { specialties, type FrameState } from "@/content/site";
import { specialtyOrgan } from "@/lib/field/shapes";
import { MiniField } from "./MiniField";

export { LAYER_SIZE, TAB_LABEL } from "@/lib/frame/layout";

const fontFor = (style: string) =>
  style.startsWith("Serif") ? "var(--font-serif)" : style.startsWith("Tinted") ? "var(--font-serif)" : "var(--font-display)";

export function BrowserLayer({ specialty, variant, active }: { specialty: string; variant: string; active: boolean }) {
  const sp = specialties.find((s) => s.slug === specialty) ?? specialties[0];
  const organ = specialtyOrgan[sp.slug] ?? "heart";
  const procedure = variant === "procedure";
  const title = procedure ? "Gallstones and gallbladder removal" : sp.hero;
  const path = procedure ? "/gallbladder-surgery" : `/${sp.slug}`;
  return (
    <div className="ly ly--browser" style={{ ["--sb" as string]: sp.palette.bg, ["--si" as string]: sp.palette.ink, ["--sa" as string]: sp.palette.accent, ["--sf" as string]: fontFor(sp.style) }}>
      <div className="ly-chrome">
        <span className="ly-dots"><i /><i /><i /></span>
        <span className="ly-url">yourpractice.com{path}</span>
        <span className="ly-badge">Concept</span>
      </div>
      <div className="ly-page" data-inner-scroll>
        <div className="ly-nav">
          <span className="ly-logo"><b>YN</b> Your Name <small>Consultant · {sp.name}</small></span>
          <span className="ly-links">Conditions · Treatments · Films · About</span>
          <span className="ly-book">Book a consultation</span>
        </div>
        <div className="ly-hero">
          <div className="ly-hero-copy">
            <span className="ly-eyebrow">{procedure ? "Upper GI · Procedure guide" : `${sp.organ} · ${sp.style}`}</span>
            <h3>{title}</h3>
            <p>{procedure ? "What the operation involves, how to prepare and what recovery looks like, explained in plain English." : sp.description}</p>
            <div className="ly-film">
              <span className="ly-play" />
              <span>Play the film · {procedure ? "03:00" : "02:48"}</span>
            </div>
            <div className="ly-chips"><span>Transcript</span><span>Captions</span><span>Sources named</span></div>
          </div>
          <div className="ly-hero-art">
            <MiniField organ={procedure ? "gut" : organ} active={active} ink={sp.palette.ink} accent={sp.palette.accent} zoom={1.05} />
          </div>
        </div>
        <div className="ly-section">
          <span className="ly-eyebrow">Conditions we treat</span>
          <div className="ly-grid">
            {["Assessment", "Diagnosis", "Treatment options", "Surgery", "Recovery", "Questions to ask"].map((t, i) => (
              <div key={t} className="ly-card"><b>0{i + 1}</b><span>{t}</span><i /></div>
            ))}
          </div>
        </div>
        <div className="ly-section">
          <span className="ly-eyebrow">Films on this site</span>
          <div className="ly-strip">
            {["What to expect", "Before your operation", "Going home"].map((t) => (
              <div key={t} className="ly-thumb"><span className="ly-play" /><span>{t}</span></div>
            ))}
          </div>
        </div>
        <div className="ly-section ly-faq">
          <span className="ly-eyebrow">Common questions</span>
          {["How long is the recovery?", "Will I need a general anaesthetic?", "When should I call for help?"].map((q) => (
            <div key={q} className="ly-q">{q}<span>+</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilmLayer({ active }: { active: boolean }) {
  return (
    <div className="ly ly--film">
      <div className="ly-film-art"><MiniField organ="gut" active={active} zoom={1.2} /></div>
      <span className="ly-film-tag">Patient film · concept preview</span>
      <h3 className="ly-film-title">Gallstones and<br />gallbladder removal</h3>
      <p className="ly-caption">The gallbladder stores bile, which helps you digest fat.</p>
      <div className="ly-bar"><span className="ly-progress" /><span className="ly-time">01:12 / 03:00</span><span className="ly-cc">CC</span><span className="ly-cc">Transcript</span></div>
    </div>
  );
}

export function PresenterLayer({ active }: { active: boolean }) {
  return (
    <div className="ly ly--presenter">
      <div className="ly-half ly-half--ai">
        <div className="ly-presenter-art"><MiniField organ="bust" active={active} zoom={1.15} /></div>
        <span className="ly-disclose">Presented by an AI avatar, with consent</span>
        <div className="ly-lower"><b>Your Name</b><span>Consultant cardiologist</span></div>
      </div>
      <div className="ly-half ly-half--narrator">
        <div className="ly-narr-art"><MiniField organ="heart" active={active} ink="#F3F0E8" zoom={1.25} /></div>
        <span className="ly-disclose ly-disclose--n">House narrator</span>
        <div className="ly-wave">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ ["--h" as string]: `${20 + ((i * 37) % 60)}%` }} />)}</div>
      </div>
      <div className="ly-split"><span>AI presenter</span><b /><span>Narrator</span></div>
      <span className="ly-example">Example layout</span>
    </div>
  );
}

export function ShortLayer({ active, caption = ["Know", "the", "signs"], organ = "heart", meta = "00:35" }: { active: boolean; caption?: string[]; organ?: "heart" | "chest" | "body"; meta?: string }) {
  return (
    <div className="ly ly--short">
      <div className="ly-segs"><i className="on" /><i /><i /></div>
      <div className="ly-short-art"><MiniField organ={organ} active={active} zoom={1.3} /></div>
      <p className="ly-burn">{caption.slice(0, -1).map((w) => <span key={w}>{w} </span>)}<em>{caption[caption.length - 1]}</em></p>
      <div className="ly-rail"><i /><i /><i /></div>
      <span className="ly-short-meta">{meta} · 9:16 · captions on</span>
    </div>
  );
}

export function Layer({ state, active, specialty, variant }: { state: FrameState; active: boolean; specialty: string; variant: string }) {
  switch (state) {
    case "browser":
    case "portfolio":
      return <BrowserLayer specialty={specialty} variant={variant} active={active} />;
    case "film":
      return <FilmLayer active={active} />;
    case "presenter":
      return <PresenterLayer active={active} />;
    case "short":
      return <ShortLayer active={active} />;
    default:
      return <FilmLayer active={active} />;
  }
}
