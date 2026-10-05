"use client";

import { useEffect, useRef } from "react";

// A real-time shaded 3D heart: sphere-traced signed-distance shape (a deformed
// sphere for the ventricles plus capsules for the great vessels), glossy
// lighting, fake subsurface glow, procedural coronary veins and a heartbeat.
// One small canvas, rendered at reduced resolution, only while on screen.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uRotY; uniform float uRotX; uniform float uBeat;
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float noise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float body(vec3 p){
  float s = 1.0 + 0.045 * uBeat;
  p /= s;
  vec3 q = p;
  q.xy *= rot(0.35);
  q.y = -0.1 - q.y * 1.2 + abs(q.x) * (1.0 - abs(q.x));
  float h = (length(vec3(q.x, q.y, q.z * 1.25)) - 0.5) * 0.6;
  float aorta = sdCapsule(p, vec3(0.05, 0.25, -0.02), vec3(0.12, 0.62, 0.0), 0.085);
  float arch = sdCapsule(p, vec3(0.12, 0.62, 0.0), vec3(0.38, 0.55, -0.06), 0.075);
  float pulm = sdCapsule(p, vec3(-0.12, 0.22, 0.08), vec3(-0.2, 0.55, 0.1), 0.07);
  float v1 = sdCapsule(p, vec3(0.02, 0.5, 0.0), vec3(-0.02, 0.78, 0.0), 0.035);
  float v2 = sdCapsule(p, vec3(0.2, 0.6, 0.0), vec3(0.22, 0.82, -0.02), 0.03);
  float d = smin(h, smin(aorta, arch, 0.05), 0.08);
  d = smin(d, pulm, 0.07);
  d = smin(d, min(v1, v2), 0.03);
  return d * s;
}
float map(vec3 p){
  p.yz *= rot(uRotX);
  p.xz *= rot(uRotY);
  return body(p);
}
vec3 normal(vec3 p){ vec2 e = vec2(0.0015, 0.0); return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx))); }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.12, 2.9), rd = normalize(vec3(uv, -1.75));
  float t = 0.0, d = 1.0; bool hit = false; float steps = 0.0;
  for (int i = 0; i < 90; i++) { vec3 p = ro + rd * t; d = map(p); steps += 1.0; if (d < 0.0012) { hit = true; break; } t += d * 0.8; if (t > 5.0) break; }
  vec4 col = vec4(0.0);
  if (hit) {
    vec3 p = ro + rd * t; vec3 n = normal(p); vec3 v = -rd;
    vec3 lp = normalize(vec3(-0.6, 0.8, 0.9));
    float dif = max(dot(n, lp), 0.0);
    float spec = pow(max(dot(reflect(-lp, n), v), 0.0), 48.0);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 q = p; q.yz *= rot(uRotX); q.xz *= rot(uRotY);
    float n1 = noise(q * 4.5 + vec3(0.0, uTime * 0.04, 0.0)) + 0.5 * noise(q * 9.0);
    float vein = 1.0 - smoothstep(0.0, 0.035, abs(n1 - 0.75));
    vein *= smoothstep(0.2, 0.6, q.y + 0.4);
    float ao = clamp(1.0 - steps / 70.0, 0.25, 1.0);
    vec3 deep = vec3(0.24, 0.03, 0.06), warm = vec3(0.86, 0.24, 0.16), glow = vec3(1.0, 0.62, 0.42);
    vec3 c = mix(deep, warm, pow(dif, 1.3) * 0.9 + 0.05) * (0.55 + 0.45 * ao);
    c = mix(c, glow, vein * 0.6);
    c += vec3(1.0, 0.45, 0.3) * fres * (0.7 + 0.5 * uBeat);
    c += vec3(1.0, 0.92, 0.85) * spec * 0.5;
    c += vec3(0.95, 0.94, 0.9) * pow(max(dot(n, normalize(vec3(0.8, -0.2, 0.6))), 0.0), 3.0) * 0.12;
    col = vec4(c, 1.0);
  } else {
    float g = exp(-6.0 * max(d, 0.0)) * 0.35 * (0.7 + 0.6 * uBeat);
    col = vec4(vec3(0.9, 0.28, 0.18) * g, g);
  }
  gl_FragColor = col;
}`;

export function HeartGL({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) { canvas.style.display = "none"; return; }
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uRotY = U("uRotY"), uRotX = U("uRotX"), uBeat = U("uBeat");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = 0.75;
    let lastDraw = 0;
    let visible = false, raf = 0;
    const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
    const t0 = performance.now();
    const resize = () => {
      const w = Math.round(canvas.clientWidth * scale), h = Math.round(canvas.clientHeight * scale);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const frame = (now = performance.now()) => {
      raf = 0;
      if (now - lastDraw < 32) { if (visible && !reduce) raf = requestAnimationFrame(frame); return; }
      lastDraw = now;
      resize();
      const t = (performance.now() - t0) / 1000;
      pointer.cx += (pointer.x - pointer.cx) * 0.06;
      pointer.cy += (pointer.y - pointer.cy) * 0.06;
      const r = canvas.getBoundingClientRect();
      const scrollTurn = (r.top / window.innerHeight) * 1.2;
      const beat = reduce ? 0 : Math.pow(Math.max(0, Math.sin(t * 5.4)), 10) + 0.6 * Math.pow(Math.max(0, Math.sin(t * 5.4 - 0.7)), 14);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uRotY, (reduce ? 0.4 : t * 0.25) + pointer.cx * 0.8 + scrollTurn);
      gl.uniform1f(uRotX, -0.1 + pointer.cy * 0.35);
      gl.uniform1f(uBeat, beat);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => { pointer.x = e.clientX / window.innerWidth - 0.5; pointer.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <canvas ref={ref} className={`heart-gl ${className}`} aria-hidden="true" />;
}
