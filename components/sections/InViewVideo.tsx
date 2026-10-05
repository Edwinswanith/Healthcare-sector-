"use client";

import { useEffect, useRef } from "react";

/** Muted loop that plays only while on screen (poster otherwise, and for reduced motion). */
export function InViewVideo({ src, className = "", ...rest }: { src: string; className?: string } & React.HTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: "200px" });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className={className} poster={`/media/video/${src}.webp`} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} {...rest}>
      <source src={`/media/video/${src}.webm`} type="video/webm" />
      <source src={`/media/video/${src}.mp4`} type="video/mp4" />
    </video>
  );
}
