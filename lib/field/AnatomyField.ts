// Raw WebGL point renderer for the Anatomy Field. One canvas, one program,
// one VBO per target cloud. Morphing is done in the vertex shader by binding
// the "from" and "to" buffers, so switching pairs costs no uploads.
import { bodyCloud, driftCloud, heartCloud, scatterCloud, type Cloud } from "./shapes";

export type FieldKey = "body" | "drift" | "heart" | "scatter";

export type FieldState = {
  from: FieldKey;
  to: FieldKey;
  mix: number;
  assemble: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  alpha: number;
  /** 0 = paper theme (ink points), 1 = ink theme (paper points). */
  theme: number;
  beat: number;
};

const VERT = `
attribute vec3 aFrom; attribute vec3 aTo; attribute vec3 aScatter;
attribute float aAccFrom; attribute float aAccTo; attribute float aRand;
uniform float uMix, uAssemble, uTime, uScale, uSize, uDpr, uRot, uTilt, uBeat;
uniform vec2 uOffset; uniform mat4 uProj;
varying float vAcc; varying float vAlpha;
void main(){
  float d = aRand * 0.45;
  float m = smoothstep(d, d + 0.55, uMix);
  vec3 p = mix(aFrom, aTo, m);
  float arc = sin(m * 3.14159);
  p += vec3(sin(aRand * 40.0 + uTime * 0.6), cos(aRand * 31.0 + uTime * 0.5), sin(aRand * 17.0)) * arc * 0.22;
  float a = smoothstep(d, d + 0.55, uAssemble);
  p = mix(aScatter, p, a);
  p += vec3(sin(uTime * 0.7 + aRand * 50.0), cos(uTime * 0.6 + aRand * 70.0), sin(uTime * 0.5 + aRand * 30.0)) * 0.005;
  float acc = mix(aAccFrom, aAccTo, m);
  p *= 1.0 + acc * uBeat * 0.05;
  p *= uScale;
  float c = cos(uRot), s = sin(uRot);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  float ct = cos(uTilt), st = sin(uTilt);
  p = vec3(p.x, ct * p.y - st * p.z, st * p.y + ct * p.z);
  vec4 v = vec4(p.x, p.y, p.z - 3.6, 1.0);
  gl_Position = uProj * v;
  gl_Position.xy += uOffset * gl_Position.w;
  float depth = clamp((-v.z - 2.4) / 2.6, 0.0, 1.0);
  gl_PointSize = uSize * uDpr * (1.0 + acc * 0.7) * (3.6 / -v.z);
  vAcc = acc;
  vAlpha = mix(1.0, 0.3, depth);
}`;

const FRAG = `
precision mediump float;
uniform vec3 uInk; uniform vec3 uPaper; uniform vec3 uAccent; uniform float uAlpha; uniform float uTheme;
varying float vAcc; varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float soft = smoothstep(0.5, 0.18, r);
  vec3 base = mix(uInk, uPaper, uTheme);
  vec3 col = mix(base, uAccent, vAcc);
  gl_FragColor = vec4(col, min(1.0, soft * vAlpha * uAlpha * mix(1.15, 1.25, vAcc)));
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

function perspective(fovDeg: number, aspect: number) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const near = 0.1, far = 20;
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
}

export class AnatomyField {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private pos = new Map<FieldKey, WebGLBuffer>();
  private acc = new Map<FieldKey, WebGLBuffer>();
  private loc: Record<string, number> = {};
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private n: number;
  private dpr = 1;
  private t0 = performance.now();
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private rot = 0;
  /** Base point size in CSS px; larger on paper where points read lighter. */
  pointSize = 3.1;
  /** Smoothed render state; `target` is what callers set. */
  private cur: FieldState;
  target: FieldState;

  constructor(private canvas: HTMLCanvasElement, opts: { n: number; dprCap?: number }) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("webgl-unavailable");
    this.gl = gl;
    this.n = opts.n;
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.dprCap ?? 1.5);
    this.prog = this.program(VERT, FRAG);
    gl.useProgram(this.prog);
    for (const a of ["aFrom", "aTo", "aScatter", "aAccFrom", "aAccTo", "aRand"]) this.loc[a] = gl.getAttribLocation(this.prog, a);
    for (const u of ["uMix", "uAssemble", "uTime", "uScale", "uSize", "uDpr", "uRot", "uTilt", "uBeat", "uOffset", "uProj", "uInk", "uPaper", "uAccent", "uAlpha", "uTheme"]) this.uni[u] = gl.getUniformLocation(this.prog, u);

    const clouds: Record<FieldKey, Cloud> = {
      scatter: scatterCloud(this.n),
      body: bodyCloud(this.n),
      drift: driftCloud(this.n),
      heart: heartCloud(this.n),
    };
    (Object.keys(clouds) as FieldKey[]).forEach((k) => {
      this.pos.set(k, this.buffer(clouds[k].pos));
      this.acc.set(k, this.buffer(clouds[k].accent));
    });
    const rand = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) rand[i] = Math.random();
    this.bindAttr("aRand", this.buffer(rand), 1);
    this.bindAttr("aScatter", this.pos.get("scatter")!, 3);

    gl.uniform3fv(this.uni.uInk, hex("#0D1524"));
    gl.uniform3fv(this.uni.uPaper, hex("#F3F0E8"));
    gl.uniform3fv(this.uni.uAccent, hex("#E5482F"));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    const init: FieldState = { from: "body", to: "body", mix: 0, assemble: 0, offsetX: 0.4, offsetY: 0, scale: 1, alpha: 1, theme: 0, beat: 0 };
    this.cur = { ...init };
    this.target = { ...init };
    this.resize();
  }

  private program(vs: string, fs: string) {
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
    return p;
  }

  private buffer(data: Float32Array) {
    const gl = this.gl;
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  }

  private bindAttr(name: string, buf: WebGLBuffer, size: number) {
    const gl = this.gl;
    const l = this.loc[name];
    if (l < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
  }

  resize() {
    const w = Math.round(this.canvas.clientWidth * this.dpr);
    const h = Math.round(this.canvas.clientHeight * this.dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
    this.gl.uniformMatrix4fv(this.uni.uProj, false, perspective(30, w / Math.max(1, h)));
    this.gl.uniform1f(this.uni.uDpr, this.dpr);
  }

  setPointer(x: number, y: number) {
    this.pointer.tx = x;
    this.pointer.ty = y;
  }

  /** Advance smoothing and draw one frame. `dt` in seconds. */
  render(dt: number) {
    const gl = this.gl;
    const k = 1 - Math.pow(0.0015, dt); // frame-rate independent easing
    const c = this.cur, t = this.target;
    c.offsetX += (t.offsetX - c.offsetX) * k;
    c.offsetY += (t.offsetY - c.offsetY) * k;
    c.scale += (t.scale - c.scale) * k;
    c.alpha += (t.alpha - c.alpha) * k;
    c.theme += (t.theme - c.theme) * k;
    c.mix = t.mix;
    c.assemble = t.assemble;
    c.beat = t.beat;
    if (c.from !== t.from || c.to !== t.to) {
      c.from = t.from;
      c.to = t.to;
    }
    this.bindAttr("aFrom", this.pos.get(c.from)!, 3);
    this.bindAttr("aTo", this.pos.get(c.to)!, 3);
    this.bindAttr("aAccFrom", this.acc.get(c.from)!, 1);
    this.bindAttr("aAccTo", this.acc.get(c.to)!, 1);

    this.pointer.x += (this.pointer.tx - this.pointer.x) * k;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * k;
    this.rot += dt * 0.12;
    const time = (performance.now() - this.t0) / 1000;
    const beat = Math.pow(Math.max(0, Math.sin(time * 5.2)), 12) * c.beat;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(this.uni.uMix, c.mix);
    gl.uniform1f(this.uni.uAssemble, c.assemble);
    gl.uniform1f(this.uni.uTime, time);
    gl.uniform1f(this.uni.uScale, c.scale);
    gl.uniform1f(this.uni.uSize, this.pointSize);
    gl.uniform1f(this.uni.uRot, Math.sin(this.rot) * 0.5 + this.pointer.x * 0.35);
    gl.uniform1f(this.uni.uTilt, this.pointer.y * 0.12);
    gl.uniform1f(this.uni.uBeat, beat);
    gl.uniform2f(this.uni.uOffset, c.offsetX, c.offsetY);
    gl.uniform1f(this.uni.uAlpha, c.alpha);
    gl.uniform1f(this.uni.uTheme, c.theme);
    gl.drawArrays(gl.POINTS, 0, this.n);
  }

  destroy() {
    const gl = this.gl;
    this.pos.forEach((b) => gl.deleteBuffer(b));
    this.acc.forEach((b) => gl.deleteBuffer(b));
    gl.deleteProgram(this.prog);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
