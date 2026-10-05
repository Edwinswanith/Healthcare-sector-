// Visual capture of the vertical slice. Usage: node tests/capture.mjs <desktop|mobile|reduced> <outdir>
import { chromium } from "playwright-core";
import fs from "fs";
const mode = process.argv[2] ?? "desktop";
const out = process.argv[3] ?? "docs/design/healthcare/evidence/build/slice";
fs.mkdirSync(`${out}/${mode}`, { recursive: true });
const mobile = mode === "mobile";
const vp = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: mode === "reduced" ? "reduce" : "no-preference", recordVideo: mode === "desktop" ? { dir: `${out}/video-raw`, size: vp } : undefined });
const p = await ctx.newPage();
const errors = [];
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
const log = [];
const T0 = Date.now();
const shot = async (n, note = "") => {
  const y = await p.evaluate(() => Math.round(scrollY));
  await p.screenshot({ path: `${out}/${mode}/${n}.jpg`, type: "jpeg", quality: 72 });
  log.push({ n, y, t: Date.now() - T0, note });
};
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
for (const t of [120, 450, 900, 1500, 2300, 3200, 4500]) { const w = t - (Date.now() - T0); if (w > 0) await p.waitForTimeout(w); await shot(`intro-${String(t).padStart(4, "0")}`, "ms after navigation"); }
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
log.push({ docHeight: H, classes: await p.evaluate(() => document.documentElement.className) });
// Scroll in viewport-fraction steps to the films strip end, wheel input.
const step = Math.round(vp.height * 0.33);
const sel = ["#hero", "#offer", "#websites", "#films", "#presenter"];
const stopAt = await p.evaluate(() => { const e = document.querySelector("#presenter"); return e ? e.getBoundingClientRect().top + scrollY + innerHeight * 0.6 : document.documentElement.scrollHeight; });
let i = 0;
while ((await p.evaluate(() => scrollY)) < stopAt && i < 140) {
  i++;
  if (mobile) await p.evaluate((d) => scrollBy(0, d), step); else await p.mouse.wheel(0, step);
  await p.waitForTimeout(mobile ? 450 : 650);
  await shot(`s-${String(i).padStart(3, "0")}`);
}
// Reverse a little through the offer stage.
const offerTop = await p.evaluate(() => document.querySelector("#offer").getBoundingClientRect().top + scrollY);
for (const f of [0.75, 0.45, 0.15]) { await p.evaluate(([t, f, h]) => scrollTo(0, t + (document.querySelector("#offer").offsetHeight - h) * f), [offerTop, f, vp.height]); await p.waitForTimeout(900); await shot(`rev-offer-${f}`, "reverse jump into offer stage"); }
// Picker interaction (desktop + reduced)
if (!mobile) {
  await p.evaluate(() => document.querySelector("#websites").scrollIntoView());
  await p.evaluate(() => scrollBy(0, innerHeight * 0.4));
  await p.waitForTimeout(900);
  await shot("picker-before");
  await p.click("#tab-neurology");
  await p.waitForTimeout(240); await shot("picker-mid", "240ms after click");
  await p.waitForTimeout(900); await shot("picker-after");
  await p.keyboard.press("ArrowRight"); await p.waitForTimeout(1100); await shot("picker-key-right", "ArrowRight from Neurology");
  // film hover
  const film = await p.$(".film:nth-child(3) a");
  if (film) { await p.evaluate(() => document.querySelector("[data-strip-stage]").scrollIntoView()); await p.evaluate(() => scrollBy(0, innerHeight * 0.3)); await p.waitForTimeout(800); const bb = await film.boundingBox(); if (bb) { await p.mouse.move(bb.x + bb.width / 2, bb.y + 60); await p.waitForTimeout(1200); await shot("film-hover"); } }
  // menu
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900);
  await p.click(".menu-btn"); await p.waitForTimeout(250); await shot("menu-open-250"); await p.waitForTimeout(700); await shot("menu-open");
  log.push({ menuFocus: await p.evaluate(() => document.activeElement?.textContent) });
  await p.keyboard.press("Escape"); await p.waitForTimeout(400);
  log.push({ afterEscape: await p.evaluate(() => ({ hidden: document.getElementById("site-menu").hidden, focus: document.activeElement?.className })) });
}
log.push({ errors });
fs.writeFileSync(`${out}/${mode}/log.json`, JSON.stringify(log, null, 1));
await ctx.close();
await b.close();
console.log(mode, "frames:", fs.readdirSync(`${out}/${mode}`).length, "errors:", errors.length, errors.slice(0, 5));
