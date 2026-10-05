// Continuous-scroll motion recording (headless Chromium, software WebGL).
// Usage: node tests/record.mjs <outfile.webm-dir> [width] [height]
import { chromium } from "playwright-core";
const dir = process.argv[2] ?? "/tmp/claude-0/rec";
const width = Number(process.argv[3] ?? 1280), height = Number(process.argv[4] ?? 800);
const mobile = width < 600;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, recordVideo: { dir, size: { width, height } } });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
await p.waitForTimeout(5500);
const end = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight - 4);
// Steady scroll: ~1 viewport every 2.5 s of wall clock.
while ((await p.evaluate(() => scrollY)) < end) {
  if (mobile) await p.evaluate(() => scrollBy(0, 60)); else await p.mouse.wheel(0, 60);
  await p.waitForTimeout(100);
}
await p.waitForTimeout(800);
// Reverse back up through the offer stage.
const offer = await p.evaluate(() => document.querySelector("#offer").getBoundingClientRect().top + scrollY);
while ((await p.evaluate(() => scrollY)) > offer) {
  if (mobile) await p.evaluate(() => scrollBy(0, -120)); else await p.mouse.wheel(0, -120);
  await p.waitForTimeout(100);
}
await p.waitForTimeout(800);
await ctx.close();
await b.close();
console.log("recorded to", dir);
