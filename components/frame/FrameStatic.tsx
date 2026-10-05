"use client";

import { useEffect, useRef } from "react";
import type { FrameState } from "@/content/site";
import { LAYER_SIZE, TAB_LABEL } from "@/lib/frame/layout";
import { useFrameStore } from "@/lib/frame/store";
import { Layer } from "./Layers";

/**
 * Static stand-in rendered inside each frame slot. Visible when the live
 * Media Frame is not running (reduced motion, no JavaScript, no slot motion).
 */
export function FrameStatic({ state, variant = "home" }: { state: FrameState; variant?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { specialty } = useFrameStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [W, H] = LAYER_SIZE[state];
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      const s = state === "browser" ? Math.max(w / W, (h / H) * 0.55) : Math.max(w / W, h / H);
      el.style.setProperty("--s", s.toFixed(4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [state]);

  return (
    <div ref={ref} className="fstatic" data-state={state} aria-hidden="true">
      <div className="mframe__layer" data-layer={state}>
        <Layer state={state} active={false} specialty={variant === "procedure" ? "upper-gi-hpb" : specialty} variant={variant} />
      </div>
      <div className="mframe__tab"><span className="mframe__dot" /><span>{TAB_LABEL[state]}</span></div>
    </div>
  );
}
