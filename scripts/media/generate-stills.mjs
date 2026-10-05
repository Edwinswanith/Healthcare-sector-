// Server-side still generation (Gemini image models). Never shipped to the browser.
// Usage: node scripts/media/generate-stills.mjs <id> [attempt]
// Credentials: GEMINI_API_KEY from the environment, or the session proxy if it injects one.
// Every request is logged to docs/design/healthcare/ASSET_LOG.json (no secrets logged).
import fs from "fs";

const MODEL = process.env.GEN_MODEL || "gemini-3-pro-image";
const STYLE =
  "Cinematic editorial photograph, 35mm, shallow depth of field, soft directional light. Colour palette: deep navy-ink shadows, warm bone-cream highlights, one small signal red-orange accent. Calm, premium, clinical but human. No text, no letters, no logos, no signage, no watermarks, no readable screens. No identifiable faces.";

const LETTER = "Pure black ink on a pure white background, nothing else in the image: no paper texture, no shadow, no other marks, no border. Centered with generous margins. Very high contrast.";

const EDIT = "Keep the exact same framing, camera, pose, proportions and position of every element so the result aligns pixel-for-pixel with the input image.";

export const BRIEFS = {
  "h-portrait": { aspect: "16:9", style: "Photoreal editorial portrait photography, 85mm, soft studio light. No text, no logos, no watermark.", prompt: "A calm, trustworthy clinician in their forties, wearing a dark navy blazer over a white shirt, facing the camera directly with a gentle confident expression. Head and shoulders bust, perfectly centred, the head in the upper-middle of the frame and the shoulders cut off by the bottom edge, filling about 80% of the frame height. Isolated on a perfectly flat, uniform warm off-white background (#F3F0E8), no shadow on the background, no props." },
  "h-matte": { aspect: "16:9", input: "media-src/gen/h-portrait-1.jpg", style: EDIT, prompt: "Create a clean segmentation matte of this image: the person (including hair and clothing) pure white, the background pure black. No grey except soft anti-aliased edges. No other content." },
  "h-depth": { aspect: "16:9", input: "media-src/gen/h-portrait-1.jpg", style: EDIT, prompt: "Create a smooth grayscale depth map of this image: nearest points (nose, face) white, further points darker, background pure black. Soft gradients, no texture, no text." },
  "h-anatomy": { aspect: "16:9", input: "media-src/gen/h-portrait-1.jpg", style: EDIT, prompt: "Render the same person as a translucent anatomical medical hologram: skin and clothing become frosted cream glass with soft edges, inside the chest a glowing red-orange anatomical heart with the great vessels and branching blood vessels, faint elegant ribcage and collarbone lines, subtle network of vessels in the neck, calm and beautiful, not gory. Same off-white background (#F3F0E8)." },
  "g-heart3d": { aspect: "16:9", style: "Photoreal medical visualisation, studio product photography lighting. No text, no labels, no logos, no watermark.", prompt: "A photoreal anatomical human heart, medical-illustration accuracy: aorta and aortic arch, pulmonary trunk, superior vena cava, clearly visible coronary arteries and veins on the surface, glossy moist tissue with subtle subsurface glow. Seen from the front, perfectly centred, occupying about 55% of the frame height, isolated on a perfectly uniform flat deep navy background (#0D1524), no floor, no shadow, no reflection, no particles. Warm key light from upper left, a red-orange rim light from behind." },
  "l-madeclear": { aspect: "21:9", style: LETTER, prompt: "Confident hand lettering of the words \"made clear\" in flowing connected brush-pen script, lowercase, expressive thick-and-thin strokes, slight forward slant, one continuous signature-like flourish underlining the words." },
  "l-plainenglish": { aspect: "21:9", style: LETTER, prompt: "Hand lettering of the words \"in plain English\" in fast, loose connected brush-pen script, lowercase except the E, energetic thick-and-thin strokes." },
  "l-approved": { aspect: "21:9", style: LETTER, prompt: "A handwritten signature-style word \"approved\" written quickly with a brush pen, connected script, lowercase, with a confident underline stroke and a small tick at the end." },
  "l-letstalk": { aspect: "21:9", style: LETTER, prompt: "Hand lettering of the words \"let's talk\" in bold expressive connected brush script, lowercase, with a swooping tail on the k." },
  "l-found": { aspect: "21:9", style: LETTER, prompt: "Hand lettering of the single word \"found\" in bold expressive connected brush script, lowercase, with a looping flourish from the d." },
  "g-desk": { aspect: "16:9", prompt: "Close-up of a hand holding a red pen and signing the final page of a printed script on a warm wooden desk at night, a laptop glowing softly out of focus, papers with illegible blurred lines. Only the hand and forearm in frame." },
  "g-edit": { aspect: "16:9", prompt: "A dark film editing suite: two monitors showing an abstract glowing anatomy animation and a colourful video timeline, a keyboard and a jog wheel in the foreground, nobody in frame, cinematic low light." },
  "g-glassheart": { aspect: "16:9", prompt: "A sculptural anatomical heart made of frosted glass on a dark navy plinth in a gallery, lit from inside with a warm red-orange glow, soft reflections, minimal composition with negative space on the left." },
  "g-room": { aspect: "16:9", prompt: "An empty private medical consulting room at dusk. Two upholstered chairs facing a clean desk, a desk lamp glowing warm, a large monitor showing a soft out-of-focus anatomical heart render in red-orange light, tall window with blue-hour sky. Wide composition, generous calm negative space on the left third." },
  "g-hands": { aspect: "16:9", prompt: "Close-up of a surgeon's gloved hands holding a slim tablet in a dim operating theatre; the tablet shows a glowing abstract point-cloud anatomy render, no interface text. Blurred surgical lights in the background, cool navy tones with a warm rim light." },
  "g-phone": { aspect: "16:9", prompt: "Close-up from directly behind and slightly above: a person's hands and a smartphone held at chest height on a dark sofa at night; we see only the hands, the phone and a soft knitted sleeve, no head and no face in frame. The phone screen glows with an abstract red-orange anatomy shape. Dark living room, warm lamp far in the background." },
  "g-studio": { aspect: "16:9", prompt: "An empty small video production studio prepared for recording a doctor's presentation: cinema camera on a tripod, teleprompter glass, a single chair, soft key light, deep navy seamless backdrop, one small red-orange recording light. No people." },
  "g-clinic": { aspect: "16:9", prompt: "Exterior of a modern private clinic building at blue hour, clean architectural lines, warm light glowing from tall windows, wet pavement reflections, a few soft bokeh lights. No signage, no text, no people in focus." },
  "g-theatre": { aspect: "16:9", prompt: "A modern empty operating theatre, dramatic overhead surgical lights switched on, symmetric composition, cool navy ambience with a subtle red-orange accent light, reflective floor, cinematic haze. No people." },
};

async function run(id, attempt = 1) {
  const b = BRIEFS[id];
  if (!b) throw new Error(`unknown id ${id}`);
  const fullPrompt = `${b.prompt} ${b.style ?? STYLE}`;
  const parts = [{ text: fullPrompt }];
  if (b.input) parts.push({ inlineData: { mimeType: "image/jpeg", data: fs.readFileSync(b.input).toString("base64") } });
  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: b.aspect, imageSize: "2K" } },
  };
  const headers = { "content-type": "application/json" };
  if (process.env.GEMINI_API_KEY) headers["x-goog-api-key"] = process.env.GEMINI_API_KEY;
  const t0 = Date.now();
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(180000) });
  const json = await res.json();
  const entry = { id, attempt, model: MODEL, status: res.status, ms: Date.now() - t0, at: new Date().toISOString(), aspect: b.aspect, size: "2K", prompt: fullPrompt, input: b.input ?? null, usage: json.usageMetadata ?? null, modelVersion: json.modelVersion ?? null, responseId: json.responseId ?? null };
  let saved = null;
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (res.ok && part) {
    const ext = part.inlineData.mimeType === "image/jpeg" ? "jpg" : "png";
    saved = `media-src/gen/${id}-${attempt}.${ext}`;
    fs.writeFileSync(saved, Buffer.from(part.inlineData.data, "base64"));
  } else {
    entry.error = json.error?.message ?? json.candidates?.[0]?.finishReason ?? "no image part";
  }
  entry.file = saved;
  const logPath = "docs/design/healthcare/ASSET_LOG.json";
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : [];
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 1));
  console.log(JSON.stringify({ id, attempt, status: res.status, file: saved, usage: entry.usage, error: entry.error }));
}

const [id, attempt] = process.argv.slice(2);
if (id) await run(id, Number(attempt ?? 1));
