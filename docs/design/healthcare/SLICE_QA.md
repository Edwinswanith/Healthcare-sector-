# Vertical slice QA (2026-10-05)

Build: Next.js 16.3.8 production build (`pnpm build && pnpm start`), localhost.
Browser: Playwright Chromium 1194 headless, **software WebGL (SwiftShader)**, DPR 1. Desktop 1440x900 (recording 1280x800), mobile emulation 390x844 (`isMobile`, `hasTouch`), reduced motion via `reducedMotion: "reduce"`.
Not available here: Firefox, WebKit/Safari, physical iOS/Android devices, a real GPU.

## Scope of the slice
| Storyboard item | Status |
|---|---|
| Full static structure S00-S11, locked order, real copy | built |
| Navigation, skip link, menu dialog, Enquire route | built |
| SM1 Assembly: loader (no minimum time, first visit only) → field assembles → hero type width-axis set → sign-off stroke → frame reveal | built |
| SM2 Frame takeover: full-bleed hold → stage → browser / film / presenter / short with aspect morph and block wipes | built |
| Persistent Media Frame across hero → offer → websites → films → presenter → social → work slots | built (later slots static content, frame travels to them) |
| SM3 part A: specialty picker swaps concept site (flash wipe), concept page scrolls inside the frame | built |
| SM3 part B: GEO answer choreography | static layout only |
| SM4 part 1: giant 16 / 75 / ANY counts with width-axis scrub, horizontal film strip, hover/focus preview | built |
| SM4 part 2 (16:9 → 9:16 reframe, shorts fan), SM5 (sign-off + footer finale), supporting motion for Presenter/Work/Packages | not built yet |
| Lenis | not installed, not evaluated yet |
| Generated media | none, USD 0 spent |

## Automated checks
| Check | Result | Evidence |
|---|---|---|
| `pnpm typecheck` | pass | - |
| `pnpm lint` | pass (0 warnings) | - |
| `pnpm build` | pass | - |
| `node tests/e2e.mjs` | **22/22 pass** | order desktop+mobile, ids once, no overflow (top and while scrolling, both viewports), no console errors, 35 links/anchors resolve, reduced motion (no live frame, no loader, static frames, short stage), menu focus/Escape/return, skip link first, contact errors + honest "Nothing was sent", ScrollTrigger count stable 19 → 19 across 4 breakpoint flips |

## Visual / motion review (stepped captures)
Evidence: `evidence/build/slice/{desktop,mobile,reduced}/` (frames + `log.json` with scroll Y and timestamps), `evidence/build/slice/*.mp4` (continuous recordings).

Fixed during review: transparent header overlapping content (added translucent backdrop), frame geometry never written (NaN cache), frame entrance target missing, field too faint, hero taller than viewport, takeover too brief, offer headline wrapping, presenter crop in 9:16, frame crossing copy during long slot gaps, header unreadable on ink in reduced motion, strip overflow without motion, mobile 20 px overflow (eyebrow, headline minimum size, header grid).

Known weaknesses still open:
- Film-card and concept-site organ studies are small and pale on light palettes.
- Offer stage on mobile shows only the active service; the others are visually hidden but remain in the DOM (screen readers get all four).
- Timings are tuned by eye in a software-rendered browser; they need a pass on real hardware.

## Not tested (honest list)
- Real frame rate, CPU/GPU cost, LCP/INP/CLS: software rendering makes numbers meaningless here.
- Safari/WebKit and Firefox; physical touch devices; orientation change on a device.
- Anchor jumps into pinned stages from the nav while mid-stage (functional link check passes; visual landing state not reviewed).
- Slow network / failed asset behaviour (the slice has no external media yet).
- Screen reader pass (structure and labels checked in code only).
