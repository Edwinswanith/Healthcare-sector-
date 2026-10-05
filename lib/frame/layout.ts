import type { FrameState } from "@/content/site";

// Each layer is designed at a fixed size and scaled to "cover" the frame, so
// the composition stays exact while the frame changes aspect ratio.
export const LAYER_SIZE: Record<FrameState, [number, number]> = {
  browser: [1280, 800],
  film: [1280, 720],
  presenter: [1280, 720],
  short: [540, 960],
  answer: [960, 720],
  portfolio: [1280, 800],
};

export const TAB_LABEL: Record<FrameState, string> = {
  browser: "Website · concept",
  film: "Patient film · 03:00",
  presenter: "AI presenter · with consent",
  short: "Short · 9:16 · 00:35",
  answer: "Assistant answer · illustration",
  portfolio: "Case study · pending approval",
};

