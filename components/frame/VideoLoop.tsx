"use client";

import { useEffect, useRef } from "react";

/**
 * Muted decorative loop. Poster shows until it plays; it only loads and plays
 * while `active`, and pauses otherwise. Reduced motion: poster only.
 */
export function VideoLoop({ src, active, className = "" }: { src: string; active: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && !reduce) {
      if (v.preload !== "auto") v.preload = "auto";
      v.play().catch(() => { /* autoplay refused: poster stays */ });
    } else {
      v.pause();
    }
  }, [active]);
  return (
    <video
      ref={ref}
      className={`vloop ${className}`}
      poster={`/media/video/${src}.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`/media/video/${src}.webm`} type="video/webm" />
      <source src={`/media/video/${src}.mp4`} type="video/mp4" />
    </video>
  );
}
