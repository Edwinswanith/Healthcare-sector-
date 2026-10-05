// Hero capture: node tests/hero-shots.mjs <outdir>. Desktop 1920/1440 + mobile, mouse reveal + scroll states.
import { chromium } from "playwright-core";
import fs from "fs";
const out = process.argv[2] ?? "/tmp/hero";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const errors = [];
for (const [name, vp, mobile] of [["d1920", { width: 1920, height: 1080 }, false], ["d1440", { width: 1440, height: 900 }, false], ["m390", { width: 390, height: 844 }, true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("tc-intro", "1"); } catch {} });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  p.on("console", (m) => { if (m.type() === "error") errors.push(`${name}: ${m.text()}`); });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${out}/${name}-0rest.jpg`, quality: 75 });
  if (!mobile) {
    const cx = vp.width / 2;
    for (let k = 0; k <= 30; k++) { await p.mouse.move(cx - 260 + k * 18, vp.height * (0.3 + 0.02 * k)); await p.waitForTimeout(25); }
    await p.waitForTimeout(150);
    await p.screenshot({ path: `${out}/${name}-1hover.jpg`, quality: 75 });
  }
  const H = vp.height;
  for (const [f, tag] of [[0.35, "2scroll35"], [0.8, "3scroll80"], [1.35, "4after"]]) {
    await p.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)), Math.round(H * f));
    await p.waitForTimeout(1300);
    await p.screenshot({ path: `${out}/${name}-${tag}.jpg`, quality: 75 });
  }
  await ctx.close();
}
await b.close();
console.log(errors.length ? errors.join("\n") : "no errors");
