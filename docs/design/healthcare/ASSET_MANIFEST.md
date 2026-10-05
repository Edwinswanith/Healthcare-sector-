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
