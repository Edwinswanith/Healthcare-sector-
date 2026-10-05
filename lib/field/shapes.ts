// Procedural anatomy point clouds. Original geometry built from simple
// primitives (capsules, ellipsoids, rings, tubes); no third-party anatomy data.
// Every generator returns exactly `n` points so targets can morph point-to-point.

export type Cloud = { pos: Float32Array; accent: Float32Array; n: number };
type V3 = [number, number, number];

/** Deterministic PRNG so server and client, and every reload, match. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function unit(r: () => number): V3 {
  const z = r() * 2 - 1;
  const a = r() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(a), z, s * Math.sin(a)];
}

type Prim =
  | { k: "capsule"; a: V3; b: V3; r: number; w?: number; accent?: number; shell?: number }
  | { k: "ellipsoid"; c: V3; r: V3; w?: number; accent?: number; shell?: number }
  | { k: "ring"; c: V3; rx: number; rz: number; arc?: [number, number]; thick: number; w?: number; accent?: number }
  | { k: "tube"; pts: V3[]; r: number; w?: number; accent?: number }
  | { k: "heart"; c: V3; s: number; depth: number; tilt?: number; w?: number; accent?: number; shell?: number };

function area(p: Prim): number {
  switch (p.k) {
    case "capsule": {
      const d = Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1], p.b[2] - p.a[2]);
      return (d + p.r * 1.5) * p.r;
    }
    case "ellipsoid":
      return (p.r[0] * p.r[1] + p.r[1] * p.r[2] + p.r[0] * p.r[2]) * 1.4;
    case "ring":
      return (p.rx + p.rz) * p.thick * 6;
    case "tube": {
      let len = 0;
      for (let i = 1; i < p.pts.length; i++) {
        const a = p.pts[i - 1], b = p.pts[i];
        len += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      }
      return len * p.r * 2;
    }
    case "heart":
      return p.s * p.s * 2.2;
  }
}

function sample(p: Prim, r: () => number): V3 {
  switch (p.k) {
    case "capsule": {
      const t = r();
      const d = unit(r);
      const k = p.r * (p.shell === undefined ? 0.82 + 0.18 * r() : 1 - p.shell * r());
      return [p.a[0] + (p.b[0] - p.a[0]) * t + d[0] * k, p.a[1] + (p.b[1] - p.a[1]) * t + d[1] * k, p.a[2] + (p.b[2] - p.a[2]) * t + d[2] * k];
    }
    case "ellipsoid": {
      const d = unit(r);
      const k = p.shell === undefined ? 0.8 + 0.2 * r() : 1 - p.shell * r();
      return [p.c[0] + d[0] * p.r[0] * k, p.c[1] + d[1] * p.r[1] * k, p.c[2] + d[2] * p.r[2] * k];
    }
    case "ring": {
      const [a0, a1] = p.arc ?? [0, Math.PI * 2];
      const a = a0 + (a1 - a0) * r();
      const j = (r() - 0.5) * p.thick;
      return [p.c[0] + Math.cos(a) * (p.rx + j), p.c[1] + (r() - 0.5) * p.thick, p.c[2] + Math.sin(a) * (p.rz + j)];
    }
    case "tube": {
      const seg = Math.floor(r() * (p.pts.length - 1));
      const a = p.pts[seg], b = p.pts[seg + 1];
      const t = r();
      const d = unit(r);
      const k = p.r * (0.7 + 0.3 * r());
      return [a[0] + (b[0] - a[0]) * t + d[0] * k, a[1] + (b[1] - a[1]) * t + d[1] * k, a[2] + (b[2] - a[2]) * t + d[2] * k];
    }
    case "heart": {
      const t = r() * Math.PI * 2;
      const s = p.shell === undefined ? Math.sqrt(r()) : 1 - p.shell * r();
      const hx = (16 * Math.pow(Math.sin(t), 3)) / 17;
      const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
      const z = (r() * 2 - 1) * p.depth * Math.sqrt(Math.max(0, 1 - s * s));
      let x = hx * s * p.s;
      let y = hy * s * p.s;
      const tilt = p.tilt ?? 0;
      const c = Math.cos(tilt), sn = Math.sin(tilt);
      [x, y] = [x * c - y * sn, x * sn + y * c];
      return [p.c[0] + x, p.c[1] + y, p.c[2] + z * p.s];
    }
  }
}

function build(prims: Prim[], n: number, seed: number): Cloud {
  const r = rng(seed);
  const weights = prims.map((p) => area(p) * (p.w ?? 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const pos = new Float32Array(n * 3);
  const accent = new Float32Array(n);
  let i = 0;
  prims.forEach((p, pi) => {
    const count = pi === prims.length - 1 ? n - i : Math.round((weights[pi] / total) * n);
    for (let c = 0; c < count && i < n; c++, i++) {
      const v = sample(p, r);
      pos[i * 3] = v[0];
      pos[i * 3 + 1] = v[1];
      pos[i * 3 + 2] = v[2];
      accent[i] = p.accent ?? 0;
    }
  });
  // Shuffle so morphs between clouds look like a swarm, not a sweep.
  for (let a = n - 1; a > 0; a--) {
    const b = Math.floor(r() * (a + 1));
    for (let k = 0; k < 3; k++) {
      const t = pos[a * 3 + k];
      pos[a * 3 + k] = pos[b * 3 + k];
      pos[b * 3 + k] = t;
    }
    const t = accent[a];
    accent[a] = accent[b];
    accent[b] = t;
  }
  return { pos, accent, n };
}

const mirror = (prims: Prim[]): Prim[] =>
  prims.flatMap((p): Prim[] => {
    const f = (v: V3): V3 => [-v[0], v[1], v[2]];
    if (p.k === "capsule") return [p, { ...p, a: f(p.a), b: f(p.b) }];
    if (p.k === "ellipsoid") return [p, { ...p, c: f(p.c) }];
    if (p.k === "tube") return [p, { ...p, pts: p.pts.map(f) }];
    return [p];
  });

/** Standing figure with skeleton cues and a heart that carries the accent colour. */
export function bodyCloud(n: number): Cloud {
  const skin: Prim[] = [
    { k: "ellipsoid", c: [0, 0.86, 0], r: [0.085, 0.11, 0.095] },
    { k: "capsule", a: [0, 0.72, 0], b: [0, 0.78, 0], r: 0.04 },
    { k: "ellipsoid", c: [0, 0.47, 0], r: [0.18, 0.22, 0.1] },
    { k: "ellipsoid", c: [0, 0.18, 0], r: [0.145, 0.15, 0.09] },
    { k: "ellipsoid", c: [0, -0.01, 0], r: [0.165, 0.085, 0.095] },
    ...mirror([
      { k: "capsule", a: [0.2, 0.63, 0], b: [0.265, 0.31, 0], r: 0.047 },
      { k: "capsule", a: [0.265, 0.31, 0], b: [0.31, 0.03, 0.02], r: 0.036 },
      { k: "ellipsoid", c: [0.322, -0.07, 0.025], r: [0.03, 0.06, 0.018] },
      { k: "capsule", a: [0.085, -0.04, 0], b: [0.1, -0.48, 0], r: 0.07 },
      { k: "capsule", a: [0.1, -0.48, 0], b: [0.1, -0.9, -0.01], r: 0.05 },
      { k: "ellipsoid", c: [0.11, -0.95, 0.04], r: [0.035, 0.022, 0.07] },
    ]),
  ].map((p) => ({ ...p, w: 1, shell: 0.06 }) as Prim);

  const ribs: Prim[] = Array.from({ length: 10 }, (_, i) => ({
    k: "ring" as const,
    c: [0, 0.64 - i * 0.034, -0.005] as V3,
    rx: 0.15 - Math.abs(i - 4) * 0.006,
    rz: 0.085,
    arc: [Math.PI * 0.62, Math.PI * 2.38] as [number, number],
    thick: 0.008,
    w: 0.55,
  }));
  const spine: Prim = { k: "tube", pts: [[0, 0.76, -0.07], [0, 0.55, -0.085], [0, 0.3, -0.06], [0, 0.05, -0.075]], r: 0.016, w: 1.4 };
  const pelvis: Prim = { k: "ring", c: [0, 0.0, 0], rx: 0.13, rz: 0.07, thick: 0.02, w: 0.6 };
  const lungs: Prim[] = mirror([{ k: "ellipsoid", c: [0.075, 0.5, 0], r: [0.06, 0.12, 0.06], w: 0.18, shell: 0.6 }]);
  const heart: Prim = { k: "heart", c: [0.03, 0.46, 0.03], s: 0.055, depth: 0.7, tilt: -0.35, w: 9, accent: 1 };
  return build([...skin, ...ribs, spine, pelvis, ...lungs, heart], n, 11);
}

/** A large anatomical heart with great vessels. */
export function heartCloud(n: number): Cloud {
  const prims: Prim[] = [
    { k: "heart", c: [0, -0.05, 0], s: 0.62, depth: 0.55, tilt: -0.3, w: 1, accent: 1, shell: 0.35 },
    { k: "heart", c: [0, -0.05, 0], s: 0.6, depth: 0.5, tilt: -0.3, w: 0.35 },
    { k: "tube", pts: [[0.02, 0.38, 0], [0.05, 0.62, 0.02], [0.2, 0.74, 0], [0.34, 0.66, -0.02], [0.36, 0.48, -0.03]], r: 0.06, w: 1.1, accent: 1 },
    { k: "tube", pts: [[-0.12, 0.36, 0.03], [-0.16, 0.6, 0.05], [-0.2, 0.74, 0.04]], r: 0.05, w: 0.9 },
    { k: "tube", pts: [[0.08, 0.68, 0], [0.04, 0.86, 0]], r: 0.025, w: 0.5, accent: 1 },
    { k: "tube", pts: [[0.16, 0.72, 0], [0.16, 0.9, 0]], r: 0.022, w: 0.5, accent: 1 },
    { k: "tube", pts: [[-0.3, 0.2, 0.18], [-0.12, 0.05, 0.3], [0.08, -0.25, 0.28], [0.2, -0.45, 0.12]], r: 0.012, w: 0.5, accent: 1 },
    { k: "tube", pts: [[0.28, 0.25, 0.2], [0.34, -0.05, 0.22], [0.2, -0.38, 0.14]], r: 0.012, w: 0.45, accent: 1 },
  ];
  return build(prims, n, 23);
}

/** Quiet reading state: ECG-like traces at several depths plus sparse dust. */
export function driftCloud(n: number): Cloud {
  const r = rng(37);
  const pos = new Float32Array(n * 3);
  const accent = new Float32Array(n);
  const lines = 7;
  const onLines = Math.floor(n * 0.55);
  const ecg = (x: number) => {
    const p = ((x % 1) + 1) % 1;
    if (p > 0.42 && p < 0.46) return (p - 0.42) * 6;
    if (p >= 0.46 && p < 0.5) return 0.24 - (p - 0.46) * 11;
    if (p >= 0.5 && p < 0.54) return -0.2 + (p - 0.5) * 5;
    if (p > 0.62 && p < 0.74) return Math.sin(((p - 0.62) / 0.12) * Math.PI) * 0.05;
    return 0;
  };
  for (let i = 0; i < n; i++) {
    if (i < onLines) {
      const l = i % lines;
      const x = r() * 5.2 - 2.6;
      const y = -1.1 + (l / (lines - 1)) * 2.2 + ecg(x * 0.55 + l * 0.37) * 0.9;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y + (r() - 0.5) * 0.01;
      pos[i * 3 + 2] = -0.8 + (l % 4) * 0.45;
      accent[i] = l === 3 ? 1 : 0;
    } else {
      pos[i * 3] = r() * 5.6 - 2.8;
      pos[i * 3 + 1] = r() * 3 - 1.5;
      pos[i * 3 + 2] = r() * 2.4 - 1.4;
      accent[i] = 0;
    }
  }
  return { pos, accent, n };
}

/** Pre-assembly state: a wide, loose sphere of points. */
export function scatterCloud(n: number): Cloud {
  const r = rng(53);
  const pos = new Float32Array(n * 3);
  const accent = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const d = unit(r);
    const k = 1.6 + r() * 2.2;
    pos[i * 3] = d[0] * k * 1.5;
    pos[i * 3 + 1] = d[1] * k;
    pos[i * 3 + 2] = d[2] * k;
    accent[i] = r() < 0.04 ? 1 : 0;
  }
  return { pos, accent, n };
}

/** Small organ studies used inside the Media Frame (2D canvas renderer). */
export type OrganKey = "heart" | "gut" | "bust" | "knee" | "brain" | "eye" | "lungs" | "kidney" | "bowel" | "spine" | "ear" | "hand" | "check" | "chest" | "child" | "body";

export function organCloud(key: OrganKey, n: number): Cloud {
  const P: Record<OrganKey, Prim[]> = {
    heart: [
      { k: "heart", c: [0, -0.05, 0], s: 0.7, depth: 0.55, tilt: -0.3, accent: 1, shell: 0.4 },
      { k: "tube", pts: [[0.02, 0.42, 0], [0.06, 0.7, 0.02], [0.24, 0.82, 0], [0.4, 0.7, -0.02]], r: 0.07, accent: 1 },
      { k: "tube", pts: [[-0.14, 0.4, 0.03], [-0.2, 0.75, 0.04]], r: 0.06 },
    ],
    chest: [
      ...Array.from({ length: 8 }, (_, i) => ({ k: "ring" as const, c: [0, 0.55 - i * 0.12, 0] as V3, rx: 0.62, rz: 0.36, arc: [Math.PI * 0.62, Math.PI * 2.38] as [number, number], thick: 0.025 })),
      { k: "tube", pts: [[0, 0.7, -0.3], [0, -0.4, -0.3]], r: 0.05 },
      { k: "heart", c: [0.1, 0.02, 0.05], s: 0.25, depth: 0.6, tilt: -0.35, accent: 1, w: 3 },
    ],
    gut: [
      { k: "ellipsoid", c: [-0.25, 0.25, 0], r: [0.5, 0.28, 0.25], shell: 0.15 },
      { k: "ellipsoid", c: [-0.05, -0.08, 0.12], r: [0.09, 0.2, 0.09], accent: 1, w: 2.2 },
      { k: "tube", pts: [[0.25, 0.4, 0], [0.42, 0.2, 0], [0.4, -0.12, 0], [0.18, -0.3, 0.05], [-0.02, -0.28, 0.08]], r: 0.11 },
      { k: "tube", pts: [[-0.02, -0.15, 0.1], [-0.1, -0.4, 0.1], [-0.05, -0.6, 0.05]], r: 0.03, accent: 1 },
    ],
    bust: [
      { k: "ellipsoid", c: [0, 0.42, 0], r: [0.24, 0.31, 0.26], shell: 0.05 },
      { k: "capsule", a: [0, 0.1, 0], b: [0, 0.0, 0], r: 0.11, shell: 0.05 },
      { k: "ellipsoid", c: [0, -0.42, 0], r: [0.68, 0.36, 0.3], shell: 0.05 },
      { k: "ring", c: [0, -0.18, 0.12], rx: 0.12, rz: 0.04, thick: 0.02, accent: 1, w: 3 },
    ],
    knee: [
      { k: "capsule", a: [0, 0.75, 0], b: [0, 0.05, 0], r: 0.17, shell: 0.1 },
      { k: "capsule", a: [0, -0.08, 0], b: [0, -0.8, 0], r: 0.13, shell: 0.1 },
      { k: "ellipsoid", c: [0, 0.0, 0.17], r: [0.11, 0.13, 0.06], accent: 1, w: 2.5 },
    ],
    brain: [
      { k: "ellipsoid", c: [0, 0.05, 0], r: [0.72, 0.5, 0.58], shell: 0.12 },
      ...Array.from({ length: 6 }, (_, i) => ({ k: "ring" as const, c: [0, -0.3 + i * 0.13, 0] as V3, rx: 0.6 - Math.abs(i - 2.5) * 0.08, rz: 0.5, thick: 0.03, w: 0.6 })),
      { k: "ellipsoid", c: [0, -0.42, -0.25], r: [0.3, 0.16, 0.2], accent: 1, w: 1.5 },
    ],
    eye: [
      { k: "ellipsoid", c: [0, 0, 0], r: [0.6, 0.6, 0.6], shell: 0.05 },
      { k: "ring", c: [0, 0, 0.55], rx: 0.26, rz: 0.04, thick: 0.08, accent: 1, w: 4 },
      { k: "tube", pts: [[0, 0, -0.6], [0.1, 0, -1.0]], r: 0.06 },
    ],
    lungs: mirror([{ k: "ellipsoid", c: [0.32, -0.05, 0], r: [0.28, 0.62, 0.25], shell: 0.1 }]).concat([
      { k: "tube", pts: [[0, 0.8, 0], [0, 0.4, 0], [0.18, 0.2, 0]], r: 0.05, accent: 1 },
      { k: "tube", pts: [[0, 0.4, 0], [-0.18, 0.2, 0]], r: 0.05, accent: 1 },
    ]),
    kidney: mirror([{ k: "ellipsoid", c: [0.35, 0.1, 0], r: [0.2, 0.36, 0.16], shell: 0.15 }]).concat([
      { k: "tube", pts: [[0.25, -0.05, 0], [0.12, -0.6, 0], [0, -0.8, 0]], r: 0.03, accent: 1 },
      { k: "ellipsoid", c: [0, -0.85, 0], r: [0.16, 0.12, 0.12], accent: 1 },
    ]),
    bowel: [{ k: "tube", pts: [[-0.5, -0.6, 0], [-0.55, 0.4, 0], [0, 0.55, 0.05], [0.55, 0.4, 0], [0.5, -0.4, 0], [0.1, -0.55, 0.05], [0, -0.85, 0]], r: 0.12 }, { k: "ellipsoid", c: [0.15, -0.05, 0.1], r: [0.18, 0.18, 0.1], accent: 1 }],
    spine: Array.from({ length: 14 }, (_, i) => ({ k: "ellipsoid" as const, c: [Math.sin(i * 0.35) * 0.12, 0.85 - i * 0.13, 0] as V3, r: [0.16, 0.045, 0.12] as V3, accent: i === 9 ? 1 : 0, w: i === 9 ? 3 : 1 })),
    ear: [
      { k: "ring", c: [0, 0.1, 0], rx: 0.45, rz: 0.12, thick: 0.08 },
      { k: "ring", c: [0.02, 0.05, 0], rx: 0.28, rz: 0.08, thick: 0.06 },
      { k: "ellipsoid", c: [0, -0.45, 0], r: [0.17, 0.2, 0.06] },
      { k: "ring", c: [-0.1, 0.0, 0.1], rx: 0.1, rz: 0.1, thick: 0.03, accent: 1, w: 3 },
    ],
    hand: [
      { k: "ellipsoid", c: [0, -0.25, 0], r: [0.34, 0.36, 0.1], shell: 0.1 },
      ...[-0.25, -0.08, 0.09, 0.25].map((x, i) => ({ k: "capsule" as const, a: [x, 0.08, 0] as V3, b: [x * 1.15, 0.75 - Math.abs(i - 1.5) * 0.1, 0] as V3, r: 0.065 })),
      { k: "capsule", a: [-0.32, -0.3, 0], b: [-0.62, 0.05, 0.05], r: 0.075 },
      { k: "ellipsoid", c: [0, -0.62, 0], r: [0.17, 0.08, 0.1], accent: 1 },
    ],
    check: [
      { k: "heart", c: [0, 0.05, 0], s: 0.4, depth: 0.5, accent: 1 },
      { k: "ring", c: [0, 0.05, 0], rx: 0.75, rz: 0.75, thick: 0.02 },
    ],
    child: [
      { k: "ellipsoid", c: [0, 0.38, 0], r: [0.3, 0.32, 0.3], shell: 0.06 },
      { k: "ellipsoid", c: [0, -0.3, 0], r: [0.42, 0.38, 0.28], shell: 0.06 },
      { k: "ellipsoid", c: [0.02, -0.25, 0.12], r: [0.12, 0.08, 0.06], accent: 1, w: 3 },
    ],
    body: [
      { k: "ellipsoid", c: [0, 0.1, 0], r: [0.55, 0.62, 0.28], shell: 0.08 },
      { k: "tube", pts: [[-0.3, -0.25, 0.2], [0.0, -0.1, 0.25], [0.3, -0.3, 0.2]], r: 0.06, accent: 1 },
    ],
  };
  return build(P[key], n, key.length * 97 + 5);
}

export const specialtyOrgan: Record<string, OrganKey> = {
  cardiology: "heart",
  orthopaedics: "knee",
  neurology: "brain",
  ophthalmology: "eye",
  respiratory: "lungs",
  "upper-gi-hpb": "gut",
  urology: "kidney",
  colorectal: "bowel",
  "spinal-surgery": "spine",
  "ent-maxillofacial": "ear",
  "hand-and-wrist": "hand",
  "private-gp": "check",
};
