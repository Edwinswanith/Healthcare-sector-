import type { FrameState } from "@/content/site";
import { LAYER_SIZE, TAB_LABEL } from "./layout";
import { frameStore } from "./store";

// The Media Frame is ONE fixed element. Sections declare "slots"
// (`data-frame-slot`) where it should sit; the controller reads the slots'
// live rectangles every tick and places the frame on the current slot, or
// part-way between two slots while one hands it to the next. Because the
// geometry comes from the slots, a scene animates the frame simply by
// animating its slot box (size, aspect, position).
//
// Per-slot runtime values (set by scene timelines, never by React):
//   el.__statePos  float index into data-frame-states (state morphs inside a slot)
//   el.__inner     0..1 inner page scroll for the browser layer

export type SlotEl = HTMLElement & { __statePos?: number; __inner?: number };

type Slot = { el: SlotEl; states: FrameState[]; variant: string; radius: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class FrameController {
  private slots: Slot[] = [];
  private layers = new Map<FrameState, HTMLElement>();
  private body: HTMLElement;
  private wipe: HTMLElement;
  private tab: HTMLElement;
  private prev = { x: -1e9, y: -1e9, w: -1e9, h: -1e9, r: -1e9, key: "", clip: "", inner: -1e9, opacity: -1 };

  constructor(private frame: HTMLElement) {
    this.body = frame.querySelector(".mframe__body")!;
    this.wipe = frame.querySelector(".mframe__wipe")!;
    this.tab = frame.querySelector(".mframe__tab-label")!;
    frame.querySelectorAll<HTMLElement>("[data-layer]").forEach((l) => this.layers.set(l.dataset.layer as FrameState, l));
    this.collect();
  }

  collect() {
    this.slots = Array.from(document.querySelectorAll<SlotEl>("[data-frame-slot]")).map((el) => ({
      el,
      states: (el.dataset.frameStates ?? el.dataset.frameSlot ?? "browser").split(",") as FrameState[],
      variant: el.dataset.frameVariant ?? "home",
      radius: Number(el.dataset.frameRadius ?? 14),
    }));
  }

  private stateAt(s: Slot): { a: FrameState; b: FrameState; f: number } {
    const p = clamp(s.el.__statePos ?? 0, 0, s.states.length - 1);
    const i = Math.floor(p);
    return { a: s.states[i], b: s.states[Math.min(s.states.length - 1, i + 1)], f: p - i };
  }

  update() {
    if (!this.slots.length) return;
    const vh = window.innerHeight;
    const rects = this.slots.map((s) => s.el.getBoundingClientRect());
    const arrival = (r: DOMRect) => {
      const rest = r.height >= vh ? 0 : (vh - r.height) / 2;
      return (vh - r.top) / Math.max(1, vh - rest);
    };
    let i = 0;
    for (let k = 1; k < rects.length; k++) if (arrival(rects[k]) >= 1) i = k;
    const j = Math.min(i + 1, rects.length - 1);
    const t = j === i ? 0 : clamp(arrival(rects[j]));
    const e = smooth(0.12, 0.92, t);
    // If the previous slot is already off-screen (a long gap between slots),
    // do not fly across the copy: ride in with the next slot instead.
    const A = rects[i].bottom < 0 && j !== i ? rects[j] : rects[i];
    const B = rects[j];
    const x = lerp(A.left, B.left, e);
    const y = lerp(A.top, B.top, e);
    const w = lerp(A.width, B.width, e);
    const h = lerp(A.height, B.height, e);
    const r = lerp(this.slots[i].radius, this.slots[j].radius, e);
    const inner = lerp(this.slots[i].el.__inner ?? 0, this.slots[j].el.__inner ?? 0, e);

    // Which two visual states are we between, and how far?
    const si = this.stateAt(this.slots[i]);
    const sj = this.stateAt(this.slots[j]);
    let from: FrameState, to: FrameState, fromV: string, toV: string, wp: number;
    if (j !== i && t > 0) {
      from = si.f < 0.5 ? si.a : si.b;
      to = sj.a;
      fromV = this.slots[i].variant;
      toV = this.slots[j].variant;
      wp = e;
    } else {
      from = si.a;
      to = si.b;
      fromV = toV = this.slots[i].variant;
      wp = si.f;
    }
    const showB = wp >= 0.5;
    const state = showB ? to : from;
    const variant = showB ? toV : fromV;
    const differs = from !== to || fromV !== toV;
    const g = smooth(0.28, 0.5, wp);
    const hcl = smooth(0.5, 0.72, wp);
    const clip = differs && g > 0 && hcl < 1 ? `inset(0 ${(100 - g * 100).toFixed(2)}% 0 ${(hcl * 100).toFixed(2)}%)` : "inset(0 100% 0 0)";

    const p = this.prev;
    if (Math.abs(p.x - x) > 0.1 || Math.abs(p.y - y) > 0.1) {
      this.frame.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      p.x = x;
      p.y = y;
    }
    if (Math.abs(p.w - w) > 0.1 || Math.abs(p.h - h) > 0.1) {
      this.frame.style.width = `${w.toFixed(2)}px`;
      this.frame.style.height = `${h.toFixed(2)}px`;
      p.w = w;
      p.h = h;
      this.layers.forEach((el, st) => {
        const [W, H] = LAYER_SIZE[st];
        const s = st === "browser" || st === "portfolio" ? Math.max(w / W, (h / H) * 0.55) : Math.max(w / W, h / H);
        el.style.setProperty("--s", s.toFixed(4));
      });
    }
    if (Math.abs(p.r - r) > 0.05) {
      this.frame.style.setProperty("--r", `${r.toFixed(1)}px`);
      p.r = r;
    }
    if (Math.abs(p.inner - inner) > 0.0005) {
      this.frame.style.setProperty("--inner", inner.toFixed(4));
      p.inner = inner;
    }
    if (clip !== p.clip) {
      this.wipe.style.clipPath = clip;
      p.clip = clip;
    }
    const key = `${state}|${variant}`;
    if (key !== p.key) {
      p.key = key;
      this.frame.dataset.show = state;
      this.tab.textContent = TAB_LABEL[state];
      frameStore.set({ state, variant });
    }
    // Hide while entirely off-screen to save compositing.
    const visible = y < vh && y + h > 0 ? 1 : 0;
    if (visible !== p.opacity) {
      this.frame.style.visibility = visible ? "visible" : "hidden";
      p.opacity = visible;
    }
  }
}
