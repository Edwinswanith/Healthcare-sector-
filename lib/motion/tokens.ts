import type { FrameState } from "@/content/site";
import type { FieldKey } from "@/lib/field/AnatomyField";

// Motion tokens. Durations and ranges here are design proposals, tuned by eye
// in the browser; none are measurements of the reference site.

export const MQ = {
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
  any: "(prefers-reduced-motion: no-preference)",
} as const;

export const THEME: Record<string, number> = { paper: 0, ink: 1 };

export const OFFER_STATES: FrameState[] = ["browser", "film", "presenter", "short"];

export function aspectOf(state: FrameState, desktop: boolean) {
  switch (state) {
    case "browser":
      return desktop ? 16 / 10.5 : 4 / 3.4;
    case "film":
    case "presenter":
      return 16 / 9;
    case "short":
      return 9 / 16;
    default:
      return 16 / 10;
  }
}

/** Largest rect of the given aspect centred inside an area. */
export function fitInto(area: { x: number; y: number; w: number; h: number }, aspect: number) {
  let width = area.w;
  let height = width / aspect;
  if (height > area.h) {
    height = area.h;
    width = height * aspect;
  }
  return { left: area.x + (area.w - width) / 2, top: area.y + (area.h - height) / 2, width, height };
}

type Place = { x: number; y: number; scale: number; alpha: number };

/** Where the Anatomy Field sits for each state (clip-space offsets). */
export function place(key: FieldKey, mobile: boolean, theme: number): Place {
  const ink = theme > 0.5;
  switch (key) {
    case "body":
      return mobile ? { x: 0.28, y: 0.08, scale: 0.86, alpha: 0.42 } : { x: 0.3, y: -0.02, scale: 1.12, alpha: 0.85 };
    case "heart":
      return mobile ? { x: 0, y: 0.1, scale: 0.85, alpha: 0.7 } : { x: -0.48, y: -0.05, scale: 1.25, alpha: 0.8 };
    case "drift":
      return { x: 0, y: 0, scale: 1, alpha: ink ? 0.5 : 0.32 };
    default:
      return { x: 0.3, y: 0, scale: 1.1, alpha: 0.8 };
  }
}
