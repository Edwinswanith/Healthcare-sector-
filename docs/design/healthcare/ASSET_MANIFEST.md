# Asset manifest and production plan (PROPOSED)

Status values: `planned` · `approved` · `generated` · `rejected` · `final`. Nothing has been generated. No credits spent.

## Provider status (verified 2026-10-05)
| Provider | Status | Notes |
|---|---|---|
| Gemini image | available | `gemini-3-pro-image` (Nano Banana Pro), `gemini-3.1-flash-image` (Nano Banana 2) listed via API. Price: **unverified** (ai.google.dev blocked by network policy) |
| Veo | available | `veo-3.1-generate-preview`, `-fast-`, `-lite-` via `predictLongRunning`. Duration options, first/last-frame and resolution parameters **unverified** until docs are reachable or a minimal call confirms them |
| Higgsfield | connected, **0 credits** | Not planned. Optional for G2 camera move only if topped up |
| FFmpeg | available | inspect, transcode, frame extraction, posters |

Generation scripts will run server-side from `scripts/media/`, read `GEMINI_API_KEY`-style credentials from the environment only, store outputs under `media-src/` (not public), and log job IDs to `ASSET_LOG.json`. The public site never calls a generator.

## Permission register (explicit status per item)
| Item | Status | If unconfirmed |
|---|---|---|
| `body.bin` anatomy points (Z-Anatomy/BodyParts3D CC BY-SA derivative) | unconfirmed | original procedural field (P01), the default |
| Prof. Hemant Sheth name, site capture, film credits, case statistics (22 pages, 7 films) | unconfirmed for new site | Work slot keeps position; labelled "Case study pending approval" placeholder with original concept frame |
| HeartLink name/brand, shorts, case statistics | unconfirmed for new site | same placeholder treatment |
| Dr Harmandeep Singh likeness / AI clone video | unconfirmed for new site | presenter scene uses an original non-person treatment (silhouette/frame) labelled "Example layout", no generated face |
| Patient-education film footage (16 films, posters, VTT) | unconfirmed | film titles and durations kept as text; frames are original code-rendered anatomy posters labelled "Preview" |
| Specialty template captures (12) | unconfirmed | original wireframe captures built in code, labelled "Concept" |
| Testimonials | none exist in source | none shown |
| Third-party logos (Instagram, TikTok, YouTube, Facebook) | not used as logos | platform names as text |
| Generated media (G1-G3) | ours once generated | n/a |

## A. Real assets (reuse from Plainsight, ONLY when the register above says confirmed)
| ID | Section | Source path | Use | Format target | Fallback |
|---|---|---|---|---|---|
| R01 | S01/S02/S11 | `/atlas/body.bin` (324 KB) | Anatomy Field points | binary, lazy | procedural field (P01) |
| R02 | S02/S03 | `/hero/film.mp4` + `.jpg` | hero frame film | H.264 + AV1/VP9, 960x540, muted loop | poster |
| R03 | S02/S03/S07 | `/media/short-*.mp4` + `.jpg` (3) | shorts | 540x960 | posters |
| R04 | S03/S04/S08 | `/shots/<slug>.jpg` (12 specialties) | template captures | AVIF/webp, 1100x2521, responsive widths | top crop |
| R05 | S08 | `/shots/sheth.jpg` | case study capture | 1100x3208 | top crop |
| R06 | S03/S06/S08 | `/presenter/clone.jpg`, `/presenter/narrated.jpg/.mp4` | presenter compare | 1280x720 | posters |
| R07 | S05/S06 | `/media/<slug>.jpg` (16), gallstones + heart-attack `.mp4` + `.vtt` | library, player | 1280x720 posters, H.264 | posters |

Rules: captions (VTT) ship with every playable film; real clinician likeness only from R06 with the existing consent; concepts labelled as concepts.

## B. Derived assets (no generation, made with code/FFmpeg)
| ID | Section | Description | Method |
|---|---|---|---|
| P01 | S01/S02/S11 | Procedural point field (body silhouette + heart) if R01 not approved | Three.js geometry sampled from our own SVG paths |
| P02 | S02/S11 | Static PNG of assembled body and heart (reduced-motion + no-WebGL) | Render from the field once, commit |
| P03 | all | Sign-off stroke | Hand-built SVG path |
| P04 | S04 | GEO annotations, schema snippet, robots/llms.txt lines | DOM/SVG with real example text |
| P05 | all | Posters, AVIF/webp ladders (480/960/1440/1920) | FFmpeg / sharp |
| P06 | S00 | Favicon / OG image | Built from wordmark + field render |

## C. Generated assets (announce each paid batch first)
Candidates, not a fixed list: add a brief here whenever generation materially improves an approved scene.

### G2 (required) Process: "The signed script" (S09)
- Purpose: makes "You approve. We do the rest." physical; background for the sign-off timeline.
- Desktop 16:9 1920x1080; mobile 9:16 1080x1920 composition (separate still, not a crop).
- Visual: overhead-to-oblique slow push across a warm wooden consultant's desk at early evening; a printed patient-film script (illegible lorem-like lines, no real text), a red pen, a laptop edge showing a soft-focus anatomy still; a hand enters and initials the final page with a tick. Hands only, no face, no logos, no readable text. Palette: paper cream, ink navy shadows, one signal-red pen. Text-safe area: left 45% kept calm (desktop), top 40% (mobile).
- Method: Gemini 3 Pro Image start still + end still (desk without / with the tick) → Veo 3.1 image-to-video using the start frame (end-frame conditioning only if confirmed supported) → FFmpeg extract 96 frames desktop / 48 mobile → AVIF sequence.
- Duration: 6-8 s source. Loop: no. Scroll-controlled: yes (canvas sequence, bounded buffer ±12 frames).
- Start frame: desk, pen resting. End frame: page with red tick, pen lifted.
- Reject if: hands deformed, text legible or nonsense glyphs prominent, pen changes shape, lighting flicker, camera jitter.
- Fallback: single still (end frame) with the stroke animated over it.

### G1 (optional) GEO backdrop: "A patient asks" (S04B)
- Purpose: humanise the assistant question without implying a real patient.
- 16:9 2400x1350 + 9:16 1080x1920 stills. Night kitchen, phone glow on a parent's hands holding a phone, baby bottle on table, face out of frame or deeply out of focus. Very low contrast, sits behind the answer card at ~30% opacity. Labelled "Illustration".
- Method: Gemini image only (no video). Reject if a face is identifiable, hands deformed, readable screen text.
- Fallback: none needed (dark gradient + field).

### G3 (optional) Footer finale loop (S11)
- Purpose: closing atmosphere behind the heart: "your practice".
- 16:9 1920x1080 seamless loop 6-8 s, mobile 9:16 still only. Empty private consulting room at dusk, two chairs, desk lamp, a monitor showing a soft anatomy frame, slow light drift; no people.
- Method: Gemini still → Veo image-to-video, gentle push-in; loop by FFmpeg crossfade at seam.
- Fallback: the still. Ship only if it reads as intentional next to the heart; otherwise drop.

## D. Budget (prices UNVERIFIED, see provider status)
| Batch | Jobs | Max attempts | Rough ceiling |
|---|---|---|---|
| Sample (after direction approval) | G2 start still x2 variants (desktop/mobile) on Nano Banana Pro + 1 Veo fast 8 s clip | stills 3 each, video 2 | **USD 10** |
| Production | G2 final (Veo standard), G1 stills, G3 still + clip | stills 3 each, video 2 each | **USD 30** |
| Total ceiling | | | **USD 40**, hard stop |

I will check actual usage after each job, never resubmit before checking job status, and stop at the ceiling.

## E. Performance budgets (initial)
- Hero LCP element: H1 text (server-rendered); hero poster ≤ 120 KB AVIF.
- JS: ≤ 180 KB gz first load excluding the lazily loaded Three.js chunk (~150 KB gz) which loads after first paint and only on capable devices.
- Video: hero loop ≤ 1 MB; films stream on demand (preload=none) with posters.
- Frame sequence: desktop 96 frames at 1600 px wide AVIF ≈ 4-6 MB total, streamed; decoded buffer ≤ 25 frames ≈ 25 x 1600x900x4 B ≈ 144 MB worst case, so cap at 12 buffered (≈ 70 MB) desktop and use 960 px / 48 frames on mobile (≈ 12 x 960x1706x4 ≈ 79 MB, cap 8 ≈ 52 MB).
- WebGL: DPR cap 1.5, ≤ 30k points, pause when tab hidden or canvas offscreen.

## F. What the vertical slice actually ships (2026-10-05)
| Asset | Source | Status |
|---|---|---|
| Anatomy Field (body, heart, ECG drift, scatter) | P01 procedural, `lib/field/shapes.ts` (original geometry) | in use |
| Organ studies in frame/concepts/film cards (12 organs + bust) | procedural, same generator, 2D canvas | in use |
| Concept clinic sites (12 palettes) | code-rendered, labelled "Concept" | in use |
| Film / presenter / short frame layers | code-rendered, labelled "concept preview" / "Example layout" | in use |
| Plainsight films, posters, captures, `body.bin`, client names | not used (permission unconfirmed) | held |
| Generated media (Gemini / Veo / Higgsfield) | none generated, USD 0 spent | not started |
| Favicon | `app/icon.svg`, original | in use |

## G. Generation batch 1 (approved by user 2026-10-05, run 2026-10-05)
Model `gemini-3-pro-image`, 16:9, imageSize 2K, output 2752x1536 JPEG. Script `scripts/media/generate-stills.mjs`; every request with full prompt, token usage and response id is logged in `ASSET_LOG.json`. Raw outputs in `media-src/gen/` (not committed), retouched masters in `media-src/final/` (not committed), shipped WebP in `public/media/gen/` (960 + 1920 wide, 13-75 KB each).

| ID | Used in | Attempts | Status | Notes |
|---|---|---|---|---|
| g-room | Footer backdrop | 1 | final | Tiny monitor logo blurred out in retouch |
| g-phone | Websites interlude "Asked." | 2 | final | Attempt 1 rejected (face profile visible); attempt 2 hands-only, right edge cropped |
| g-theatre | Films interlude "Explained." | 1 | final | |
| g-studio | Presenter backdrop | 1 | final | |
| g-clinic | Work interlude "Launched." | 1 | final | No signage |
| g-hands | Process interlude "Checked." | 1 | final | |

Calls: 7 successful generations + 1 failed unauthenticated request (HTTP 403, no image, not billed). Cost: **not verified** (pricing page blocked). Rough estimate from the recalled published rate (about USD 0.13 per 1K-2K image): about USD 0.95. Check actual spend in Google Cloud billing. Remaining sample ceiling well above zero; total ceiling USD 40 unchanged.
All six are labelled "Generated illustration" on the page. No real people, clients or patients depicted.

## H. Generation batch 2: Veo (approved by user 2026-10-05)
Model `veo-3.1-fast-generate-preview`, 8 s each, `predictLongRunning`, parameters `aspectRatio`, `durationSeconds`, `negativePrompt`. Script `scripts/media/generate-video.mjs` (bounded polling, no automatic resubmits); operations, prompts and sizes logged in `ASSET_LOG.json`.

| ID | Used in | Aspect | Attempts | Status | Notes |
|---|---|---|---|---|---|
| v-film | Film frame state, narrator half of presenter split, "Reopening" phone, non-cardiac film-card hover | 16:9 | 1 | final | Top 44 px cropped (light band), audio removed |
| v-presenter | AI presenter half, "Inside a heart attack" phone | 16:9 | 1 | final | **Generated person**, labelled on screen "AI-generated example presenter"; not a real clinician or client |
| v-short | Short frame state, cardiology film-card hover | 9:16 | 1 | final | Audio removed |

Delivery: muted loops, VP9 WebM first (334 KB-968 KB), H.264 MP4 fallback (480 KB-965 KB), WebP posters (15-60 KB). `preload="none"`; a clip loads and plays only while its frame state is active, pauses otherwise; reduced motion shows posters only.
Cost: **not verified** (pricing page blocked). Rough estimate at the recalled Veo 3.1 Fast rate (about USD 0.15 per second): 24 s ≈ USD 3.6. Running total estimate ≈ USD 4.6 of the USD 40 ceiling. Confirm in Google Cloud billing.

## I. Generation batch 3 (user request 2026-10-05: hand-drawn character, art direction, 3D, hover depth via AI)
Stills: `gemini-3-pro-image`. Videos: `veo-3.1-fast-generate-preview`, image-to-video from our own stills as the first frame. All logged in `ASSET_LOG.json`.

| ID | Kind | Used in | Attempts | Status |
|---|---|---|---|---|
| l-madeclear | brush lettering | Hero, over the headline | 1 | final |
| l-found | brush lettering | Websites GEO lead | 1 | final |
| l-plainenglish | brush lettering | Films interlude | 1 | final |
| l-approved | brush lettering | Process stamp | 1 | final |
| l-letstalk | brush lettering | Footer panel | 1 | final |
| g-desk | still | Process step hover | 1 | final |
| g-edit | still | Collage, menu grid, process hover | 1 | final |
| g-glassheart | still | Collage, menu grid | 1 | final |
| v-theatre | Veo from g-theatre | Films interlude video | 1 | final |
| v-clinic | Veo from g-clinic | Work interlude video | 1 | final |

Lettering processed locally: inverted luminance → alpha, cropped, recoloured signal / paper, WebP 47-74 KB. Videos 254-578 KB (WebM/MP4) + posters.
3D heart: no asset; procedural ray-marched shader (`components/motion/HeartGL.tsx`).
Cost: **not verified**. Estimate: 8 images ≈ USD 1.05 + 16 s Veo Fast ≈ USD 2.40 → batch ≈ USD 3.45; running total ≈ USD 8 of USD 40. Confirm in Google Cloud billing.

## J. Photoreal turntable heart (user request 2026-10-05: "use Gemini and Veo" for the 3D object)
Gemini and Veo do not output 3D model files, so the object is a turntable: `g-heart3d` (gemini-3-pro-image, 1 attempt) → `v-heart360` (veo-3.1-fast, image-to-video from that still, 1 attempt, ~180° orbit in 8 s) → 48 square frames (640 px WebP, 788 KB total) in `public/media/heart/`.
Played by `components/motion/HeartSpin.tsx`: ping-pong frame index driven by scroll position, pointer drag, arrow keys and a slow idle drift; frames load only when the footer is within ~2 viewports; reduced motion shows frame 1. Labelled as an AI-generated illustration (aria-label). Replaces the ray-marched shader heart.
Cost: not verified; estimate ≈ USD 0.13 + 8 s Veo Fast ≈ USD 1.20. Running total ≈ USD 9.4 of USD 40.

## Batch K: homepage-style hero (Gemini 3 Pro Image, 4 jobs, attempt 1 each, no retries)

| Asset | Source | Use | Notes |
|---|---|---|---|
| `public/media/hero/portrait*.webp` | `h-portrait-1` generated | Hero presenter, WebGL base layer | Fictional AI-generated clinician. Labelled on page "AI-generated presenter · not a real clinician". Not a client, not a testimonial. |
| `public/media/hero/portrait-cut.webp` | portrait + matte alpha | Reduced motion / no-WebGL still | |
| `public/media/hero/anatomy*.webp` | `h-anatomy-1` (edit of portrait) | X-ray reveal layer | Illustrative anatomy, not clinical imagery. |
| `public/media/hero/dm.webp` | `h-depth-1` (R) + `h-matte-1` (G) | Depth parallax + matte | Alignment verified: bounding boxes within 6px, 50% overlay shows no ghosting. |
