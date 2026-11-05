/**
 * SIGNAL — deterministic timeline helpers.
 * One clock (seconds, 0–DURATION) drives every element, so play, pause and scrubbing are frame-exact.
 */
export const DURATION = 20
export const BEAT = 0.5 // 120 BPM

export const C = {
  cobalt: '#3D4BFF',
  blush: '#FFB8DA',
  paper: '#F4F1EA',
  ink: '#0A0A14',
  volt: '#FF6B3D',
  night: '#16163A',
} as const

export const chapters = [
  { n: '01', name: 'Logo reveal', start: 0, end: 4 },
  { n: '02', name: 'Kinetic type', start: 4, end: 8 },
  { n: '03', name: 'Shape transitions', start: 8, end: 12 },
  { n: '04', name: 'Brand elements', start: 12, end: 16 },
  { n: '05', name: 'Loop', start: 16, end: 20 },
] as const

export const chapterAt = (t: number) => Math.min(chapters.length - 1, Math.max(0, Math.floor(t / 4)))

// ── math ──────────────────────────────────────────────
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k
/** 0→1 progress of t between a and b */
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))

export const ease = {
  outCubic: (k: number) => 1 - Math.pow(1 - k, 3),
  inCubic: (k: number) => k * k * k,
  inOutCubic: (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  outExpo: (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  inOutExpo: (k: number) =>
    k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2,
  outBack: (k: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2)
  },
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
/** Linear colour blend between two #RRGGBB colours */
export function mix(a: string, b: string, k: number) {
  if (k <= 0) return a
  if (k >= 1) return b
  const x = hex(a)
  const y = hex(b)
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], k))).join(',')})`
}

// ── shapes ────────────────────────────────────────────
export type ShapeKind = 0 | 1 | 2 // circle, square, triangle
export const shapeNames = ['Circle', 'Square', 'Triangle'] as const

const TAU = Math.PI * 2
const SQ = 0.86 // square half-side (unit circle = 1)
const TRI = 0.62 // triangle in-radius (circumradius 1.24)

/** Distance from the centre to the outline of a unit shape along angle th (radians, y down). */
function radius(kind: ShapeKind, th: number) {
  if (kind === 0) return 1
  if (kind === 1) return SQ / Math.max(Math.abs(Math.cos(th)), Math.abs(Math.sin(th)))
  // equilateral triangle pointing up: edge normals at 90°, 210°, 330°
  const seg = TAU / 3
  let d = (th - Math.PI / 2 + seg / 2) % seg
  if (d < 0) d += seg
  return TRI / Math.cos(d - seg / 2)
}

const N = 96
/**
 * Outline path that morphs between two shapes. Both shapes are sampled along the same rays,
 * so corners line up and the transition never tangles.
 */
export function morphPath(cx: number, cy: number, R: number, a: ShapeKind, b: ShapeKind, k: number, rot = 0) {
  let d = ''
  for (let i = 0; i < N; i++) {
    const th = (i / N) * TAU
    const r = R * lerp(radius(a, th), radius(b, th), k)
    const x = cx + r * Math.cos(th + rot)
    const y = cy + r * Math.sin(th + rot)
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d + 'Z'
}

export const fmtTime = (t: number) => `0:${Math.floor(t).toString().padStart(2, '0')}.${Math.floor((t % 1) * 10)}`
