# Medical experience storyboard (PROPOSED, awaiting approval)

Content and order: `CONTENT_MAP.md` (S00-S11, locked). Motion principles: `ONTRACK_MOTION_SYSTEM.md`.
Everything in this file is **PROPOSED**. Timings are design proposals, not measurements.

## Direction: "One film, every frame"

**What Plainsight sells:** one piece of medical explanation that travels through every surface a patient sees: website, film, presenter, short, assistant answer. So the page's continuity device is literally that journey.

**Motif 1: the Media Frame.** One persistent DOM object (real `<video>`/`<img>` inside, never baked text) that the visitor follows down the page. It changes aspect ratio and role as each service is introduced: browser window 16:10 → film 16:9 → presenter 16:9 with face → short 9:16 → assistant answer card → portfolio browser → closing film. Implemented as a fixed "stage" layer handed between sections with GSAP Flip + scroll-scrubbed timelines. This is the equivalent of On Track's helmet/GL continuity, but it carries the actual product.

**Motif 2: the Anatomy Field.** Plainsight's own point-cloud anatomy (`body.bin`, Z-Anatomy, CC BY-SA) in one fixed WebGL canvas behind the page. It assembles in the loader, holds the body in the hero, disperses into a calm drifting field for the reading sections, condenses into a heart for the cardiology/HeartLink moments, and forms the closing heart in the footer. If reuse is not approved, a procedurally generated field (our own geometry) replaces it.

**Motif 3: the Sign-off stroke.** A single hand-drawn signal-red pen stroke (SVG, DrawSVG) that underlines accent words, ticks safeguards, and draws the "approved" mark in the process section. It is the brand promise ("You approve. We do the rest.") made visible. Not a real person's signature.

**Palette** (original, derived from Plainsight's own brand, not On Track's):
`--ink #0D1524` · `--ink-2 #172238` · `--paper #F3F0E8` · `--paper-2 #E7E2D6` · `--signal #E5482F` (accent, masks, stroke) · `--mute #8C93A3` · `--vital #2FD3B5` (used only on the GEO data scene, sparingly).
Scenes alternate paper and ink; transitions between them are scrubbed theme cross-fades, never a hard band.

**Type:** Archivo variable (width axis 62-125 animated as choreography: words set condensed and expand to full width as they settle), Fraunces italic for accent words (source device), DM Mono for timecodes, counters and labels. All OFL, self-hosted.

**Panel shape:** our own: a rounded rectangle with a small timecode tab on the top-left edge ("00:00 / 03:00"), used for the Media Frame, the GEO card and the footer panel.

## Motion hierarchy
- **SIGNATURE** (5): SM1 Assembly, SM2 Frame takeover, SM3 Found, SM4 Reframe, SM5 Sign-off finale.
- **SUPPORTING**: block-wipe headings, presenter comparison wipe, film-row cursor previews, work frame-scroll, packages stack, giant stat numbers.
- **UTILITY**: nav, menu, buttons, links, focus, form states.
- **STATIC**: legal text, form fields, safeguard list text, long body copy once revealed.

## Technology ownership (one owner per property)
- GSAP + ScrollTrigger: every scroll-linked timeline (progress only, `pin` not used; stages are CSS `position: sticky`).
- GSAP Flip: Media Frame hand-offs between section slots.
- GSAP SplitText: line/word splitting for headings (DOM text stays intact for screen readers via `aria-label` on the parent).
- GSAP DrawSVG: sign-off stroke.
- Three.js (raw, no R3F): the Anatomy Field only, one canvas, lazy, paused offscreen.
- CSS: hovers, focus, menu transitions, theme tokens, reduced-motion overrides.
- Lenis: **off by default**. Evaluate in the vertical slice; adopt only if scrub feel measurably improves and anchors/keyboard still work.
- No Framer Motion, no R3F, no Rive runtime (no authoring tool here; SVG + GSAP covers the micro-interactions).

---

## S00 header + menu (UTILITY)
- **Content:** PLAINSIGHT MEDICAL, 5 nav links, ENQUIRE.
- **Visual:** fixed bar; wordmark left, DM Mono running timecode centre (page progress as `00:00 → 03:00`, a nod to film length), ENQUIRE pill + menu button right. Bar colour follows the scene theme (ink on paper, paper on ink).
- **Motion:** hides on scroll down, returns on scroll up (desktop); always visible on mobile. Menu: full-screen ink panel opens from the button with a clip-path circle; links rise via block wipe in signal red; hovering a link swaps the left preview to that service's frame state (browser / film / presenter / short / work) – preview is decorative, `aria-hidden`.
- **Accessibility:** skip link; menu is a modal dialog: focus trap, **Escape closes**, focus returns to the button; current section marked `aria-current`.
- **Mobile:** text-only menu, larger targets, no previews.
- **Reduced motion:** instant open/close, no wipes. **Fallback:** works without JS as an anchor list.

## S01 preloader → S02 hero (SM1 "Assembly", SIGNATURE)
- **Content:** "Building anatomy", counter to 100, "14 anatomical structures · sampled from Z-Anatomy"; then hero H1, body, BOOK A CALL, SEE WHAT WE MAKE, MADE FOR (2 names), composite with YOUR WEBSITE / YOUR FILM, INSIDE IT / YOUR SHORTS.
- **Visual:** paper background. Points stream in from scattered noise and assemble into the standing body figure (right half). DM Mono counter bottom-left reflects **real** load progress of the field + hero poster. On complete, the H1 sets: "YOUR PRACTICE'S MEDIA" in Archivo expanding from width 62 to 125 line by line; "*partner.*" in Fraunces italic is underlined by the sign-off stroke. The Media Frame lands bottom-right as a browser window containing the gallbladder page with the film playing muted (poster first), and a 9:16 phone tucked against it.
- **Transition in:** loader is an overlay on top of server-rendered hero; it fades its label and leaves the field in place (no cut).
- **Active state:** pointer parallax on the field (desktop); the film loops muted; the three labels tick in DM Mono.
- **Transition out:** see SM2.
- **Asset:** `body.bin` (real) or procedural field; `/hero/film.mp4` + poster (real); `/media/short-know-the-signs.mp4` (real). No generated media.
- **Implementation:** Three.js Points + custom shader (morph targets), GSAP timeline, SplitText.
- **Mobile:** field below the H1 at 60% density, no pointer parallax; frame shown full-width under CTAs.
- **Reduced motion:** no loader, static rendered field frame (pre-rendered PNG), text present immediately.
- **Performance fallback:** if WebGL unavailable or low-end (deviceMemory ≤ 4 or a failed 30-frame probe), show the poster PNG of the assembled body. Loader capped at 1.6 s, skipped on repeat visits (sessionStorage), never blocks interaction (CTAs clickable under it).

## S03 offer (SM2 "Frame takeover", SIGNATURE)
- **Content:** WHAT WE DO, H2, four services 01-04 with copy and anchor links.
- **Visual:** the hero frame detaches (Flip) and scales to fill a sticky centre stage while the hero copy falls away. The H2 sits above in two lines; "*see.*" in italic. The stage steps through four states as you scroll, each a **real** asset in the same frame: 01 browser (cardiology capture), 02 film 16:9 (gallbladder film), 03 presenter (Dr Singh clone frame), 04 short 9:16 (heart attack short). A DM Mono index 01-04 and the service copy change on the left with block wipes.
- **Transition in:** hero frame → stage (Flip, scrubbed over first 25% of the stage).
- **Active state:** scroll progress morphs aspect ratio between states (scrubbed `aspect-ratio`/clip-path on a wrapper, image cross-fades); each service's copy + link is a real focusable item; clicking jumps to its section.
- **Transition out:** on state 01 → scroll on, the browser state expands to full-bleed and becomes the websites section's canvas (SM3 starts inside it).
- **Asset:** real captures/stills only. **Implementation:** sticky stage 300 vh, one GSAP timeline scrubbed, Flip for in.
- **Mobile:** 160 vh stage; frame at top 55% of the viewport, copy below; four states with snap points.
- **Reduced motion:** four static cards in a 2x2 grid with the real images.
- **Performance fallback:** no aspect morph; cross-fade only.

Note: SM2 ends at state 04 (short). Handing state 01 forward to S04 contradicts the order, so the hand-off is: state 04 → frame collapses back to browser in one beat as the theme shifts to paper → S04. (Order stays S03 → S04.)

## S04 websites (SM3 "Found", SIGNATURE)
- **Content:** H2, body, 12-specialty picker + "Not listed?", active panel (organ, specialty, description, FILMS count, OPEN THE LIVE TEMPLATE), GEO block (patient question, assistant answer with citation, explanation, 5 principles, link).
- **Visual part A (specialty):** the Media Frame is a large browser. The picker is a horizontal rail of 12 DM Mono labels; choosing one (click, arrow keys) swaps the template capture with a vertical **signal-red block wipe**, and the tall capture **scrolls inside the frame** as you scroll the page (scrub), showing that these are full sites. The panel text updates with each choice. The anatomy field condenses toward the selected organ silhouette when one exists in `body.bin` (heart, knee, brain, eye, lungs...), else stays as field.
- **Visual part B (GEO):** theme shifts to ink. The browser frame shrinks and re-shapes into an **assistant answer card** (our panel shape). The patient's question types in (DM Mono), the answer resolves sentence by sentence, citation [1] glows, and a thin line connects [1] back to a transcript line inside a small film card: "the answer is quoted from our film transcript". The caption "Illustration." is always visible. The 5 principles appear as annotations around the card with leader lines (Readable → transcript; Checkable → GMC/appointments block; Structured → a schema snippet; Open → robots/llms.txt lines; Watched → a dated check log).
- **Transition in:** from SM2 collapse (paper). **Transition out:** the card dims, the field brightens into the dark theatre of S05.
- **Asset:** 12 real template captures; optional generated still G1 (patient at a kitchen table at night, phone glow, face not identifiable) as a soft background behind the GEO card, labelled as illustration. Annotations are SVG/DOM.
- **Implementation:** sticky stage 250 vh (A) + 200 vh (B); GSAP timelines; picker is a real `role=tablist`.
- **Mobile:** picker becomes a horizontally scrollable chip row; capture scroll shortened; GEO principles become a vertical list under the card with short connecting ticks.
- **Reduced motion:** picker swaps instantly; GEO card shown complete; principles listed.
- **Performance fallback:** no inner-capture scrubbing, show top of capture.

## S05 films (SM4 part 1 "The library", SIGNATURE)
- **Content:** H2, body, NOW SHOWING player (gallstones, transcript link), 6-item playlist, stats 16 / 75 / ANY, hint, 16-film carousel, closing line, 2 CTAs.
- **Visual:** ink "theatre". The Media Frame becomes a true 16:9 player centred (gallstones film, captions on, real controls). Then the giant-number moment: **"16"** set wider than the viewport and travelling up, "films ready" locked to its baseline; then "75" with "topics available, across 14 specialties"; then "ANY". (Our equivalent of On Track's "49 PODIUMS".) Then a **horizontal film strip**: the 16 film cards in a sticky stage move right-to-left with scroll, background shifting ink → ink-2; hovering a card previews the film muted (desktop), category + duration in DM Mono timecode.
- **Transition in:** field from S04 darkens; frame Flip from GEO card to player. **Transition out:** the last strip card ("Heart attack ... Made for HeartLink") stays and becomes the frame for S06 (it is the very film S06 shows).
- **Asset:** 16 real posters + 2 real films with VTT. No generated media.
- **Implementation:** sticky horizontal stage (CSS sticky + translateX from ScrollTrigger progress), numbers via GSAP.
- **Mobile:** player full-width; numbers stay oversized; strip becomes native horizontal scroll with snap (touch), not scroll-jacked.
- **Reduced motion:** numbers static, strip is a normal grid.
- **Performance fallback:** hover previews off; posters only until clicked.

## S06 presenter (SUPPORTING with SM4 continuity)
- **Content:** H2, body, 3 steps (consent, session, approve), disclosure, toggle (AI presenter / house narrator), caption, link.
- **Visual:** the heart-attack frame from S05 settles left; a **comparison wipe** splits it: left half "WITH YOUR AI PRESENTER" (clone frame/video), right half "WITH OUR HOUSE NARRATOR"; scroll (or drag/keyboard on the handle) moves the divider. The three steps sit right with the sign-off stroke ticking each as it enters. The disclosure line is set in DM Mono inside the frame's tab: "PRESENTED BY AN AI AVATAR, WITH CONSENT", always visible.
- **Transition out:** SM4 part 2.
- **Asset:** real `/media/heart-attack.mp4`, `/presenter/narrated.mp4`, posters. **Never** a generated face here.
- **Mobile:** toggle buttons instead of drag; steps under the frame.
- **Reduced motion / fallback:** toggle only.

## S07 social (SM4 part 2 "Reframe", SIGNATURE)
- **Content:** H2, body, 3 shorts with durations, hint, caption, platform table, 4 inclusions, link.
- **Visual:** the 16:9 frame **reframes to 9:16 on scroll**: the crop window narrows around the subject while the frame rotates upright, demonstrating "every film reframed for vertical viewing". It then **fans into three phones** (Know the signs / Inside a heart attack / Reopening the artery) that spread like a hand of cards; tapping/hovering plays one muted, click for sound. The platform table types in as four DM Mono rows with format chips 9:16 / 16:9.
- **Transition in:** from S06 frame. **Transition out:** fanned phones collapse into one and slide out as the theme turns to paper for S08.
- **Asset:** 3 real shorts + posters.
- **Mobile:** reframe still runs (short stage, 120 vh); fan becomes a horizontal snap row.
- **Reduced motion:** three static 9:16 cards. **Fallback:** posters, play on tap.

## S08 work (SUPPORTING, portfolio)
- **Content:** H2, body, Prof. Hemant Sheth case (site, role, 3 facts), HeartLink case (3 facts), 12 concepts link.
- **Visual:** paper. Two large case panels. Case 1: the Media Frame becomes a browser showing `londonroboticsurgeon.co.uk`; the 1100x3208 real capture **scrolls inside the frame** with page scroll (frame parallax); facts sit beside it in DM Mono chips. Case 2: the clone frame with "3 vertical shorts" as a small stack of three 9:16 thumbnails. Hover on each case shows a cursor-following "Read the case study" tag (desktop). "ALSO 12 SPECIALTY WEBSITE CONCEPTS" is a clearly labelled concept strip of 12 tiny captures moving on a slow marquee, labelled **Concepts**.
- **Asset:** real `/shots/sheth.jpg`, `/presenter/clone.jpg`, template captures.
- **Mobile:** stacked cases; inner scroll shorter. **Reduced motion:** static capture crops. **Fallback:** no marquee.

## S09 process (SM5 part 1 "Sign-off", SIGNATURE)
- **Content:** H2, body, steps 01-05, 4 safeguards, link.
- **Visual:** a horizontal timeline line across a sticky stage; as you scroll, the signal-red **sign-off stroke** draws along it and ticks each step; step copy wipes in. Behind the line, a scroll-scrubbed **canvas frame sequence** (G2): a slow camera push across a consultant's desk where a printed script is annotated and signed (hands only, no face), ending on the signed page. At step 05 the stroke completes into the approved mark. Safeguards appear as four stamped lines in DM Mono, each with a tick.
- **Transition out:** the signed page whites out into paper for S10.
- **Asset:** G2 Veo clip → 72-96 frames (desktop) / 48 frames (mobile) AVIF/webp sequence, with poster.
- **Mobile:** vertical timeline, 36-frame sequence or single still. **Reduced motion:** static still + full list. **Fallback:** single poster frame.

## S10 packages (SUPPORTING)
- **Content:** H2, sub, 3 options with "MOST COMPLETE START" marker, 3 TALK ABOUT THIS links.
- **Visual:** three tall panels arrive as a stacked deck that spreads into a row (stack → spread on scroll). Option 02 sits slightly forward with its marker in signal red. Each list item ticks with the stroke. Hover lifts a panel and reveals the frame state that package contains (film / browser+film / all four) in its top half.
- **Mobile:** vertical stack, swipe not required. **Reduced motion:** static row.

## S11 footer (SM5 part 2 "Finale", SIGNATURE)
- **Content:** eyebrow, H2 "LET'S TALK ABOUT *your practice.*", BOOK A CALL, CHOOSE FILM TOPICS, 3 link columns, email, llms.txt, legal + disclaimer.
- **Visual:** signal glow rises from the bottom edge; our panel shape (with timecode tab "03:00 / 03:00") slides up over it. Inside, the anatomy field condenses into the **heart**, beating slowly; the H2 sets with the width-axis expansion and the stroke underlines "*your practice.*". Optional background loop G3 (an empty consulting room at dusk, a monitor glowing) behind the heart at low opacity, only if it reads as intentional in review. Link columns and legal sit on the paper bar below the panel.
- **Asset:** field (real or procedural); optional G3.
- **Mobile:** links above headline (On Track pattern), heart smaller. **Reduced motion:** static heart image. **Fallback:** static heart PNG.

## /contact/ (enquiry route)
Built in scope: same fields as source, client + server-free validation, builds a `mailto:` to the confirmed address and says honestly that the visitor's mail app opens. No storage, no fake success. "Please do not send patient information" kept prominent.

## Signature moments (summary)
| # | Name | Sections | Why it matters | Core tech |
|---|---|---|---|---|
| SM1 | Assembly | S01→S02 | Anatomy built from points, then the offer in the first viewport | Three.js points morph, GSAP, Archivo width axis |
| SM2 | Frame takeover | S02→S03 | One frame becomes all four services: the business model, shown | Flip + scrubbed aspect morph in a sticky stage |
| SM3 | Found | S04 | Websites and GEO made concrete: specialty swap, answer quoting a transcript | Block wipes, in-frame capture scroll, typed answer, SVG leader lines |
| SM4 | Reframe | S05→S07 | Library strip, giant counts, then 16:9 → 9:16 reframe and fan to shorts | Sticky horizontal strip, crop morph, card fan |
| SM5 | Sign-off finale | S09→S11 | "You approve" drawn as one stroke, ending in the beating heart CTA | DrawSVG, canvas frame sequence, field → heart |

## Section-order check
Rendered order will be S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, verified programmatically against `CONTENT_MAP.md` in QA.
