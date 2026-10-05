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
| Public brand | Plainsight Medical, a studio of CogniVerse | proposed (retain) |
| Enquiry mechanism | mailto composer to raghul@cogniversetech.com, nothing stored (as source) | proposed (retain) |
| Route scope v1 | Home + /contact/ rebuilt; other nav targets link to the live Plainsight pages until rebuilt | proposed |
| Media reuse | Plainsight's own films, posters, shorts, captures, body.bin | proposed, needs owner confirmation |
| Visual direction | "One film, every frame" (STORYBOARD.md) | proposed |
| Generation budget | sample USD 10, total USD 40 ceiling, prices unverified | proposed |
| Rive | not used (no authoring tool); SVG + GSAP equivalents | proposed |

## Current milestone

B: storyboard, signature moments, asset plan, architecture written. Awaiting one approval. No scaffolding, no generation.
