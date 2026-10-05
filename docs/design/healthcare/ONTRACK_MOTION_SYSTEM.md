# On Track motion system (reverse-engineered)

Reference: https://landonorris.com/on-track. Inspected 2026-10-05.

## Test conditions (read before trusting anything)
- Browser: Playwright Chromium 1194 (headless), proxy CA pinned via SPKI. Desktop 1440x900 DPR1; mobile 390x844 DPR1 with `isMobile` + `hasTouch` (emulation, **not** a physical device).
- WebGL ran on software rendering (SwiftShader). Frames took seconds to draw, so **no timing from this session is a measurement**. Durations below are either absent or marked "estimate".
- Analytics hosts blocked deliberately; no effect on rendering.
- Evidence: `evidence/ontrack/desktop/` (137 frames: `loader-*`, `fwd-NNN` settled / `fwd-NNN-mid` 160 ms after input, `rev-*`, `fast-*`, `menu-*`, `hover-*`, `tab-*`, `log.json` with scroll Y per frame), `evidence/ontrack/mobile/` (86 frames), `evidence/ontrack/video/*-headless.mp4` (session recordings; slow-motion because of software rendering).

Labels: **OBSERVED** = seen in a capture or read from the live DOM/network. **INFERRED** = a reasoned interpretation of observed evidence. **PROPOSED** = our decision for the healthcare site. Never mix.

---

## 1. Construction (OBSERVED from DOM + network)
| Layer | Evidence |
|---|---|
| Platform | Webflow (`window.Webflow`, `w-embed`, `cdn.prod.website-files.com`), jQuery 3.5.1 |
| Custom code | `lando-by-OFF+BRAND.05.js` (lando.itsoffbrand.io); GSAP is bundled, **not** on `window`, so ScrollTrigger instances could not be enumerated |
| Smooth scroll | Lenis: `window.lenis`, `html.lenis`, options `lerp 0.1`, `smoothWheel true`, `syncTouch true` |
| Page transitions | Taxi.js (`data-taxi`, `data-taxi-view`) + full-screen Rive `page-transition.riv` on a fixed 1440x900 canvas (`transition-w`) |
| Rive (8 files) | `page-transition`, `btn-ui`, `signature`, `phrases`, `reef`, `ln4`, `circuits`, `mob-landscape`. Runtime `@rive-app/canvas-lite@2.26.4` WASM from unpkg (jsdelivr fallback). 34 small Rive canvases: nav hamburger, logo, button arrows (`btn-rive-w` 10-13 px), hero script "ON", signatures, countdown phrase "Race Day", stat scribble, circuit icons |
| WebGL | One fixed full-viewport canvas `.gl-wrap > canvas.gl` (1440x900). Draco-compressed `.glb` x3, MSDF font atlases (Brier, Mona Sans) => text drawn in WebGL. `data-gl="helmet-scroll"` and `data-gl="tracks"` mark DOM anchors the GL scene follows |
| Pinning | **CSS `position: sticky`** (`.horizontal-pin-sticky`, `.c.is-horiz-scroll`). No GSAP `.pin-spacer` present |
| Horizontal section | `[data-horizontal-section]` height 1363, scrollWidth 2803, `data-h-color-from=dark-green` `to=white` (background colour interpolates while scrolling sideways) |
| Text | SplitType (`css-split-type`), `data-anim="text-hover"`, `data-anim-high="right, lime"` etc. (direction + colour of a highlight block) |
| Cursor | `data-mouse-area` (highlights, schedule), `data-mouse-track` + `data-mouse-reveal` (image follows cursor inside a list) |
| Other | `data-car-counter`, `data-countdown-*`, `data-stat-hover-img`, `data-podium`, `data-oval-scroll`, `data-heroflip` (Flip in hero), `scroll-indicator` fixed |
| Fonts | Mona Sans Variable (grotesk), Brier (high-contrast display serif) |
| Palette (computed) | rgb(17,17,18) near-black, rgb(210,255,0) lime, rgb(40,44,32)/rgb(52,58,38) olive darks, rgb(178,199,58) muted lime, rgb(244,244,237) off-white |
| Reduced motion | No `prefers-reduced-motion` rule found in readable stylesheets |
| Media | 0 `<video>` elements; 36 webp, 6 svg; all imagery is stills + Rive + WebGL |

## 2. Scroll story, desktop (OBSERVED, page height 15,462 px)
Section boundaries from DOM (`section.s` tops): 0 hero · 900 · 2000 · 4629 · 5783 horizontal · 7146 · 8022 · 8830 calendar · 10458 end · 11358 helmets · 13055 socials · 14020 · 14495 footer.

1. **Loader** (`loader-*`): flat lime field, tiny "LOAD NORRIS" label bottom-centre, logo mark draws in at centre (Rive), then hard cut to hero. No progress bar.
2. **Hero** (`fwd-001`): "ON" as accent hand-script (Rive, `on-t-hero-title-rive`) overlapping a viewport-wide grotesk "TRACK"; meta row (nickname, age, city + flag); right-column intro in sans with a **serif-italic accent phrase**; bento UI cards (previous/next race, circuit line, "4", signature).
3. **Manifesto** (`fwd-002..004`): centred stacked headline mixing heavy grotesk words and light serif words in one sentence ("CHALLENGING THE LIMITS, WINNING RACES..."). Small signature above. Scrolls through the viewport.
4. **Giant number** (`fwd-004..006`): "49" set wider than the viewport, cropped by the viewport edges, travelling upward; label "PODIUMS" locks to the number's baseline.
5. **Stats** (`fwd-006..008`): image left, 2x2 numbers; a lime Rive scribble "P1" draws over "13"; decimal superscripts ("6.28"); season table.
6. **Results highlights** (`fwd-009..011`): data table rows; cursor reveal of an image follows the pointer over rows (desktop).
7. **Quote + scattered photos** (`fwd-012..015`): small serif quote with signature; B&W photos at different sizes and depths moving at different speeds (parallax collage), some photos colour.
8. **Pre-F1 career** (`fwd-015..017`): two-column title/body, laurel icon list.
9. **Countdown** (`fwd-017..018`): "06D 06H 13M 19S" huge, with a Rive script phrase "Race Day" written over it.
10. **Horizontal track** (`fwd-018..020`): sticky stage, content moves sideways; a neon 3D circuit (WebGL) inside a notched frame; background interpolates dark-green to white.
11. **Schedule** (`fwd-020..022`): title + table with fading rows.
12. **Portrait into helmets** (`fwd-022..024`): full-bleed portrait photo; the "HELMETS HALL OF FAME" block arrives with lime highlight blocks revealing text.
13. **Helmet hall** (`fwd-024..028`): staggered masonry of helmet tiles in thin-bordered cells; columns offset vertically (column parallax).
14. **Socials** (`fwd-028..030`): fanned stack of rotated photo cards that spreads as it enters.
15. **Footer finale** (`fwd-030..035`): lime glow rises from the bottom edge; a **notched dark panel** (tab cut into the top edge) slides up; signature draws; "ALWAYS BRINGING THE FIGHT." mixed type; helmet portrait rises from the panel bottom; page links left, socials right; sponsor marquee; "Business enquiries" CTA; legal bar on lime.

Mid-transition frames (`fwd-0NN-mid`, `trans` sheet) show: **block-wipe text reveal** (solid lime rectangles cover each line, then retract to reveal text, e.g. "ALWAYS BRIN▮"), and the menu link list using the same blocks.

## 3. Mobile (OBSERVED, 390x844 emulation)
- Same section order; single column.
- Giant number still overscaled, fills width.
- Horizontal track becomes a vertical stack; circuit still rendered by WebGL.
- Helmets become 2 staggered columns.
- Menu loses the photo grid: text-only list, current page struck through.
- Footer reorders: logo marquee and link columns above the headline; the helmet portrait remains the closing image.
- A `mob-landscape` Rive asset exists (INFERRED: a "rotate to portrait" prompt in landscape).

## 4. Navigation and interaction (OBSERVED)
- Fixed nav: wordmark left, small logo centre, lime "STORE" pill + square menu button right.
- Menu (`menu-open-*`): dark olive overlay, 2x2 B&W photo grid left, large uppercase links right, **current page struck through in lime**; hovering a link turns it lime and swaps one grid photo (`menu-hover-link4`). Hamburger morphs to X (Rive).
- **Escape does not close the menu** (`menu-after-escape`, nav class unchanged).
- Keyboard: focus outline 2px solid present. Tab order after "Go to home" jumps to the calendar section (y 9115), skipping hero content (`log.json`). No skip link observed.
- Reverse scroll (`rev-*`): content reappears in place; no evidence of reversed reveal choreography beyond scrubbed elements (INFERRED: most text reveals are one-shot, scrubbed items reverse).
- Fast jumps (`fast-*`): page lands in the settled state after the jump; no broken intermediate frames captured.

## 5. Reusable rules

| Rule | OBSERVED | INFERRED | PROPOSED for our site |
|---|---|---|---|
| Animation intensity | High at 5-6 moments (loader, hero script, giant number, countdown phrase, 3D track, footer); calm data tables between | Intensity is rationed: spectacle, then a quiet "reading" block | 5 signature moments, every other section supporting or utility |
| Composition | Viewport-scale type cropped by edges; small UI labels beside huge forms; centred manifesto blocks; bento cards | Contrast of scale is the main tool, not effects | Same principle with our own forms: wide-axis type, tiny DM Mono metadata, framed media |
| Section length | Sections 800-2,600 px at 900 px viewport | ~1-3 viewports each; pinned stages longest | Signature stages 200-300 vh desktop, 120-160 vh mobile; utility sections 100 vh or less |
| Hierarchy | One dominant element per viewport (number, word, photo, model) | | One hero object per scene |
| Image philosophy | Stills, not video; B&W with selective colour; photos in thin-bordered cells; full-bleed portrait as section bridge | Stills + motion-on-stills is cheaper and sharper than video | Real media (film stills, site captures) inside a recurring frame; video only where it is the product (films) |
| Typography | Grotesk + high-contrast serif mixed inside one line; accent words in serif/italic; hand-script overlays | The serif carries emotion, the grotesk carries facts | Archivo (variable width axis) + Fraunces italic accents + DM Mono metadata (source's own fonts) |
| Depth | DOM content over a fixed WebGL layer; parallax photo collage; helmet emerging from panel | Two planes: fixed world + scrolling page | Fixed WebGL "anatomy field" behind; DOM frame + text in front |
| Motion direction | Content rises; horizontal stage moves right-to-left; highlight blocks wipe from a stated side | Direction encodes reading order | Vertical for narrative, horizontal only for the film library strip |
| Continuity | Signature motif repeats (hero, stats, footer); lime accent recurs; notched frame shape recurs (track card, footer panel) | Repetition of 2-3 motifs makes it feel directed | Two motifs: the **Media Frame** and the **sign-off stroke**; one notched panel shape |
| Pinning | CSS sticky inside tall sections | Sticky avoids pin-spacer reflow issues | CSS sticky stages; GSAP ScrollTrigger only for progress, no `pin` |
| Scrub | Horizontal track and GL scenes follow scroll | Lenis lerp smooths scrub | Scrub for stage progress (frame morph, film strip, process line); one-shot for text reveals |
| Easing | Not measurable here | Smooth decel (Lenis lerp 0.1) | Proposed tokens: `expo.out` reveals 0.9 s, `power3.inOut` morphs, linear for scrub |
| Canvas | One shared WebGL canvas + many tiny Rive canvases | Sharing one GL context saves memory | One Three.js canvas, lazy, paused offscreen |
| Rive | Micro-interactions (buttons, hamburger, signature, script words, phrases) and the page transition | Rive used for hand-drawn character, not layout | **We cannot author `.riv` files here** (no Rive editor). Equivalent via SVG + GSAP DrawSVG/MorphSVG; swap to Rive later if a designer supplies files |
| Interaction density | Hover on links, stats, rows, buttons; cursor reveal in lists | | Hover reveals on film list, specialty picker, work cards; never required for content |
| Mobile | Same order; fewer layers; horizontal becomes vertical; menu simplified | | Same, plus shorter stages and no WebGL below a capability threshold |
| Performance | Stills as webp; GL models Draco; MSDF text; Lenis | | AVIF/webp, poster-first media, one GL context, DPR cap 1.5, frame budget checks |
| Accessibility gaps | No reduced-motion rule, Escape ignored, odd tab order | | We fix all three: reduced-motion path, Escape + focus trap, skip link and logical order |

## 6. What we will NOT take
Lime-on-black palette, racing vocabulary, helmet/driver imagery, signature handwriting of a person, the "ON" script lockup, the exact notched-tab silhouette, Mona Sans/Brier pairing, any asset or code.

## 7. Parity pass (2026-10-05): On Track pattern → our implementation
| On Track (observed) | Ours (implemented) |
|---|---|
| Lenis smooth scroll, lerp 0.1 | Lenis 1.3, lerp 0.1, driven by the GSAP ticker, off for reduced motion, native on touch |
| Rive full-screen page transition | Signal-red full-screen wipe with wordmark between routes (GSAP clip-path) |
| `data-anim="text-hover"` label hovers | Roll labels on nav, buttons, links, menu |
| Rive button micro-motion | Magnetic buttons + arrow nudge |
| `data-mouse-reveal` image following cursor over lists | Cursor-follow image (velocity tilt) over service rows, process steps, chips |
| Menu photo grid, link hover swaps image | Menu 2x2 generated-image grid, hovered link colours its image, others dim |
| Giant numbers, counters | 16 / 75 count up, ANY scrambles, width-axis scrub |
| Scattered photo collage with depth parallax | Five-image depth collage, scroll + pointer parallax |
| Horizontal section with colour shift | Film strip shifts ink → wine while travelling |
| Footer glow rising, notched panel | Signal glow scrubbed up, tabbed panel rises over the heart |
| Fixed scroll indicator | Right-edge progress line |
| Not copied | Lime/black identity, racing content, helmets, signature, any asset or code |
