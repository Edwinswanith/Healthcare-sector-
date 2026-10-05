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
| landonorris.com/on-track | **partial** | HTML loads (200, 290 KB). All assets denied: cdn.prod.website-files.com, lando.itsoffbrand.io, assets.itsoffbrand.io, d3e54v103j8qbb.cloudfront.net (plus analytics/consent hosts). Page renders unstyled with no scripts. |
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
| Motion ambition | cinematic, scroll-driven | confirmed |
| Preserve source section order | yes | confirmed |
| Builder skill | tech-cogniverse-healthcare-motion | confirmed (override) |
| Public brand name | - | unresolved (pending source read) |
| Enquiry destination | - | unresolved |
| Generation budget | - | unresolved |
| How source content reaches this session | - | **blocking** |

## Current milestone

A (preflight). Blocked on reference access. No scaffolding, no paid generation.

Browser TLS note: Playwright Chromium needs `--ignore-certificate-errors-spki-list=<SPKI of /root/.ccr/agent-proxy-ca.crt>` to trust the session proxy CA. This pins trust to that one CA; it does not disable verification.
