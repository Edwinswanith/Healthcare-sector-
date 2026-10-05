"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { FrameState } from "@/content/site";
import { FrameController } from "@/lib/frame/controller";
import { TAB_LABEL } from "@/lib/frame/layout";
import { useFrameStore } from "@/lib/frame/store";
import { Layer } from "./Layers";

const STATES: FrameState[] = ["browser", "film", "presenter", "short"];

/** The single persistent Media Frame. Mounted only when motion is enabled. */
export function MediaFrame() {
  const { live, state, specialty, variant } = useFrameStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!live || !el) return;
    const controller = new FrameController(el);
    const tick = () => controller.update();
    gsap.ticker.add(tick);
    const onResize = () => controller.collect();
    window.addEventListener("resize", onResize);
    const onSwap = () => {
      const flash = el.querySelector<HTMLElement>(".mframe__flash");
      if (!flash) return;
      flash.classList.remove("is-on");
      void flash.offsetWidth;
      flash.classList.add("is-on");
    };
    window.addEventListener("frame:swap", onSwap);
    document.documentElement.classList.add("frame-live");
    controller.update();
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("frame:swap", onSwap);
      document.documentElement.classList.remove("frame-live");
    };
  }, [live]);

  if (!live) return null;
  return (
    <div ref={ref} className="mframe" aria-hidden="true" data-show={state}>
      <div className="mframe__inner">
        <div className="mframe__body">
          {STATES.map((s) => (
            <div key={s} className="mframe__layer" data-layer={s}>
              <Layer state={s} active={s === state} specialty={specialty} variant={variant} />
            </div>
          ))}
        </div>
        <div className="mframe__wipe" />
        <div className="mframe__flash" />
        <div className="mframe__tab">
          <span className="mframe__dot" />
          <span className="mframe__tab-label">{TAB_LABEL[state]}</span>
        </div>
      </div>
    </div>
  );
}
