"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Wordmark } from "@/components/ui/Wordmark";

/** Full-screen signal wipe between routes (home ↔ contact). Same-page anchors are untouched. */
export function RouteTransition() {
  const router = useRouter();
  const path = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const covered = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.pathname.endsWith(".txt")) return;
      e.preventDefault();
      const go = () => router.push(url.pathname + url.search + url.hash);
      const el = cover.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go();
      covered.current = true;
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)", visibility: "visible" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "expo.inOut", onComplete: go });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const el = cover.current;
    if (!el || !covered.current) return;
    covered.current = false;
    window.scrollTo(0, 0);
    gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, delay: 0.15, ease: "expo.inOut", onComplete: () => gsap.set(el, { visibility: "hidden" }) });
  }, [path]);

  return (
    <div ref={cover} className="route-cover" aria-hidden="true">
      <Wordmark />
    </div>
  );
}
