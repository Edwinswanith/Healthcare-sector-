# Plainsight ordered content map (LOCKED ORDER)

Source: https://plainsight-medical.vercel.app/ (Astro site), read live 2026-10-05 with Playwright Chromium 1440x900 and 390x844.
Raw extraction: `evidence/plainsight/ps-home.json`, linked pages in `evidence/plainsight/pages/`, section screenshots in `evidence/plainsight/sections/`.
Canonical (from `<link rel=canonical>`): https://www.plainsightmedical.co.uk/ . JSON-LD: `Organization` "Plainsight Medical", areaServed GB, parentOrganization COGNIVERSE LIMITED.

Evidence label for everything below: **source-confirmed** (read from the live DOM). Not independently verified as true.

The order S00-S11 is locked. It must appear in this order in the content model and the rendered DOM, on desktop and mobile. Any change needs explicit approval.

| Order | ID | Source element | Heading |
|---|---|---|---|
| 0 | S00 `header` | `<header>` + mobile `<nav aria-label=Main>` (responsive duplicate, not a section) | (brand + nav) |
| 1 | S01 `preloader` | `div#preloader` | "Building anatomy" |
| 2 | S02 `hero` | `section#hero` | YOUR PRACTICE'S MEDIA *partner.* |
| 3 | S03 `offer` | `section#offer` | ONE PARTNER FOR EVERYTHING YOUR PATIENTS *see.* |
| 4 | S04 `websites` | `section#websites` | WEBSITES THAT GET *found.* |
| 5 | S05 `films` | `section#films` | A LIBRARY FOR YOUR SPECIALTY. OR WE MAKE *yours.* |
| 6 | S06 `presenter` | `section#presenter` | PRESENTED BY YOU, IN YOUR *own voice.* |
| 7 | S07 `social` | `section#social` | NOT JUST YOUR WEBSITE. EVERY *platform.* |
| 8 | S08 `work` | `section#work` | BUILT, LAUNCHED, *in use.* |
| 9 | S09 `process` | `section#process` | YOU APPROVE. WE DO *the rest.* |
| 10 | S10 `packages` | `section#packages` | THREE WAYS TO *begin.* |
| 11 | S11 `footer` | `footer#footer` | LET'S TALK ABOUT *your practice.* |

Italic = the source's serif-italic accent word (typographic device in the source).

---

## S00 header
- Brand: PLAINSIGHT MEDICAL (logo -> `/`).
- Nav: WEBSITES `/templates/` · FILMS `/films/` · AI PRESENTER `/ai-presenter/` · SOCIAL `/social/` · WORK `/work/` · ENQUIRE `/contact/` (button).
- Skip link `#main` present.

## S01 preloader
- Copy: "Building anatomy" + counter to 100 + "14 anatomical structures · sampled from Z-Anatomy".
- Media: point-cloud anatomy from `/atlas/body.bin` (324 KB binary) drawn to canvas.
- Confirm: licence chain (Z-Anatomy / BodyParts3D, CC BY-SA 4.0, attributed in footer) and permission to reuse `body.bin`.

## S02 hero
- Eyebrow: WEBSITES · PATIENT FILMS · AI PRESENTER · SOCIAL
- H1: YOUR PRACTICE'S MEDIA *partner.*
- Body: "We build the website patients and AI assistants find, put patient films inside it, present them in your own voice, and run your content on Instagram, TikTok, YouTube and Facebook."
- CTAs: BOOK A CALL -> `/contact/` (primary) · SEE WHAT WE MAKE -> `#offer`.
- "MADE FOR": Prof. Hemant Sheth -> `/work/prof-hemant-sheth/` · HeartLink -> `/work/heartlink/`.
- Composite mock (links `#films`): browser at `yourname.co.uk/gallbladder-surgery`, "YN Your Name, CONSULTANT SURGEON, Book a consultation", "Gallstones and gallbladder removal", PLAY THE FILM · 03:00, TRANSCRIPT, CAPTIONS, SOURCES: NHS; phone with a short. Labels: YOUR WEBSITE · YOUR FILM, INSIDE IT · YOUR SHORTS.
- Media: `/hero/film.mp4` (H.264 960x540, 744 KB, poster `/hero/film.jpg`), `/media/short-know-the-signs.mp4` (poster jpg), 1 canvas (anatomy).
- Confirm: "patients and AI assistants find" is an aspiration, not a guarantee; keep wording, never upgrade to a ranking promise.

## S03 offer
- Eyebrow: WHAT WE DO. H2: ONE PARTNER FOR EVERYTHING YOUR PATIENTS *see.*
- 01 WEBSITES: "Built for your specialty, and built to be found: on Google, and by the AI assistants patients now ask." -> See the websites `#websites`
- 02 PATIENT FILMS: "Two to three minutes in plain English, embedded on the page where the patient needs them." -> Watch the films `#films`
- 03 YOUR AI PRESENTER: "An AI clone of you presents each film with your own face and voice, from one recording session." -> See it working `#presenter`
- 04 SOCIAL CONTENT: "Every film cut into shorts, and your channels managed across Instagram, TikTok, YouTube and Facebook." -> See the shorts `#social`
- Media: `/shots/cardiology.jpg` (1100x2521 site capture), `/hero/film.jpg`, `/presenter/clone.jpg` (Dr Singh clone frame), `/media/short-inside-a-heart-attack.jpg` (9:16); 3 lazy videos.

## S04 websites
- Eyebrow: WEBSITES. H2: WEBSITES THAT GET *found.*
- Body: "Pick your specialty. Each site is organised around the conditions you treat, with a film on the page that explains each one."
- Specialty picker (12 + 1): Cardiology, Orthopaedics, Neurology, Ophthalmology, Respiratory, Upper GI, Urology, Colorectal, Spinal, ENT, Hand, Private GP, Not listed? (-> `/contact/`). Each -> `/templates/<slug>/`.
- Active panel (Cardiology default): HEART · CARDIOLOGY · "A calm, serious site that leads with urgency rules: when to call 999, when to book." · FILMS "2 films made, 7 more topics ready to script" · OPEN THE LIVE TEMPLATE -> `/templates/cardiology/`. Panel copy for the other 11 lives in `/templates/` (see `pages/_templates_.json`).
- GEO block: "GEO-FRIENDLY, IN PLAIN WORDS". Illustration: A PATIENT ASKS "Is it normal for my baby to bring up milk?" / THE ASSISTANT ANSWERS "Lots of babies bring up milk after a feed. It can be worrying, but for most babies it's normal, and it gets better with time." citation [1] yourname.co.uk "Reflux in babies: film and transcript". Caption: "Illustration. The answer is quoted from our film transcript."
- "When a patient asks an assistant, it names the consultant it can read, check and quote."
- "GEO means generative engine optimisation: being the consultant that ChatGPT, Gemini or Perplexity names. Every site we build is made for that, as well as for Google."
- 01 Readable: "Every film ships with its full transcript, so what you say on screen exists as text an assistant can read."
- 02 Checkable: "Your GMC number, appointments and hospitals stated once, consistently, with the sources behind each page named."
- 03 Structured: "Markup that tells a machine this is a physician, this is a procedure, this is a film and how long it runs."
- 04 Open: "Crawl rules and an llms.txt file that let AI assistants in, rather than blocking them by default."
- 05 Watched: "A regular check of what Google and the main assistants actually say when asked about you."
- Link: How a page is built to be found -> `/templates/#geo`.
- Media: 12 template captures `/shots/<slug>.jpg` (1100x2521, tall full-page), 1 canvas.
- **Confirm (claim risk):** "it names the consultant it can read, check and quote" and "being the consultant that ChatGPT... names" read as outcome claims. Proposed: keep the source wording verbatim (it is the client's copy), keep the "Illustration" label, add nothing stronger. Flag for client review.

## S05 films
- Eyebrow: THE FILM LIBRARY. H2: A LIBRARY FOR YOUR SPECIALTY. OR WE MAKE *yours.*
- Body: "Patient films of two to three minutes, scripted from NHS and NICE guidance and signed off by the clinician. They sit inside your website, on the page where the patient needs them."
- NOW SHOWING player: Gallstones and robotic gallbladder removal (`/media/gallstones-robotic-gallbladder-removal.mp4`, captions `.vtt`) + "Transcript and sources" link.
- Playlist (6): Gallstones... 03:00 FOR PROF. HEMANT SHETH · Heart attack 02:30 FOR HEARTLINK · Reflux in babies and children 03:04 FOR PROF. HEMANT SHETH · Inguinal hernia 02:54 HERNIA · The Whipple procedure 02:22 HEPATOBILIARY · Chest pain 03:02 CARDIOLOGY.
- Stats: **16** films ready · **75** topics available, across 14 specialties · **ANY** topic made to order. (Consistent with `/topics/` and `/films/`.)
- Hint: "HOVER A FILM TO PREVIEW IT · CLICK FOR THE FULL FILM, TRANSCRIPT AND SOURCES"
- Carousel (16, each -> `/films/<slug>/`, poster `/media/<slug>.jpg` 1280x720):

| # | Duration | Category | Title | Made for |
|---|---|---|---|---|
| 1 | 03:00 | HEPATOBILIARY | Gallstones and robotic gallbladder removal | Prof. Hemant Sheth |
| 2 | 03:00 | HEPATOBILIARY | Robotic bile duct exploration: what to expect | Prof. Hemant Sheth |
| 3 | 02:56 | HEPATOBILIARY | Liver cyst deroofing: keyhole surgery for a simple liver cyst | Prof. Hemant Sheth |
| 4 | 03:07 | UPPER GI | Anti-reflux surgery: repairing the valve | Prof. Hemant Sheth |
| 5 | 03:04 | PAEDIATRICS | Reflux in babies and children | Prof. Hemant Sheth |
| 6 | 02:50 | HERNIA | Hernias of the tummy wall: symptoms and robotic repair | Prof. Hemant Sheth |
| 7 | 02:38 | HERNIA | Complex abdominal wall reconstruction: rebuilding the tummy wall | Prof. Hemant Sheth |
| 8 | 02:54 | HERNIA | Inguinal hernia: symptoms and robotic repair | - |
| 9 | 02:59 | UPPER GI | Large paraoesophageal hernia repair | - |
| 10 | 03:00 | GENERAL SURGERY | Appendicitis and appendicectomy: what to expect | - |
| 11 | 03:01 | GENERAL SURGERY | Diagnostic laparoscopy: a keyhole look inside the tummy | - |
| 12 | 02:50 | HEPATOBILIARY | Pancreatitis: know the signs | - |
| 13 | 02:22 | HEPATOBILIARY | The Whipple procedure: why and how it is done | - |
| 14 | 02:56 | SCREENING | Bowel cancer screening: the home test that could save your life | - |
| 15 | 03:02 | CARDIOLOGY | Chest pain: causes and when to act | - |
| 16 | 02:30 | CARDIOLOGY | Heart attack: know the signs and act fast | HeartLink |

- Closing: "Your specialty not here yet? Tell us the procedure you explain most often and we will script it, or choose from the topic list." CTAs: CHOOSE FROM 75 TOPICS -> `/topics/` · ASK FOR A NEW TOPIC -> `/contact/`.
- Note: source's playlist "Inguinal hernia" (short title) vs carousel full title; both kept.

## S06 presenter
- Eyebrow: YOUR AI PRESENTER. H2: PRESENTED BY YOU, IN YOUR *own voice.*
- Body: "We create an AI clone of you. It appears on camera and narrates the whole film in your voice, so patients meet the consultant they are about to see."
- 01 Consent first: "You sign a consent form before anything is recorded."
- 02 One recording session: "A single short session captures your face and your voice."
- 03 You approve every word: "Your clone only speaks scripts you have reviewed and signed off."
- Disclosure: "Each film says on screen that it is presented by an AI avatar. Your face and voice stay yours, and the clone is deleted on request."
- Toggle: WITH YOUR AI PRESENTER / WITH OUR HOUSE NARRATOR (videos `/media/heart-attack.mp4` poster `/presenter/clone.jpg`; `/presenter/narrated.mp4` poster `/presenter/narrated.jpg`).
- Caption: "Dr Harmandeep Singh's AI clone appears on camera, and his cloned voice narrates the whole film. Made for HeartLink, with his consent."
- Link: HOW THE AI PRESENTER WORKS -> `/ai-presenter/`.
- **Confirm:** Dr Singh's consent covers display on the redesigned site (likeness of a real clinician).

## S07 social
- Eyebrow: SHORTS AND SOCIAL. H2: NOT JUST YOUR WEBSITE. EVERY *platform.*
- Body: "Each film is cut into vertical shorts, and we manage your patient-education content across Instagram, TikTok, YouTube and Facebook, so every channel carries the same clinically approved message."
- Shorts (9:16): 00:35 Know the signs · 00:39 Inside a heart attack · 00:44 Reopening the artery (`/media/short-*.mp4` + jpg). Hint: "HOVER TO PLAY · CLICK FOR SOUND". Caption: "Shorts cut from the heart attack film, made for HeartLink."
- WHERE EACH FILM GOES: INSTAGRAM Reels and Stories 9:16 · TIKTOK Shorts with an opening hook 9:16 · YOUTUBE The full film, plus Shorts 16:9 · 9:16 · FACEBOOK The full film, plus Reels 16:9 · 9:16.
- Included: "Every film reframed for vertical viewing and cut into shorts of 30 to 60 seconds." · "Captions burned in for silent viewing, with your logo and colours." · "Your AI presenter in every format, if you have one." · "A posting plan agreed with you, and nothing published without your sign-off."
- Link: HOW SOCIAL WORKS -> `/social/`.
- Note: source says shorts are "30 to 60 seconds" here and "30 to 45 seconds" on `/work/heartlink/`; both describe different things (policy vs those three). Keep each in place.

## S08 work
- Eyebrow: PORTFOLIO. H2: BUILT, LAUNCHED, *in use.*
- Body: "Work for clients who have agreed to be named. Every film can be watched in full."
- Case 1 -> `/work/prof-hemant-sheth/`: londonroboticsurgeon.co.uk · WEBSITE AND FILMS · PROF. HEMANT SHETH · "Consultant Upper GI, Laparoscopic and Hepatobiliary Surgeon, London" · 22-page website · 7 patient films · Structured data and llms.txt. Media `/shots/sheth.jpg` (1100x3208).
- Case 2 -> `/work/heartlink/`: AI PRESENTER AND SHORTS · HEARTLINK · "Dr Harmandeep Singh, Consultant Cardiologist" · Film presented by his AI clone · 3 vertical shorts · Branded for every platform. Media `/presenter/clone.jpg`.
- Also: 12 SPECIALTY WEBSITE CONCEPTS -> Open the templates `/templates/`.
- **Confirm:** both clients' permission extends to the redesigned site. Concepts stay labelled as concepts, never as client work.

## S09 process
- Eyebrow: HOW IT WORKS. H2: YOU APPROVE. WE DO *the rest.*
- Body: "Your time is one call, one recording session if you want an AI presenter, and two reviews per film: the script, then the final cut."
- STEP 01 A short call: "We learn your specialty, your patients and the procedures you explain most often."
- STEP 02 A plan: "The pages, the film topics and the channels, agreed together as one batch."
- STEP 03 Scripts and design: "Scripts are drafted from NHS, NICE and specialist sources. You review them once and sign them off."
- STEP 04 Production: "We build the site, make the films and, if you want one, record your AI presenter."
- STEP 05 Sign-off and launch: "You approve the final films and pages. Then we publish, and keep your channels supplied."
- Safeguards: Sources named on every film · Nothing published without your sign-off · No patient data, ever · An AI clone only with signed consent.
- Link: The full approach and safeguards -> `/approach/`.

## S10 packages
- Eyebrow: WAYS TO START. H2: THREE WAYS TO *begin.* Sub: "Each is quoted for your practice after a short call."
- OPTION 01 FILMS FOR YOUR SITE: "You already have a website you are happy with." · A batch of films on the procedures you explain most · Each as a 16:9 master, a 9:16 vertical and a short · Transcript and markup for your web team to add · TALK ABOUT THIS -> `/contact/`
- MOST COMPLETE START: WEBSITE WITH FILMS: "You want a site that patients and AI assistants can find." · A GEO-friendly website for your specialty · A film embedded on each procedure page · Structured data, transcripts and llms.txt built in · TALK ABOUT THIS -> `/contact/`
- OPTION 03 FULL MEDIA PARTNER: "You want all of it handled, and kept going." · Website and film library · Your AI presenter, in your own voice · Shorts and channels managed across four platforms · TALK ABOUT THIS -> `/contact/`
- No prices in source. Do not invent any.

## S11 footer
- Eyebrow: A SHORT CALL IS WHERE IT STARTS. H2: LET'S TALK ABOUT *your practice.* (-> `/contact/`)
- CTAs: BOOK A CALL -> `/contact/` · CHOOSE FILM TOPICS -> `/topics/`.
- WHAT WE DO: Websites, Films, AI presenter, Social, Work, All services (`/services/`).
- MORE: Film topics `/topics/`, How we work `/approach/`, Prof. Hemant Sheth, HeartLink.
- CONTACT: Enquire `/contact/`, raghul@cogniversetech.com (mailto), llms.txt `/llms.txt`.
- Legal: "© 2026 COGNIVERSE LIMITED. Registered in England and Wales, company no. 15140913. Plainsight is a studio of CogniVerse." (-> https://cogniversetech.com)
- Disclaimer: "Films are patient education, not medical advice. People shown in the films are AI-generated; clinician clones are made only with signed consent. 3D anatomy derived from Z-Anatomy and BodyParts3D, CC BY-SA 4.0."
- Media: 1 canvas (particle heart).

---

## Enquiry flow (source `/contact/`)
- H1: START WITH A *short call.* "Tell us your specialty and what you would like handled. We come back with a time to talk, and after the call a suggested plan and a quote."
- Fields: YOUR NAME (required) · SPECIALTY · PRACTICE OR HOSPITAL WEBSITE, IF YOU HAVE ONE (url) · WHAT ARE YOU INTERESTED IN? (checkboxes: A new website / Patient films / An AI presenter / Social content) · WHEN IS A GOOD TIME FOR A CALL? · ANYTHING ELSE WE SHOULD KNOW.
- Submit: WRITE THE EMAIL. "This opens a ready-written email in your own mail app, so you can read it before it is sent. Nothing is stored on this site." Alt: OR EMAIL DIRECTLY raghul@cogniversetech.com.
- WHAT HAPPENS NEXT: call; suggested plan with quote; scripts and designs for review.
- Warning: "PLEASE DO NOT SEND PATIENT INFORMATION. We never need it, for an enquiry or for a film."
- Mechanism: no `action`, client-side `mailto:` composition. No backend, no stored data. Honest by design.

## Linked routes (all returned 200)
`/templates/` (+12 specialty templates), `/films/` (+16 film pages), `/ai-presenter/`, `/social/`, `/work/`, `/work/prof-hemant-sheth/`, `/work/heartlink/`, `/contact/`, `/topics/`, `/approach/`, `/services/`, `/llms.txt`.

## Items that need confirmation before publication
1. Public brand: source is "Plainsight Medical, a studio of CogniVerse". Proposed: retain. (proposed)
2. Permission to reuse Plainsight's own media (films, posters, shorts, site captures, `body.bin`) in the redesign. (unresolved)
3. Named-client permission (Prof. Sheth, HeartLink, Dr Singh likeness) for the redesigned site. (unresolved, source says granted for current site)
4. GEO outcome phrasing in S04 (keep verbatim, no strengthening). (proposed)
5. Counts: 16 films / 75 topics / 14 specialties / 22 pages / 7 films / 21 minutes / 46 minutes. Consistent across pages; owner to confirm current. (source-confirmed)
6. Enquiry address raghul@cogniversetech.com remains the destination. (source-confirmed, owner to confirm)

## v2 presentation edits (2026-10-05, user direction: less text, more visual)
Order S00-S11 unchanged; every capability still appears on the page as a title.
- Hero: body cut to one line; "selected work" note removed.
- Offer: service descriptions removed; titles + links remain, the Media Frame shows each service.
- Websites: body cut to one line; GEO explainer paragraph removed (definition kept as one label); principles shown as titles only.
- Films: body and closing cut to one line.
- Presenter: body cut to one line; three steps shown as chips; disclosure kept as one line.
- Social: body one line; platform table replaced by four format chips (full table kept as screen-reader text); inclusions list removed.
- Work: body one line; case notes removed (cases still pending approval).
- Process: body one line; step descriptions removed (titles + numbers remain); safeguards kept.
- Packages: "fit" lines removed; three items per option kept.
- Longer service descriptions remain in `content/site.ts` and are published in `/llms.txt`.
