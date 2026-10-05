# Tech Cogniverse: healthcare website

Marketing site for Tech Cogniverse's healthcare work: websites, patient-education films, AI-presenter content and social media for doctors, clinics and hospitals.

Design and decision records live in `docs/design/healthcare/` (start with `CHECKPOINT.md`).

## Stack
Next.js 16 (App Router) · TypeScript · GSAP 3.15 (ScrollTrigger, DrawSVG) · raw WebGL for the anatomy field · self-hosted fonts via Fontsource (Archivo variable, Fraunces italic, DM Mono). No CSS framework, no Three.js, no Lenis (not adopted; see docs).

## Commands
```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build && pnpm start
node tests/e2e.mjs  # functional QA against a running server (Playwright Chromium)
node tests/capture.mjs desktop|mobile|reduced   # screenshot/motion capture into docs evidence
```
The test scripts use the Chromium at `/opt/pw-browsers/chromium-1194`; change `executablePath` in `tests/*.mjs` for another machine.

## Environment
Copy `.env.example` to `.env.local`.
- `NEXT_PUBLIC_SITE_URL`: canonical origin. Defaults to `http://localhost:3000`.
- `NEXT_PUBLIC_ALLOW_INDEXING`: only `true` on production. Otherwise every page is `noindex` and robots.txt disallows all.
- `NEXT_PUBLIC_ENQUIRY_EMAIL`: confirmed enquiry address. Empty means the form validates but honestly reports that nothing was sent.
- `GEMINI_API_KEY`: server-side media scripts only; never used by the site.

## Where things live
- `content/site.ts`: all copy, in the locked section order S00-S11. `pendingClaims` lists statements the owner must confirm before production.
- `components/sections/*`: server-rendered sections (complete without JavaScript).
- `components/motion/Choreography.tsx`: every scroll timeline (one owner).
- `lib/frame/*` + `components/frame/*`: the persistent Media Frame. Sections declare `data-frame-slot`; the controller carries one fixed frame between slots.
- `lib/field/*`: procedural anatomy point clouds and the WebGL renderer.
- `lib/enquiry/adapter.ts`: swappable enquiry destination.
- `lib/motion/tokens.ts`: breakpoints, stage geometry, field placement.

## Updating content and media
Edit `content/site.ts`; order changes need explicit approval (see `docs/design/healthcare/CONTENT_MAP.md`). Real client media may only be added once its row in `docs/design/healthcare/ASSET_MANIFEST.md` says permission is confirmed.

## Deployment
Not deployed. Deployment is a separate, explicitly authorised step: set the env vars above on the host, build with `pnpm build`, run `pnpm start` (or deploy to a Next.js host).
