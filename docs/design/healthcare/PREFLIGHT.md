# Preflight and decision state

Checked: 2026-10-05, cloud session, branch `claude/admiring-darwin-m2s4u3`.

## Environment

| Dependency | Status | Observation |
|---|---|---|
| Skill: bizzzup-website-micro-qa | available | Loaded via Skill tool; handoff overridden to tech-cogniverse-healthcare-motion. |
| Skill: tech-cogniverse-healthcare-motion | available | Loaded; read project-brief, reference-audit, browser-audit, sources.json. |
| Repository | available | Empty repo, no commits, no existing app. New Next.js build is appropriate. |
| Runtime | available | Node 22.22.0, npm 10.9.4, pnpm 10.28.0. |
| Browser | available (local only) | Playwright Chromium at /opt/pw-browsers. Usable for local preview QA. |
| FFmpeg | available | /usr/bin/ffmpeg. |
| landonorris.com/on-track | **blocked** | Egress proxy returns 403 on CONNECT (curl and WebFetch). |
| plainsight-medical.vercel.app | **blocked** | Egress proxy returns 403 on CONNECT (curl and WebFetch). |
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
