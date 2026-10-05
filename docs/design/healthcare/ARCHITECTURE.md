# Technical architecture (PROPOSED)

- Next.js App Router + TypeScript, static export-capable. One CSS approach: CSS Modules + global tokens (`app/tokens.css`). pnpm.
- `gsap` (incl. ScrollTrigger, Flip, SplitText, DrawSVG; all free since GSAP 3.13) via `@gsap/react` `useGSAP` scoped to each scene ref. `three` only in a lazily imported `AnatomyField` client chunk. No Framer Motion, no R3F, no Rive.
- Lenis: not installed until the vertical slice proves it helps.

```
app/
  layout.tsx            fonts (next/font: Archivo, Fraunces, DM Mono), skip link, Header, metadata, JSON-LD Organization
  page.tsx              renders sections from content/sections.ts in locked order (server)
  contact/page.tsx      enquiry (mailto composer)
  sitemap.ts robots.ts
content/
  sections.ts           ordered array S00..S11 with typed content (from CONTENT_MAP)
  films.ts specialties.ts work.ts
components/
  scenes/<Scene>.tsx    one per section: server markup + client motion island
  motion/               Stage (sticky), MediaFrame, useScene (timeline + ScrollTrigger + cleanup + matchMedia breakpoints + reduced motion), SignoffStroke, BlockWipe, FrameSequence (canvas, bounded buffer)
  field/AnatomyField    Three.js points, single fixed canvas, visibility/IntersectionObserver pause
  ui/                   Button, Menu (dialog), Picker (tablist), VideoPlayer (captions, controls)
lib/motion/tokens.ts    durations, eases, stage lengths per breakpoint
public/media/           approved, optimised assets only
scripts/media/          generation + ffmpeg scripts (server-side, env credentials)
tests/                  Playwright: order, links, menu a11y, reduced motion, form, overflow
```

Scene contract: section container (server, content complete without JS) → `useScene` creates a `gsap.context`, registers its ScrollTriggers under `gsap.matchMedia()` for desktop / mobile / reduced-motion, owns its media controller (play/pause on visibility), reverts everything on unmount or breakpoint change. The Media Frame is owned by one controller; scenes request hand-offs, they never animate it directly. One owner per animated property.
