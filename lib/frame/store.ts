"use client";

import { useSyncExternalStore } from "react";
import type { FrameState } from "@/content/site";

// Discrete Media Frame state shared by the frame, its controller and the
// specialty picker. Continuous values (geometry, wipe) never go through React.
export type FrameStore = {
  state: FrameState;
  variant: string;
  specialty: string;
  live: boolean;
};

let value: FrameStore = { state: "browser", variant: "procedure", specialty: "cardiology", live: false };
const listeners = new Set<() => void>();

export const frameStore = {
  get: () => value,
  set(patch: Partial<FrameStore>) {
    const next = { ...value, ...patch };
    if (next.state === value.state && next.variant === value.variant && next.specialty === value.specialty && next.live === value.live) return;
    value = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useFrameStore() {
  return useSyncExternalStore(frameStore.subscribe, frameStore.get, frameStore.get);
}
