// Functional QA against a running production server (default http://localhost:3000).
// Usage: node tests/e2e.mjs [baseUrl]
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3000";
const ORDER = ["header", "preloader", "hero", "offer", "websites", "films", "presenter", "social", "work", "process", "packages", "footer"];
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

async function page(opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return { ctx, p, errors };
}

// 1. Locked order, desktop and mobile.
for (const [label, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const { ctx, p, errors } = await page({ viewport: vp, isMobile: label === "mobile", hasTouch: label === "mobile" });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3500);
  const order = await p.evaluate(() => {
    const els = [document.querySelector(".hdr"), document.querySelector("#preloader"), ...document.querySelectorAll("main > section, body > footer")];
    return els.map((e) => (e?.classList.contains("hdr") ? "header" : e?.id));
  });
  check(`order (${label})`, JSON.stringify(order) === JSON.stringify(ORDER), order.join(","));
  const once = await p.evaluate((ids) => ids.slice(2).every((id) => document.querySelectorAll(`#${id}`).length === 1), ORDER);
  check(`each section id once (${label})`, once);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`no horizontal overflow at top (${label})`, overflow <= 0, `${overflow}px`);
  // scroll through and re-check overflow
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  let worst = 0;
  for (let y = 0; y < h; y += vp.height) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(60);
    worst = Math.max(worst, await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  check(`no horizontal overflow while scrolling (${label})`, worst <= 0, `${worst}px`);
  check(`no console errors (${label})`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// 2. Links: internal paths return 200, anchors exist.
{
  const { ctx, p } = await page();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const links = await p.evaluate(() => [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))]);
  const bad = [];
  for (const href of links) {
    if (href.startsWith("mailto:") || href.startsWith("http")) continue;
    const [path, hash] = href.split("#");
    if (path && path !== "/") {
      const r = await ctx.request.get(BASE + path);
      if (r.status() !== 200) bad.push(`${href} -> ${r.status()}`);
    }
    if (hash && !(await p.evaluate((h) => !!document.getElementById(h), hash))) bad.push(`${href} -> missing #${hash}`);
  }
  check("all internal links and anchors resolve", bad.length === 0, bad.join(", ") || `${links.length} links`);
  await ctx.close();
}

// 3. Reduced motion: no live frame, static frames and hero text visible.
{
  const { ctx, p, errors } = await page({ reducedMotion: "reduce" });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({
    frame: !!document.querySelector(".mframe"),
    cls: document.documentElement.className,
    heroVisible: getComputedStyle(document.querySelector(".hl--hero .hl-in")).visibility,
    staticVisible: getComputedStyle(document.querySelector(".slot--offer .fstatic")).visibility,
    loader: getComputedStyle(document.querySelector("#preloader")).display,
    offerHeight: document.querySelector("#offer").offsetHeight,
  }));
  check("reduced motion: no live frame", !r.frame, JSON.stringify(r));
  check("reduced motion: hero text visible, no loader", r.heroVisible === "visible" && r.loader === "none");
  check("reduced motion: static frames visible", r.staticVisible === "visible");
  check("reduced motion: no long pinned stage", r.offerHeight < 1800, `${r.offerHeight}px`);
  check("reduced motion: no console errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 4. Menu dialog: focus in, Escape closes, focus returns.
{
  const { ctx, p } = await page();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  await p.click(".menu-btn");
  await p.waitForTimeout(300);
  const inMenu = await p.evaluate(() => !!document.activeElement?.closest("#site-menu"));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  const after = await p.evaluate(() => ({ hidden: document.getElementById("site-menu").hidden, focusBtn: document.activeElement?.classList.contains("menu-btn") }));
  check("menu: focus moves into dialog", inMenu);
  check("menu: Escape closes and returns focus", after.hidden && after.focusBtn, JSON.stringify(after));
  await ctx.close();
}

// 5. Skip link targets main.
{
  const { ctx, p } = await page();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  const first = await p.evaluate(() => document.activeElement?.textContent);
  check("first Tab reaches skip link", first === "Skip to content", first);
  await ctx.close();
}

// 6. Contact form honesty without a configured destination.
{
  const { ctx, p } = await page();
  await p.goto(BASE + "/contact/", { waitUntil: "networkidle" });
  await p.click("button[type=submit]");
  const err = await p.evaluate(() => ({ focus: document.activeElement?.id, errs: document.querySelectorAll(".err").length }));
  check("contact: empty submit shows errors and focuses first field", err.focus === "f-name" && err.errs >= 2, JSON.stringify(err));
  await p.fill("#f-name", "QA Synthetic");
  await p.fill("#f-email", "qa@example.com");
  await p.click("button[type=submit]");
  await p.waitForTimeout(300);
  const status = await p.textContent(".enq-status");
  check("contact: unconfigured destination reports nothing sent (no fake success)", /Nothing was sent/.test(status ?? "") && !/received/.test(status ?? ""), status ?? "");
  await ctx.close();
}

// 7. Trigger leak check across breakpoint flips.
{
  const { ctx, p } = await page();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  const before = await p.evaluate(() => window.__tcTriggers?.());
  for (const w of [800, 1440, 700, 1440]) {
    await p.setViewportSize({ width: w, height: 900 });
    await p.waitForTimeout(600);
  }
  const after = await p.evaluate(() => window.__tcTriggers?.());
  check("no ScrollTrigger leak after 4 breakpoint flips", before === after, `${before} -> ${after}`);
  await ctx.close();
}

await b.close();
const pass = results.filter((r) => r.ok).length;
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
console.log(`\n${pass}/${results.length} passed`);
process.exit(pass === results.length ? 0 : 1);
