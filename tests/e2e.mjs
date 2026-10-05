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
  await p.goto(BASE + "/contact", { waitUntil: "networkidle" });
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

// 8. Interaction layer: Lenis, anchors, route transition, cursor image, menu grid, counters.
{
  const { ctx, p, errors } = await page();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3500);
  const lenisOn = await p.evaluate(() => document.documentElement.classList.contains("lenis-on") && !!window.__lenis);
  check("Lenis smooth scroll active (desktop)", lenisOn);
  await p.evaluate(() => document.querySelector('.hdr-nav a[href="/#films"]').click());
  await p.waitForTimeout(2500);
  const filmsTop = await p.evaluate(() => Math.round(document.querySelector("#films").getBoundingClientRect().top));
  check("nav anchor glides to its section", Math.abs(filmsTop) < 120, `#films top ${filmsTop}px`);
  // cursor image over a service row
  await p.evaluate(() => scrollTo(0, document.querySelector("#offer").offsetTop + innerHeight * 1.2));
  await p.waitForTimeout(1500);
  const svc = await p.$(".svc.is-active .svc-title");
  if (svc) { const bb = await svc.boundingBox(); await p.mouse.move(bb.x + 20, bb.y + bb.height / 2, { steps: 6 }); await p.waitForTimeout(700); }
  const cur = await p.evaluate(() => { const c = document.querySelector(".cursor-img"); return { op: getComputedStyle(c).opacity, src: c.querySelector("img").getAttribute("src") }; });
  check("cursor image appears over a service row", Number(cur.op) > 0.5 && /g-/.test(cur.src ?? ""), JSON.stringify(cur));
  await p.mouse.move(5, 5);
  // counters
  await p.evaluate(() => document.querySelector("[data-stat]").scrollIntoView());
  await p.waitForTimeout(400);
  await p.evaluate(() => scrollBy(0, 1));
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelectorAll("[data-stat]")[2].scrollIntoView());
  await p.waitForTimeout(2500);
  const stats = await p.evaluate(() => [...document.querySelectorAll("[data-stat-value]")].map((e) => e.textContent));
  check("counters settle on their real values", JSON.stringify(stats) === JSON.stringify(["16", "75", "ANY"]), stats.join(","));
  // menu image grid
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(800);
  await p.click(".menu-btn");
  await p.waitForTimeout(900);
  const link = await p.$(".menu-list li:nth-child(2) a");
  const lb = await link.boundingBox();
  await p.mouse.move(lb.x + 40, lb.y + lb.height / 2, { steps: 5 });
  await p.waitForTimeout(500);
  const hot = await p.evaluate(() => [...document.querySelectorAll(".menu-img")].map((m) => m.className.includes("is-hot")));
  check("menu link hover lights its grid image", hot.filter(Boolean).length === 1, JSON.stringify(hot));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  // route transition
  await p.click(".hdr-cta");
  await p.waitForURL("**/contact", { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1600);
  const rt = await p.evaluate(() => ({ path: location.pathname, cover: getComputedStyle(document.querySelector(".route-cover")).visibility }));
  check("route transition reaches /contact and clears the cover", rt.path === "/contact" && rt.cover === "hidden", JSON.stringify(rt));
  check("interaction layer: no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await b.close();
const pass = results.filter((r) => r.ok).length;
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
console.log(`\n${pass}/${results.length} passed`);
process.exit(pass === results.length ? 0 : 1);
