// Server-side still generation (Gemini image models). Never shipped to the browser.
// Usage: node scripts/media/generate-stills.mjs <id> [attempt]
// Credentials: GEMINI_API_KEY from the environment, or the session proxy if it injects one.
// Every request is logged to docs/design/healthcare/ASSET_LOG.json (no secrets logged).
import fs from "fs";

const MODEL = process.env.GEN_MODEL || "gemini-3-pro-image";
const STYLE =
  "Cinematic editorial photograph, 35mm, shallow depth of field, soft directional light. Colour palette: deep navy-ink shadows, warm bone-cream highlights, one small signal red-orange accent. Calm, premium, clinical but human. No text, no letters, no logos, no signage, no watermarks, no readable screens. No identifiable faces.";

export const BRIEFS = {
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
  const body = {
    contents: [{ role: "user", parts: [{ text: `${b.prompt} ${STYLE}` }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: b.aspect, imageSize: "2K" } },
  };
  const headers = { "content-type": "application/json" };
  if (process.env.GEMINI_API_KEY) headers["x-goog-api-key"] = process.env.GEMINI_API_KEY;
  const t0 = Date.now();
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(180000) });
  const json = await res.json();
  const entry = { id, attempt, model: MODEL, status: res.status, ms: Date.now() - t0, at: new Date().toISOString(), aspect: b.aspect, size: "2K", prompt: `${b.prompt} ${STYLE}`, usage: json.usageMetadata ?? null, modelVersion: json.modelVersion ?? null, responseId: json.responseId ?? null };
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
