# Preflight and decision state

Checked: 2026-10-05, cloud session, branch `claude/admiring-darwin-m2s4u3`.

## Environment

| Dependency | Status | Observation |
|---|---|---|
| Skill: bizzzup-website-micro-qa | available | Loaded via Skill tool; handoff overridden to tech-cogniverse-healthcare-motion. |
| Skill: tech-cogniverse-healthcare-motion | available | Loaded; read project-brief, reference-audit, browser-audit, sources.json. |
| Repository | available | Empty repo, no commits, no existing app. New Next.js build is appropriate. |
| Runtime | available | Node 22.22.0, npm 10.9.4, pnpm 10.28.0. |
| Browser | available | Playwright Chromium at /opt/pw-browsers. Usable for local preview QA. |
| FFmpeg | available | /usr/bin/ffmpeg. |
| landonorris.com/on-track | available | Renders fully, loader to footer (desktop 1440x900). Required hosts: cdn.prod.website-files.com, lando.itsoffbrand.io, assets.itsoffbrand.io, d3e54v103j8qbb.cloudfront.net, unpkg.com (Rive WASM; cdn.jsdelivr.net is its unused fallback). Only analytics hosts fail, intentionally not allowed. |
| plainsight-medical.vercel.app | available | HTML, CSS, JS, 43 images, fonts and media all served same-origin (40 requests, 0 failures). Headless Chromium cannot decode its H.264 MP4s (codec limit, not network). |
| Gemini image | available (cost unverified) | Model list call succeeded: gemini-3-pro-image, gemini-3.1-flash-image, gemini-2.5-flash-image and others. No generation run. |
| Veo | available (cost unverified) | veo-3.1-generate-preview, veo-3.1-fast-generate-preview, veo-3.1-lite-generate-preview listed. No generation run. |
| Higgsfield | connected, **0 credits** | MCP balance: credits 0, plan free. Cannot generate without top-up. |
| Deployment target | none configured | No deployment config in repo. |

## Decisions

| Decision | Value | Status |
|---|---|---|
| Design reference | https://landonorris.com/on-track | confirmed |
| Content and order reference | https://plainsight-medical.vercel.app/ | confirmed |
| Motion ambition | cinematic, scroll-driven, On Track level | confirmed |
| Preserve source section order | yes, S00-S11 (CONTENT_MAP.md) | confirmed |
| Builder skill | tech-cogniverse-healthcare-motion | confirmed (override) |
| Market | UK private practice (source JSON-LD areaServed GB) | source-confirmed |
| Public brand | Plainsight is the content/structure reference only; new site represents broader healthcare capability | **unresolved, asking** |
| Enquiry mechanism | Swappable submission adapter; mailto composer as the safe fallback until a real destination is confirmed; never a fake success | confirmed |
| Route scope v1 | Home + /contact/. Other nav targets: only to approved pages that still fit the final brand; no broken links | confirmed |
| Media reuse | Only assets with confirmed reuse; explicit per-asset permission status; unconfirmed = labelled placeholder or original concept, section kept in place | confirmed rule |
| Visual direction | "One film, every frame" (STORYBOARD.md), 5 signature moments, visually aggressive | confirmed |
| Loader | No minimum duration; enter as soon as ready; full assembly first visit only, repeat visits skip; enhancements activate progressively | confirmed |
| Generation budget | sample USD 10, total USD 40 ceiling; generate only where it materially improves a scene; show batch, reason, cost, attempts before each paid batch | confirmed |
| Rive / 3D tooling | No Rive runtime. Match the experience with Three.js (field), canvas, GSAP, sticky, masks, frame sequences | confirmed |

## Current milestone

B approved with adjustments (2026-10-05). Blocked only on the public brand name. Next: vertical slice (nav, preloader/hero SM1, SM2, one content section, one media/portfolio interaction).
