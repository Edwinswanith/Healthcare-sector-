// Single source of truth for page content. Section order is locked to
// docs/design/healthcare/CONTENT_MAP.md (S00-S11). Copy is adapted from the
// source for the Tech Cogniverse brand; capabilities and order are unchanged.
// Anything awaiting owner confirmation is listed in `pendingClaims`.

export const brand = {
  name: "Tech Cogniverse",
  descriptor: "Healthcare websites, films and digital experiences",
  description:
    "Tech Cogniverse is a creative and technology partner for doctors, clinics and hospitals: websites patients and AI assistants can find, patient-education films, AI-presenter content and social media.",
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Websites", href: "/#websites" },
  { label: "Films", href: "/#films" },
  { label: "AI presenter", href: "/#presenter" },
  { label: "Social", href: "/#social" },
  { label: "Work", href: "/#work" },
];

export const enquire: NavItem = { label: "Enquire", href: "/contact" };

/** Locked order. Rendered and tested in exactly this sequence. */
export const sectionOrder = [
  "header",
  "preloader",
  "hero",
  "offer",
  "websites",
  "films",
  "presenter",
  "social",
  "work",
  "process",
  "packages",
  "footer",
] as const;

export type Headline = { lead: string[]; accent: string };

export const preloader = {
  label: "Assembling anatomy",
  detail: "Procedural particle anatomy",
};

export const hero = {
  eyebrow: ["Websites", "Patient films", "AI presenter", "Social"],
  headline: { lead: ["Your healthcare", "media"], accent: "partner." } as Headline,
  body: "Websites, patient films, AI presenters and social, for doctors, clinics and hospitals.",
  primary: { label: "Book a call", href: "/contact" },
  secondary: { label: "See what we make", href: "#offer" },
  proofLabel: "Selected work",
  proofNote: "Case studies appear once clients approve publication",
  frameLabels: ["Your website", "Your film, inside it", "Your shorts"],
};

export type Service = { index: string; title: string; body: string; link: NavItem; state: FrameState };
export type FrameState = "browser" | "film" | "presenter" | "short" | "answer" | "portfolio";

export const offer = {
  eyebrow: "What we do",
  headline: { lead: ["One partner", "for everything", "your patients"], accent: "see." } as Headline,
  services: [
    { index: "01", title: "Websites", body: "Built for your specialty, and built to be found: on Google, and by the AI assistants patients now ask.", link: { label: "See the websites", href: "#websites" }, state: "browser" },
    { index: "02", title: "Patient films", body: "Two to three minutes in plain English, embedded on the page where the patient needs them.", link: { label: "Watch the films", href: "#films" }, state: "film" },
    { index: "03", title: "Your AI presenter", body: "An AI clone of you presents each film with your own face and voice, from one recording session.", link: { label: "See it working", href: "#presenter" }, state: "presenter" },
    { index: "04", title: "Social content", body: "Every film cut into shorts, and your channels managed across Instagram, TikTok, YouTube and Facebook.", link: { label: "See the shorts", href: "#social" }, state: "short" },
  ] as Service[],
};

export type Specialty = {
  slug: string;
  short: string;
  name: string;
  organ: string;
  style: "Serif, classic" | "Grotesque, structured" | "Tinted, editorial";
  description: string;
  palette: { bg: string; ink: string; accent: string };
  hero: string;
};

export const specialties: Specialty[] = [
  { slug: "cardiology", short: "Cardiology", name: "Cardiology", organ: "Heart", style: "Serif, classic", description: "A calm, serious site that leads with urgency rules: when to call emergency services, when to book.", palette: { bg: "#F6F1EA", ink: "#2A1418", accent: "#B3262E" }, hero: "Clear answers about your heart." },
  { slug: "orthopaedics", short: "Orthopaedics", name: "Orthopaedics", organ: "Knee joint", style: "Grotesque, structured", description: "A bright, structured site built around recovery timelines and return to sport.", palette: { bg: "#EEF3F8", ink: "#0F2238", accent: "#1F6FEB" }, hero: "Back to the things you love doing." },
  { slug: "neurology", short: "Neurology", name: "Neurology", organ: "Brain", style: "Serif, classic", description: "Quiet and unhurried, for patients who arrive anxious and need things explained slowly.", palette: { bg: "#F1EFF6", ink: "#221A3A", accent: "#6A4FC9" }, hero: "Explained slowly, and clearly." },
  { slug: "ophthalmology", short: "Ophthalmology", name: "Ophthalmology", organ: "Eye", style: "Grotesque, structured", description: "Large type, strong contrast and short pages, designed for people who cannot see well.", palette: { bg: "#FFFFFF", ink: "#000000", accent: "#0050C8" }, hero: "Big type. Clear sight." },
  { slug: "respiratory", short: "Respiratory", name: "Respiratory medicine", organ: "Lungs", style: "Tinted, editorial", description: "Airy and open, with room for breathing tests and results to be explained properly.", palette: { bg: "#E9F4F2", ink: "#123B37", accent: "#1A9C8C" }, hero: "Room to breathe." },
  { slug: "upper-gi-hpb", short: "Upper GI", name: "Upper GI and HPB surgery", organ: "Gallbladder", style: "Tinted, editorial", description: "Warm and editorial, with a film on every procedure page.", palette: { bg: "#F7EFE6", ink: "#3A1F12", accent: "#C8642B" }, hero: "Every operation, explained." },
  { slug: "urology", short: "Urology", name: "Urology", organ: "Kidney", style: "Serif, classic", description: "Discreet and matter-of-fact, for topics people put off asking about.", palette: { bg: "#F2F2EE", ink: "#1E2A22", accent: "#3C7A52" }, hero: "The questions people put off." },
  { slug: "colorectal", short: "Colorectal", name: "Colorectal surgery", organ: "Bowel", style: "Grotesque, structured", description: "Plain-spoken and reassuring, with screening and red-flag symptoms up front.", palette: { bg: "#F5F3EC", ink: "#2B2414", accent: "#9C6B14" }, hero: "Plain-spoken. Reassuring." },
  { slug: "spinal-surgery", short: "Spinal", name: "Spinal surgery", organ: "Spine", style: "Serif, classic", description: "Measured and honest, because most back pain does not need an operation.", palette: { bg: "#EFF0F2", ink: "#1C2230", accent: "#4C5D80" }, hero: "Most back pain needs no operation." },
  { slug: "ent-maxillofacial", short: "ENT", name: "ENT and maxillofacial", organ: "Ear", style: "Tinted, editorial", description: "Family-friendly, with separate routes for adults and for parents of young children.", palette: { bg: "#FFF4E8", ink: "#3A2410", accent: "#E07A1F" }, hero: "For adults, and for parents." },
  { slug: "hand-and-wrist", short: "Hand", name: "Hand and wrist surgery", organ: "Hand", style: "Grotesque, structured", description: "Compact and practical: common conditions, day-case surgery, and therapy afterwards.", palette: { bg: "#F0F4EF", ink: "#16261A", accent: "#3E8E4F" }, hero: "Back in your hands." },
  { slug: "private-gp", short: "Private GP", name: "Private GP and health screening", organ: "Health check", style: "Tinted, editorial", description: "Welcoming and service-led: appointments, health checks and referral routes.", palette: { bg: "#F4F0F6", ink: "#2A1A2E", accent: "#A2457A" }, hero: "Appointments that start on time." },
];

export const websites = {
  eyebrow: "Websites",
  headline: { lead: ["Websites that", "get"], accent: "found." } as Headline,
  body: "Pick a specialty. Watch it build.",
  notListed: { label: "Not listed?", href: "/contact" },
  conceptLabel: "Concept",
  panelCta: "Ask for this concept",
  geo: {
    eyebrow: "GEO-friendly, in plain words",
    question: "Is it normal for my baby to bring up milk?",
    answer: "Lots of babies bring up milk after a feed. It can be worrying, but for most babies it's normal, and it gets better with time.",
    citation: { site: "yourpractice.com", title: "Reflux in babies: film and transcript" },
    caption: "Illustration. The answer is quoted from our film transcript.",
    lead: "When a patient asks an assistant, it names the clinician it can read, check and quote.",
    explainer: "GEO means generative engine optimisation: being the clinician that ChatGPT, Gemini or Perplexity names. Every site we build is made for that, as well as for Google.",
    principles: [
      { index: "01", title: "Readable", body: "Every film ships with its full transcript, so what you say on screen exists as text an assistant can read." },
      { index: "02", title: "Checkable", body: "Your registration number, appointments and hospitals stated once, consistently, with the sources behind each page named." },
      { index: "03", title: "Structured", body: "Markup that tells a machine this is a physician, this is a procedure, this is a film and how long it runs." },
      { index: "04", title: "Open", body: "Crawl rules and an llms.txt file that let AI assistants in, rather than blocking them by default." },
      { index: "05", title: "Watched", body: "A regular check of what Google and the main assistants actually say when asked about you." },
    ],
  },
};

export type Film = { duration: string; category: string; title: string; organ: "heart" | "gut" | "body" | "child" | "chest" };

export const films = {
  eyebrow: "The film library",
  headline: { lead: ["A library for your", "specialty. Or we", "make"], accent: "yours." } as Headline,
  body: "Two to three minutes. Plain English. Signed off by the clinician.",
  nowShowing: "Now showing",
  stats: [
    { value: "16", label: "films ready" },
    { value: "75", label: "topics available, across 14 specialties" },
    { value: "ANY", label: "topic made to order" },
  ],
  hint: "Hover or focus a film to preview it",
  library: [
    { duration: "03:00", category: "Hepatobiliary", title: "Gallstones and robotic gallbladder removal", organ: "gut" },
    { duration: "03:00", category: "Hepatobiliary", title: "Robotic bile duct exploration: what to expect", organ: "gut" },
    { duration: "02:56", category: "Hepatobiliary", title: "Liver cyst deroofing: keyhole surgery for a simple liver cyst", organ: "gut" },
    { duration: "03:07", category: "Upper GI", title: "Anti-reflux surgery: repairing the valve", organ: "gut" },
    { duration: "03:04", category: "Paediatrics", title: "Reflux in babies and children", organ: "child" },
    { duration: "02:50", category: "Hernia", title: "Hernias of the tummy wall: symptoms and robotic repair", organ: "body" },
    { duration: "02:38", category: "Hernia", title: "Complex abdominal wall reconstruction: rebuilding the tummy wall", organ: "body" },
    { duration: "02:54", category: "Hernia", title: "Inguinal hernia: symptoms and robotic repair", organ: "body" },
    { duration: "02:59", category: "Upper GI", title: "Large paraoesophageal hernia repair", organ: "gut" },
    { duration: "03:00", category: "General surgery", title: "Appendicitis and appendicectomy: what to expect", organ: "body" },
    { duration: "03:01", category: "General surgery", title: "Diagnostic laparoscopy: a keyhole look inside the tummy", organ: "body" },
    { duration: "02:50", category: "Hepatobiliary", title: "Pancreatitis: know the signs", organ: "gut" },
    { duration: "02:22", category: "Hepatobiliary", title: "The Whipple procedure: why and how it is done", organ: "gut" },
    { duration: "02:56", category: "Screening", title: "Bowel cancer screening: the home test that could save your life", organ: "body" },
    { duration: "03:02", category: "Cardiology", title: "Chest pain: causes and when to act", organ: "chest" },
    { duration: "02:30", category: "Cardiology", title: "Heart attack: know the signs and act fast", organ: "heart" },
  ] as Film[],
  closing: "Not here yet? We script it.",
  ctas: [
    { label: "Ask for the topic list", href: "/contact?interest=films" },
    { label: "Ask for a new topic", href: "/contact?interest=films" },
  ],
};

export const presenter = {
  eyebrow: "Your AI presenter",
  headline: { lead: ["Presented by you,", "in your"], accent: "own voice." } as Headline,
  body: "Your face and voice, from one session. Only with your consent.",
  steps: [
    { index: "01", title: "Consent first", body: "You sign a consent form before anything is recorded." },
    { index: "02", title: "One recording session", body: "A single short session captures your face and your voice." },
    { index: "03", title: "You approve every word", body: "Your clone only speaks scripts you have reviewed and signed off." },
  ],
  disclosure: "Every film is labelled as presented by an AI avatar.",
  toggle: ["With your AI presenter", "With our house narrator"],
  caption: "Example layout. Real presenter films are shown only with the clinician's consent.",
};

export const social = {
  eyebrow: "Shorts and social",
  headline: { lead: ["Not just your", "website. Every"], accent: "platform." } as Headline,
  body: "One film, cut for every feed.",
  shorts: [
    { duration: "00:35", title: "Know the signs" },
    { duration: "00:39", title: "Inside a heart attack" },
    { duration: "00:44", title: "Reopening the artery" },
  ],
  caption: "Example layout: three shorts cut from one film.",
  platforms: [
    { name: "Instagram", use: "Reels and Stories", format: "9:16" },
    { name: "TikTok", use: "Shorts with an opening hook", format: "9:16" },
    { name: "YouTube", use: "The full film, plus Shorts", format: "16:9 · 9:16" },
    { name: "Facebook", use: "The full film, plus Reels", format: "16:9 · 9:16" },
  ],
  included: [
    "Every film reframed for vertical viewing and cut into shorts of 30 to 60 seconds.",
    "Captions burned in for silent viewing, with your logo and colours.",
    "Your AI presenter in every format, if you have one.",
    "A posting plan agreed with you, and nothing published without your sign-off.",
  ],
};

export const work = {
  eyebrow: "Portfolio",
  headline: { lead: ["Built, launched,"], accent: "in use." } as Headline,
  body: "Shown only with client approval.",
  cases: [
    { index: "Case study 01", kind: "Website and films", status: "Awaiting client approval", note: "A specialist surgeon's multi-page website with a patient film for each procedure, plus structured data and llms.txt." },
    { index: "Case study 02", kind: "AI presenter and shorts", status: "Awaiting client approval", note: "A cardiologist's patient film presented by their AI clone, with consent, cut into vertical shorts for every platform." },
  ],
  concepts: { label: "Also", title: "12 specialty website concepts", link: { label: "Browse the concepts", href: "#websites" } },
};

export const process = {
  eyebrow: "How it works",
  headline: { lead: ["You approve.", "We do"], accent: "the rest." } as Headline,
  body: "One call. Two reviews per film. Nothing goes live without your signature.",
  steps: [
    { index: "Step 01", title: "A short call", body: "We learn your specialty, your patients and the procedures you explain most often." },
    { index: "Step 02", title: "A plan", body: "The pages, the film topics and the channels, agreed together as one batch." },
    { index: "Step 03", title: "Scripts and design", body: "Scripts are drafted from recognised clinical and specialist sources. You review them once and sign them off." },
    { index: "Step 04", title: "Production", body: "We build the site, make the films and, if you want one, record your AI presenter." },
    { index: "Step 05", title: "Sign-off and launch", body: "You approve the final films and pages. Then we publish, and keep your channels supplied." },
  ],
  safeguards: [
    "Sources named on every film",
    "Nothing published without your sign-off",
    "No patient data, ever",
    "An AI clone only with signed consent",
  ],
};

export const packages = {
  eyebrow: "Ways to start",
  headline: { lead: ["Three ways to"], accent: "begin." } as Headline,
  sub: "Quoted after a short call.",
  options: [
    { tag: "Option 01", title: "Films for your site", fit: "You already have a website you are happy with.", items: ["A batch of films on the procedures you explain most", "Each as a 16:9 master, a 9:16 vertical and a short", "Transcript and markup for your web team to add"], featured: false },
    { tag: "Most complete start", title: "Website with films", fit: "You want a site that patients and AI assistants can find.", items: ["A GEO-friendly website for your specialty", "A film embedded on each procedure page", "Structured data, transcripts and llms.txt built in"], featured: true },
    { tag: "Option 03", title: "Full media partner", fit: "You want all of it handled, and kept going.", items: ["Website and film library", "Your AI presenter, in your own voice", "Shorts and channels managed across four platforms"], featured: false },
  ],
  cta: { label: "Talk about this", href: "/contact" },
};

export const footer = {
  eyebrow: "A short call is where it starts",
  headline: { lead: ["Let's talk about"], accent: "your practice." } as Headline,
  ctas: [
    { label: "Book a call", href: "/contact" },
    { label: "Ask about film topics", href: "/contact?interest=films" },
  ],
  columns: [
    { title: "What we do", links: [{ label: "Websites", href: "/#websites" }, { label: "Films", href: "/#films" }, { label: "AI presenter", href: "/#presenter" }, { label: "Social", href: "/#social" }, { label: "Work", href: "/#work" }, { label: "All services", href: "/#offer" }] },
    { title: "More", links: [{ label: "How we work", href: "/#process" }, { label: "Ways to start", href: "/#packages" }, { label: "llms.txt", href: "/llms.txt" }] },
    { title: "Contact", links: [{ label: "Enquire", href: "/contact" }] },
  ],
  legal: `© ${2026} Tech Cogniverse.`,
  disclaimer: "Patient-education films are not medical advice. People shown in example films are AI-generated; clinician clones are made only with signed consent.",
};

/** Source statements kept on the page that the owner must confirm before production. */
export const pendingClaims = [
  "Film library counts: 16 films ready, 75 topics across 14 specialties (from the content reference).",
  "Process: scripts drafted from recognised clinical guidance and clinician sign-off.",
  "AI presenter: one recording session, deletion on request.",
  "Social: shorts of 30 to 60 seconds, four managed platforms.",
];
