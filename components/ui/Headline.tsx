import type { JSX } from "react";
import type { Headline as H } from "@/content/site";

/** Hand-drawn sign-off stroke used under accent words. */
export function Stroke({ className = "stroke" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 17 C 48 7, 96 21, 148 13 S 236 6, 296 15" />
    </svg>
  );
}

/**
 * Display headline: explicit lines (from content) so motion can reveal line
 * by line without splitting text at runtime. The accent word is set in the
 * serif italic and underlined by the sign-off stroke.
 */
export function Headline({ h, as = "h2", className = "" }: { h: H; as?: keyof JSX.IntrinsicElements; className?: string }) {
  const Tag = as as "h2";
  const last = h.lead.length - 1;
  return (
    <Tag className={`hl ${className}`} data-reveal>
      {h.lead.map((line, i) => (
        <span key={i} className="hl-line">
          <span className="hl-in">
            {line}
            {i === last ? (
              <>
                {" "}
                <em className="hl-accent">
                  {h.accent}
                  <Stroke />
                </em>
              </>
            ) : null}
          </span>
          <span className="bw" aria-hidden="true" />
          {i !== last ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
