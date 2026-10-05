"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { AnatomyField, type FieldKey } from "@/lib/field/AnatomyField";
import { frameStore } from "@/lib/frame/store";
import type { SlotEl } from "@/lib/frame/controller";
import { MQ, OFFER_STATES, aspectOf, fitInto, place, THEME } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

declare global {
  interface Window {
    __tcIntroHandled?: boolean;
    __tcTriggers?: () => number;
  }
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(",")})`;
};

/**
 * Owns every scroll-linked timeline on the home page. Content is server
 * rendered and complete without this component; it only adds motion.
 */
export function Choreography() {
  useEffect(() => {
    const root = document.documentElement;
    window.__tcIntroHandled = true;
    // QA hook: lets tests detect leaked or duplicated scroll triggers.
    window.__tcTriggers = () => ScrollTrigger.getAll().length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.remove("intro", "js-anim");
      root.classList.add("reduced");
      return;
    }
    root.classList.add("motion", "frame-pre");
    frameStore.set({ live: true });

    const first = root.classList.contains("intro");
    const mobile = window.matchMedia(MQ.mobile).matches;

    // ---------- Anatomy Field (one WebGL canvas) ----------
    let field: AnatomyField | null = null;
    const canvas = document.querySelector<HTMLCanvasElement>(".field-canvas");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (canvas && !conn?.saveData) {
      try {
        field = new AnatomyField(canvas, { n: mobile ? 11000 : 22000, dprCap: mobile ? 1.25 : 1.5 });
      } catch {
        root.classList.add("no-webgl");
      }
    } else root.classList.add("no-webgl");

    const backdrop = document.querySelector<HTMLElement>(".backdrop");
    const timecode = document.querySelector<HTMLElement>("[data-timecode]");
    let sections = Array.from(document.querySelectorAll<HTMLElement>("[data-field]"));
    const assemble = { v: 0 };
    let lastT = performance.now();
    let lastTime = "";

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const vh = window.innerHeight;
      const tops = sections.map((s) => s.getBoundingClientRect().top);
      let cur = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= vh * 0.35) cur = k;
      const nxt = Math.min(cur + 1, sections.length - 1);
      const m = nxt === cur ? 0 : clamp((vh - tops[nxt]) / (vh * 0.65));
      const a = sections[cur].dataset.field as FieldKey;
      const b = sections[nxt].dataset.field as FieldKey;
      const ta = THEME[sections[cur].dataset.theme ?? "paper"];
      const tb = THEME[sections[nxt].dataset.theme ?? "paper"];
      const theme = lerp(ta, tb, m);
      if (backdrop) backdrop.style.backgroundColor = mixHex("#F3F0E8", "#0D1524", theme);

      if (timecode) {
        const max = document.documentElement.scrollHeight - vh;
        const sec = Math.round((window.scrollY / Math.max(1, max)) * 180);
        const label = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")} / 03:00`;
        if (label !== lastTime) {
          timecode.textContent = label;
          lastTime = label;
        }
      }

      if (field && !document.hidden) {
        const pa = place(a, mobile, ta), pb = place(b, mobile, tb);
        const t = field.target;
        t.from = a;
        t.to = b;
        t.mix = m;
        t.assemble = assemble.v;
        t.offsetX = lerp(pa.x, pb.x, m);
        t.offsetY = lerp(pa.y, pb.y, m);
        t.scale = lerp(pa.scale, pb.scale, m);
        t.alpha = lerp(pa.alpha, pb.alpha, m);
        t.theme = theme;
        t.beat = (a === "heart" ? 1 - m : 0) + (b === "heart" ? m : 0);
        field.render(dt);
      }
    };
    gsap.ticker.add(tick);

    const onPointer = (e: PointerEvent) => field?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    const onResize = () => {
      field?.resize();
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-field]"));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      // ---------- SM1 Assembly: loader → field assembles → type sets ----------
      const hero = document.querySelector<HTMLElement>(".s-hero");
      const lines = gsap.utils.toArray<HTMLElement>(".hl--hero .hl-in");
      const stroke = document.querySelector(".hl--hero .stroke path");
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      gsap.set(lines, { yPercent: 112, "--wdth": 62 });
      gsap.set(fades, { autoAlpha: 0, y: 26 });
      if (stroke) gsap.set(stroke, { drawSVG: "0%" });
      root.classList.remove("js-anim");

      const intro = gsap.timeline({ paused: true });
      intro
        .to(assemble, { v: 1, duration: first ? 2.1 : 0.9, ease: "power3.inOut" }, 0)
        .to(lines, { yPercent: 0, "--wdth": 125, duration: 1.25, ease: "expo.out", stagger: 0.09 }, first ? 0.75 : 0.1)
        .to(stroke, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, ">-0.6")
        .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, "<-0.4")
        .add(() => {
          // The frame mounts after this effect, so reveal it by lookup at play time.
          root.classList.remove("frame-pre");
          const inner = document.querySelector(".mframe__inner");
          if (inner) gsap.fromTo(inner, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
        }, "<-0.2");

      const loader = document.querySelector<HTMLElement>(".loader");
      if (first && loader) {
        const count = loader.querySelector<HTMLElement>("[data-loader-count]");
        const bar = loader.querySelector<HTMLElement>("[data-loader-bar]");
        const ready = { fonts: false };
        document.fonts?.ready.then(() => (ready.fonts = true));
        const shown = { v: 0 };
        let done = false;
        const started = performance.now();
        const exit = () => {
          if (done) return;
          done = true;
          try { sessionStorage.setItem("tc-intro", "1"); } catch { /* storage may be blocked */ }
          gsap.to(loader, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.8,
            ease: "expo.inOut",
            onComplete: () => root.classList.remove("intro"),
          });
          intro.play(0);
        };
        const step = () => {
          // Real readiness: fonts + field initialised. No minimum time.
          const target = 20 + (ready.fonts ? 45 : 0) + (field || root.classList.contains("no-webgl") ? 35 : 0);
          shown.v += (target - shown.v) * 0.25;
          const v = Math.min(100, Math.round(shown.v));
          if (count) count.textContent = String(v).padStart(3, "0");
          if (bar) bar.style.transform = `scaleX(${v / 100})`;
          if (v >= 99 || performance.now() - started > 2400) {
            gsap.ticker.remove(step);
            exit();
          }
        };
        gsap.ticker.add(step);
      } else {
        root.classList.remove("intro");
        intro.play(0);
      }
      void hero;

      const mm = gsap.matchMedia();

      // ---------- SM2 Frame takeover (desktop + mobile variants) ----------
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (c) => {
        const isDesk = Boolean(c.conditions?.desktop);
        const slot = document.querySelector<SlotEl>(".slot--offer");
        const copy = document.querySelector<HTMLElement>(".offer-copy");
        const items = gsap.utils.toArray<HTMLElement>(".s-offer .svc");
        const meter = document.querySelector<HTMLElement>(".svc-meter span");
        if (!slot || !copy) return;
        const area = () => {
          const vw = window.innerWidth, vh = window.innerHeight;
          return isDesk ? { x: vw * 0.47, y: vh * 0.13, w: vw * 0.49, h: vh * 0.76 } : { x: vw * 0.05, y: vh * 0.11, w: vw * 0.9, h: vh * 0.42 };
        };
        const geo = (k: number) => () => fitInto(area(), aspectOf(OFFER_STATES[k], isDesk));
        const full = { left: () => window.innerWidth * 0.02, top: () => window.innerHeight * 0.08, width: () => window.innerWidth * 0.96, height: () => window.innerHeight * 0.88 };
        const proxy = { pos: 0 };
        let activeIdx = -1;
        const setActive = () => {
          slot.__statePos = proxy.pos;
          const idx = Math.round(proxy.pos);
          if (idx !== activeIdx) {
            activeIdx = idx;
            items.forEach((el, i) => el.classList.toggle("is-active", i === idx));
          }
          if (meter) meter.style.transform = `scaleY(${(proxy.pos / 3).toFixed(4)})`;
        };
        setActive();
        const g0 = geo(0);
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: ".s-offer", start: "top top", end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true },
        });
        // Takeover: the frame holds full-bleed for a beat, then yields the left column to the copy.
        tl.set(slot, full, 0)
          .to({}, { duration: 0.6 })
          .to(slot, { left: () => g0().left, top: () => g0().top, width: () => g0().width, height: () => g0().height, duration: 1.2 })
          .fromTo(copy, { autoAlpha: 0, x: isDesk ? -48 : 0, y: isDesk ? 0 : 30 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.6 }, "-=0.55");
        for (let k = 1; k < 4; k++) {
          const gk = geo(k);
          tl.to(proxy, { pos: k, duration: 1, ease: "power1.inOut", onUpdate: setActive }, "+=0.55").to(
            slot,
            { left: () => gk().left, top: () => gk().top, width: () => gk().width, height: () => gk().height, duration: 1 },
            "<",
          );
        }
        tl.to({}, { duration: 0.5 });
        return () => {
          slot.__statePos = 0;
          gsap.set([slot, copy], { clearProps: "all" });
        };
      });

      // ---------- SM3 (part A): concept site scrolls inside the frame ----------
      mm.add(MQ.any, () => {
        const slot = document.querySelector<SlotEl>(".slot--web");
        if (!slot) return;
        const p = { v: 0 };
        gsap.to(p, {
          v: 1,
          ease: "none",
          onUpdate: () => (slot.__inner = p.v),
          scrollTrigger: { trigger: ".s-websites .stage-wrap", start: "top top", end: "bottom bottom", scrub: 0.5 },
        });
      });

      // ---------- SM4 (part 1): giant counts + horizontal film strip ----------
      gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((el) => {
        const v = el.querySelector("[data-stat-value]");
        const label = el.querySelector(".stat-label");
        gsap.fromTo(v, { yPercent: 35, "--wdth": 68 }, { yPercent: -25, "--wdth": 125, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } });
        gsap.fromTo(label, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 75%", end: "top 35%", scrub: 0.4 } });
      });
      mm.add(MQ.desktop, () => {
        const stage = document.querySelector<HTMLElement>("[data-strip-stage]");
        const strip = document.querySelector<HTMLElement>("[data-strip]");
        if (!stage || !strip) return;
        const dist = () => Math.max(0, strip.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
        stage.style.height = `${dist() + window.innerHeight}px`;
        const tw = gsap.to(strip, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dist()}`, scrub: 0.5, invalidateOnRefresh: true, onRefresh: () => (stage.style.height = `${dist() + window.innerHeight}px`) },
        });
        return () => {
          tw.scrollTrigger?.kill();
          stage.style.height = "";
          gsap.set(strip, { clearProps: "transform" });
        };
      });

      // ---------- Supporting: block-wipe headline reveals ----------
      gsap.utils.toArray<HTMLElement>(".hl[data-reveal]:not(.hl--hero)").forEach((hl) => {
        const ins = hl.querySelectorAll<HTMLElement>(".hl-in");
        const bws = hl.querySelectorAll<HTMLElement>(".bw");
        const st = hl.querySelector(".stroke path");
        gsap.set(ins, { autoAlpha: 0 });
        gsap.set(bws, { scaleX: 0, transformOrigin: "left center" });
        if (st) gsap.set(st, { drawSVG: "0%" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: hl, start: "top 82%", once: true } });
        tl.to(bws, { scaleX: 1, duration: 0.45, ease: "expo.in", stagger: 0.08 })
          .set(ins, { autoAlpha: 1 })
          .set(bws, { transformOrigin: "right center" })
          .to(bws, { scaleX: 0, duration: 0.55, ease: "expo.out", stagger: 0.08 });
        if (st) tl.to(st, { drawSVG: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.3");
      });

      // ---------- Utility: header hides on scroll down (desktop) ----------
      mm.add(MQ.desktop, () => {
        const h = document.querySelector<HTMLElement>("[data-header]");
        if (!h) return;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => h.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 240 && !root.classList.contains("menu-open")),
        });
        return () => h.classList.remove("is-hidden");
      });
    });

    // Re-measure after fonts settle (headline metrics change).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      field?.destroy();
      frameStore.set({ live: false });
      root.classList.remove("motion", "frame-pre");
    };
  }, []);

  return null;
}
