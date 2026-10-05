// Server-side Veo generation. Never shipped to the browser.
// Usage: NODE_USE_ENV_PROXY=1 node scripts/media/generate-video.mjs <id> [attempt]
// Submits ONE long-running job, polls with a bounded loop (no automatic resubmits),
// downloads the result into media-src/gen/, and logs everything to ASSET_LOG.json.
import fs from "fs";

const MODEL = process.env.VEO_MODEL || "veo-3.1-fast-generate-preview";
const API = "https://generativelanguage.googleapis.com/v1beta";
const STYLE = "Cinematic, premium, calm. Deep navy-ink background and shadows, warm bone-cream highlights, one red-orange accent. Smooth slow camera motion, no cuts. No text, no captions, no logos, no watermarks.";
const NEG = "text, captions, subtitles, logos, watermark, gore, blood, surgery footage, distorted anatomy, extra fingers, flicker, jump cut";

export const BRIEFS = {
  "v-film": { aspect: "16:9", prompt: "A polished 3D medical explainer animation: a slow orbit around a translucent stylised human digestive system floating in darkness, the liver and stomach rendered as soft glassy forms, the gallbladder glowing red-orange, gentle volumetric light, tiny floating particles." },
  "v-presenter": { aspect: "16:9", prompt: "A friendly middle-aged clinician in a navy blazer sits in a softly lit studio with a deep navy backdrop and speaks calmly to camera, natural small hand gestures, shallow depth of field, a warm key light and a subtle red-orange rim light. Medium shot, locked-off camera with a very slow push-in." },
  "v-short": { aspect: "9:16", prompt: "Vertical close-up of a stylised 3D anatomical human heart slowly beating, glossy red-orange surface with soft subsurface glow, floating in deep navy darkness with fine particles, slow rotation." },
};

const headers = () => {
  const h = { "content-type": "application/json" };
  if (process.env.GEMINI_API_KEY) h["x-goog-api-key"] = process.env.GEMINI_API_KEY;
  return h;
};
const logPath = "docs/design/healthcare/ASSET_LOG.json";
const log = (e) => {
  const l = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : [];
  l.push(e);
  fs.writeFileSync(logPath, JSON.stringify(l, null, 1));
};

async function run(id, attempt = 1) {
  const b = BRIEFS[id];
  if (!b) throw new Error(`unknown id ${id}`);
  const prompt = `${b.prompt} ${STYLE}`;
  const body = { instances: [{ prompt }], parameters: { aspectRatio: b.aspect, durationSeconds: 8, negativePrompt: NEG } };
  const t0 = Date.now();
  const res = await fetch(`${API}/models/${MODEL}:predictLongRunning`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  const op = await res.json();
  const entry = { id, attempt, model: MODEL, kind: "video", aspect: b.aspect, durationSeconds: 8, prompt, negativePrompt: NEG, submitStatus: res.status, operation: op.name ?? null, at: new Date().toISOString() };
  if (!res.ok || !op.name) {
    entry.error = op.error?.message ?? "no operation";
    log(entry);
    console.log(JSON.stringify({ id, status: res.status, error: entry.error }));
    return;
  }
  console.log(JSON.stringify({ id, submitted: op.name }));
  // Bounded polling: every 10 s, at most 8 minutes. Never resubmits.
  let done = null;
  for (let i = 0; i < 48; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const pr = await fetch(`${API}/${op.name}`, { headers: headers() });
    const pj = await pr.json();
    if (pj.done) { done = pj; break; }
  }
  entry.ms = Date.now() - t0;
  if (!done) {
    entry.error = "polling timed out; job may still finish: re-check the operation, do not resubmit";
    log(entry);
    console.log(JSON.stringify({ id, error: entry.error, operation: op.name }));
    return;
  }
  if (done.error) {
    entry.error = done.error.message;
    log(entry);
    console.log(JSON.stringify({ id, error: entry.error }));
    return;
  }
  const sample = done.response?.generateVideoResponse?.generatedSamples?.[0];
  const uri = sample?.video?.uri;
  entry.filtered = done.response?.generateVideoResponse?.raiMediaFilteredReasons ?? null;
  if (!uri) {
    entry.error = "no video in response";
    entry.response = JSON.stringify(done.response ?? {}).slice(0, 800);
    log(entry);
    console.log(JSON.stringify({ id, error: entry.error, filtered: entry.filtered }));
    return;
  }
  const vr = await fetch(uri, { headers: headers(), redirect: "follow" });
  const buf = Buffer.from(await vr.arrayBuffer());
  const file = `media-src/gen/${id}-${attempt}.mp4`;
  fs.writeFileSync(file, buf);
  entry.file = file;
  entry.bytes = buf.length;
  log(entry);
  console.log(JSON.stringify({ id, file, bytes: buf.length, ms: entry.ms }));
}

const [id, attempt] = process.argv.slice(2);
if (id) await run(id, Number(attempt ?? 1));
