import { BEAT, C, chapters, chapterAt, clamp01, ease, lerp, mix, morphPath, prog, shapeNames, type ShapeKind } from './timeline'

export const ARCHIVO = "'Archivo Variable', 'Archivo', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', ui-monospace, monospace"
export const LS = '-0.02em'
/** Cap height of Archivo relative to font size */
const CAP = 0.7

export interface Layout {
  W: number
  H: number
  cx: number
  cy: number
  /** portrait composition */
  p: boolean
  /** visible area in viewBox units (the SVG letterboxes with `meet`, scenes paint the whole visible area) */
  V: { x0: number; y0: number; x1: number; y1: number; w: number; h: number }
}

/** Width of a word in viewBox units at a given font-stretch and size */
export type WidthFn = (word: string, stretch: number, fs: number) => number

export interface SceneProps {
  t: number
  L: Layout
  w: WidthFn
  id: (name: string) => string
}

export function layoutFor(cw: number, ch: number): Layout {
  const A = cw / Math.max(1, ch)
  const p = A < 1.05
  const W = p ? 900 : 1600
  const H = p ? 1200 : 900
  let V
  if (A > W / H) {
    const w = H * A
    V = { x0: (W - w) / 2, y0: 0, x1: (W + w) / 2, y1: H, w, h: H }
  } else {
    const h = W / A
    V = { x0: 0, y0: (H - h) / 2, x1: W, y1: (H + h) / 2, w: W, h }
  }
  return { W, H, cx: W / 2, cy: H / 2, p, V }
}

const coverRadius = (L: Layout, x: number, y: number) =>
  Math.hypot(Math.max(x - L.V.x0, L.V.x1 - x), Math.max(y - L.V.y0, L.V.y1 - y)) + 4

// ── primitives ────────────────────────────────────────
function Bg({ L, fill }: { L: Layout; fill: string }) {
  return <rect x={L.V.x0 - 2} y={L.V.y0 - 2} width={L.V.w + 4} height={L.V.h + 4} fill={fill} />
}

/** Per-letter vertical offsets: letters rise from below a mask line. */
function rise(t: number, start: number, n: number, fs: number, dur = 0.7, stagger = 0.06) {
  return Array.from({ length: n }, (_, i) => (1 - ease.outExpo(prog(t, start + i * stagger, start + i * stagger + dur))) * fs * 1.12)
}
/** Per-letter offsets for leaving through the mask (dir -1 = up, 1 = down). */
function leave(t: number, start: number, n: number, fs: number, dir: 1 | -1, dur = 0.45, stagger = 0.05) {
  return Array.from({ length: n }, (_, i) => ease.inCubic(prog(t, start + i * stagger, start + i * stagger + dur)) * fs * 1.12 * dir)
}
const add = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] ?? 0))

interface WordProps {
  x: number
  y: number
  text: string
  fs: number
  stretch?: number
  fill: string
  anchor?: 'start' | 'middle' | 'end'
  offsets?: number[]
  clip?: string
  opacity?: number
}
/** Variable-width display word. Per-letter offsets use relative `dy`, which keeps text-anchor intact. */
function Word({ x, y, text, fs, stretch = 100, fill, anchor = 'middle', offsets, clip, opacity }: WordProps) {
  const dy = offsets?.map((o, i) => (i === 0 ? o : o - offsets[i - 1]).toFixed(1)).join(' ')
  return (
    <text
      x={x}
      y={y}
      dy={dy}
      textAnchor={anchor}
      fill={fill}
      opacity={opacity}
      clipPath={clip ? `url(#${clip})` : undefined}
      style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: fs, fontStretch: `${stretch.toFixed(1)}%`, letterSpacing: LS }}
    >
      {text}
    </text>
  )
}

/** Horizontal mask band for a line of display type with its baseline at y */
function LineClip({ id, L, y, fs }: { id: string; L: Layout; y: number; fs: number }) {
  return (
    <clipPath id={id}>
      <rect x={L.V.x0 - 10} y={y - fs * 0.96} width={L.V.w + 20} height={fs * 1.04} />
    </clipPath>
  )
}

function Mono({ x, y, size, fill, anchor = 'start', opacity, children }: { x: number; y: number; size: number; fill: string; anchor?: 'start' | 'middle' | 'end'; opacity?: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} opacity={opacity} style={{ fontFamily: MONO, fontSize: size, letterSpacing: '0.16em', fontWeight: 500 }}>
      {children}
    </text>
  )
}

/** The pulse mark: a dot and two broadcast rings */
function Mark({ x, y, s, dot, r1, r2, color }: { x: number; y: number; s: number; dot: number; r1: number; r2: number; color: string }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`}>
      <circle r={16 * dot} fill={color} />
      {r1 > 0 && <circle r={44} fill="none" stroke={color} strokeWidth={11} pathLength={1} strokeDasharray={`${r1} 1`} transform="rotate(-90)" />}
      {r2 > 0 && <circle r={76} fill="none" stroke={color} strokeWidth={11} pathLength={1} strokeDasharray={`${0.75 * r2} 1`} />}
    </g>
  )
}

export function Hud({ t, L, color }: { t: number; L: Layout; color: string }) {
  const c = chapters[chapterAt(t)]
  const size = L.p ? 22 : 15
  const m = L.p ? 36 : 34
  const x0 = L.V.x0 + m
  const x1 = L.V.x1 - m
  const y0 = L.V.y0 + m + size * 0.75
  const y1 = L.V.y1 - m
  const frame = Math.floor(t * 30)
  const tc = `00:${String(Math.floor(t)).padStart(2, '0')}:${String(frame % 30).padStart(2, '0')}`
  return (
    <g opacity={0.78} aria-hidden>
      <Mono x={x0} y={y0} size={size} fill={color}>SIGNAL/26</Mono>
      <Mono x={x1} y={y0} size={size} fill={color} anchor="end">
        CH.{c.n} — {c.name.toUpperCase()}
      </Mono>
      <Mono x={x0} y={y1} size={size} fill={color}>{tc}</Mono>
      <Mono x={x1} y={y1} size={size} fill={color} anchor="end">120 BPM · 20S LOOP</Mono>
    </g>
  )
}

// ── CH.01 — Logo reveal ───────────────────────────────
export function LogoReveal({ t, L, w, id }: SceneProps) {
  const fs = L.p ? 196 : 232
  const word = 'SIGNAL'
  const ww = w(word, 100, fs)
  const capH = fs * CAP
  const markR = 82
  const gap = 62
  const final = L.p ? { x: L.cx, y: L.cy - 230 } : { x: L.cx - (2 * markR + gap + ww) / 2 + markR, y: L.cy - 20 }
  const base = L.p ? L.cy + 60 + capH : final.y + capH / 2
  const m = ease.inOutCubic(prog(t, 1.2, 2.05))
  const mx = lerp(L.cx, final.x, m)
  const my = lerp(L.cy, final.y, m)
  const pulse = 1 + 0.4 * Math.sin(Math.PI * prog(t, 0.05, 0.45))
  const r1 = ease.outCubic(prog(t, 0.3, 0.95))
  const r2 = ease.outCubic(prog(t, 0.5, 1.2))
  const stretch = lerp(118, 100, ease.outCubic(prog(t, 1.55, 2.6)))
  const wordX = L.p ? L.cx : final.x + markR + gap
  const left = L.p ? L.cx - ww / 2 : final.x - markR
  const right = L.p ? L.cx + ww / 2 : wordX + ww
  const ly = base + (L.p ? 64 : 58)
  const lineP = ease.inOutCubic(prog(t, 2.15, 2.85))
  const sub = ease.outCubic(prog(t, 2.35, 2.9))
  const wipe = ease.inOutCubic(prog(t, 3.4, 4))
  const monoSize = L.p ? 24 : 17
  return (
    <>
      <Bg L={L} fill={C.ink} />
      {[
        [0.25, 1.35],
        [2.55, 3.5],
      ].map(([a, b], i) => {
        const k = prog(t, a, b)
        return k > 0 && k < 1 ? <circle key={i} cx={mx} cy={my} r={lerp(30, L.p ? 360 : 420, ease.outCubic(k))} fill="none" stroke={C.paper} strokeWidth={2} opacity={(1 - k) * 0.45} /> : null
      })}
      <Mark x={mx} y={my} s={lerp(1.5, 1, m)} dot={pulse} r1={r1} r2={r2} color={C.paper} />
      <LineClip id={id('l1')} L={L} y={base} fs={fs} />
      <Word x={wordX} y={base} text={word} fs={fs} stretch={stretch} fill={C.paper} anchor={L.p ? 'middle' : 'start'} offsets={rise(t, 1.5, 6, fs)} clip={id('l1')} />
      {lineP > 0 && <line x1={left} x2={lerp(left, right, lineP)} y1={ly} y2={ly} stroke={C.paper} strokeOpacity={0.4} strokeWidth={2} />}
      <g opacity={sub} transform={`translate(0 ${((1 - sub) * 14).toFixed(1)})`}>
        {L.p ? (
          <>
            <Mono x={L.cx} y={ly + 52} size={monoSize} fill={C.paper} anchor="middle">DIGITAL CULTURE FESTIVAL</Mono>
            <Mono x={L.cx} y={ly + 92} size={monoSize} fill={C.blush} anchor="middle">MOTION IDENTITY — CONCEPT</Mono>
          </>
        ) : (
          <>
            <Mono x={left} y={ly + 42} size={monoSize} fill={C.paper}>DIGITAL CULTURE FESTIVAL</Mono>
            <Mono x={right} y={ly + 42} size={monoSize} fill={C.blush} anchor="end">MOTION IDENTITY — CONCEPT</Mono>
          </>
        )}
      </g>
      {wipe > 0 && <rect x={L.V.x0 - 2} y={lerp(L.V.y1, L.V.y0 - 2, wipe)} width={L.V.w + 4} height={L.V.h + 8} fill={C.cobalt} />}
    </>
  )
}

// ── CH.02 — Kinetic typography ────────────────────────
const LINES = ['DIGITAL', 'CULTURE', 'FESTIVAL'] as const
/** Width targets per beat (font-stretch %) — each line answers the others */
const PATTERN = [
  [62, 125, 62, 96, 125, 62, 112, 62, 62],
  [125, 62, 118, 62, 62, 125, 62, 125, 125],
  [92, 100, 62, 125, 88, 62, 125, 92, 62],
]
function stretchAt(tau: number, i: number) {
  const k = Math.min(7, Math.floor(Math.max(0, tau) / BEAT))
  const e = ease.inOutExpo(clamp01((tau - k * BEAT) / 0.34))
  return lerp(PATTERN[i][k], PATTERN[i][k + 1], e)
}

export function KineticType({ t, L, w, id }: SceneProps) {
  const tau = t - 4
  const m = L.p ? 46 : 70
  const widest = Math.max(...LINES.map((l) => w(l, 125, 100)))
  const fs = Math.min(L.p ? 200 : 268, ((L.W - 2 * m) / widest) * 100)
  const capH = fs * CAP
  const gap = L.p ? fs * 1.3 : fs * 0.9
  const anchors = ['start', 'middle', 'end'] as const
  const xs = [m, L.cx, L.W - m]
  const fills = [C.paper, C.ink, C.blush]
  const wipe = ease.inOutCubic(prog(tau, 3.4, 4))
  const beat = Math.min(7, Math.floor(tau / BEAT))
  const size = L.p ? 22 : 15
  const stretches = LINES.map((_, i) => stretchAt(tau, i))
  return (
    <>
      <Bg L={L} fill={C.cobalt} />
      {LINES.map((line, i) => {
        const y = L.cy + (i - 1) * gap + capH / 2
        const off = add(rise(tau, 0.02 + i * 0.1, line.length, fs, 0.65, 0.035), leave(tau, 2.85 + i * 0.07, line.length, fs, -1, 0.34, 0.025))
        return (
          <g key={line}>
            <LineClip id={id(`k${i}`)} L={L} y={y} fs={fs} />
            <Word x={xs[i]} y={y} text={line} fs={fs} stretch={stretches[i]} fill={fills[i]} anchor={anchors[i]} offsets={off} clip={id(`k${i}`)} />
          </g>
        )
      })}
      {/* beat counter + live width read-out */}
      <g aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={L.cx - 4 * 22 + i * 22} y={L.V.y1 - (L.p ? 104 : 78)} width={12} height={12} fill={i === beat ? C.paper : 'none'} stroke={C.paper} strokeOpacity={0.6} strokeWidth={1.5} />
        ))}
        <Mono x={L.cx} y={L.V.y1 - (L.p ? 120 : 96)} size={size} fill={C.paper} anchor="middle" opacity={0.75}>
          WDTH {stretches.map((s) => String(Math.round(s)).padStart(3, '0')).join(' · ')}
        </Mono>
      </g>
      {wipe > 0 && <circle cx={L.cx} cy={L.cy} r={wipe * coverRadius(L, L.cx, L.cy)} fill={C.paper} />}
    </>
  )
}

// ── CH.03 — Shape transitions ─────────────────────────
const SHAPE_COLORS = [C.cobalt, C.ink, C.volt, C.blush]

export function ShapeTransitions({ t, L }: SceneProps) {
  const tau = t - 8
  const big = L.p ? { x: L.cx, y: L.cy - 230, R: 210 } : { x: L.W * 0.31, y: L.cy - 20, R: 240 }
  const k1 = ease.inOutExpo(prog(tau, 0.85, 1.35))
  const k2 = ease.inOutExpo(prog(tau, 1.65, 2.15))
  const k3 = ease.inOutExpo(prog(tau, 2.45, 2.95))
  let a: ShapeKind = 0
  let b: ShapeKind = 1
  let k = k1
  if (tau >= 1.5 && tau < 2.3) [a, b, k] = [1, 2, k2]
  else if (tau >= 2.3) [a, b, k] = [2, 0, k3]
  const rot = (k1 * 90 + k2 * 120 + k3 * 120) * (Math.PI / 180)
  let color = mix(mix(mix(C.cobalt, C.volt, k1), C.ink, k2), C.cobalt, k3)
  const expand = ease.inOutCubic(prog(tau, 3.2, 4))
  color = mix(color, C.ink, prog(tau, 3.05, 3.35))
  const appear = ease.outBack(prog(tau, 0, 0.6))
  const R = lerp(big.R * appear, coverRadius(L, big.x, big.y), expand)
  const active = k > 0.5 ? b : a

  const cell = L.p ? 150 : 172
  const g = L.p ? { x: L.cx, y: L.cy + 330 } : { x: L.W * 0.72, y: L.cy - 20 }
  const small = L.p ? 46 : 52
  const labelY = L.p ? big.y + big.R + 110 : L.cy + big.R + 110
  const size = L.p ? 22 : 16
  return (
    <>
      <Bg L={L} fill={C.paper} />
      {/* grid of small shapes on a diagonal beat wave */}
      {Array.from({ length: 9 }, (_, j) => {
        const r = Math.floor(j / 3)
        const c = j % 3
        const d = (r + c) * 0.09
        let n = 0
        let kk = 0
        for (let i = 0; i < 5; i++) {
          const T = 0.7 + i * BEAT + d
          const p = prog(tau, T, T + 0.3)
          if (p >= 1) n++
          else {
            kk = ease.inOutExpo(p)
            break
          }
        }
        const s0 = j % 3
        const ka = ((s0 + n) % 3) as ShapeKind
        const kb = ((s0 + n + 1) % 3) as ShapeKind
        const sc = ease.outBack(prog(tau, 0.15 + d, 0.65 + d)) * (1 - ease.inCubic(prog(tau, 2.85 + d * 0.6, 3.2 + d * 0.6)))
        if (sc <= 0.001) return null
        const fill = mix(SHAPE_COLORS[(j + n) % 4], SHAPE_COLORS[(j + n + 1) % 4], kk)
        const x = g.x + (c - 1) * cell
        const y = g.y + (r - 1) * cell
        return <path key={j} d={morphPath(x, y, small * sc, ka, kb, kk, ((n + kk) * Math.PI) / 2)} fill={fill} />
      })}
      {/* labels */}
      <g opacity={ease.outCubic(prog(tau, 0.3, 0.8)) * (1 - prog(tau, 2.9, 3.2))}>
        {shapeNames.map((name, i) => (
          <Mono key={name} x={big.x + (i - 1) * (L.p ? 230 : 190)} y={labelY} size={size} fill={i === active ? C.cobalt : C.ink} anchor="middle" opacity={i === active ? 1 : 0.35}>
            {['●', '■', '▲'][i]} {name.toUpperCase()}
          </Mono>
        ))}
      </g>
      <path d={morphPath(big.x, big.y, R, expand > 0 ? 0 : a, expand > 0 ? 0 : b, expand > 0 ? 0 : k, rot)} fill={color} />
    </>
  )
}

// ── CH.04 — Brand elements ────────────────────────────
const TILE_PAIRS: [string, string][] = [
  [C.cobalt, C.paper],
  [C.paper, C.ink],
  [C.blush, C.cobalt],
  [C.volt, C.ink],
  [C.night, C.blush],
]
const TICKER_A = 'SIGNAL/26 — DIGITAL CULTURE FESTIVAL — SOUND · IMAGE · CODE — '
const TICKER_B = 'MOTION IDENTITY — EVERY FRAME IS A POSTER — WIDTH AS EXPRESSION — '

function Motif({ kind, h, fill }: { kind: number; h: number; fill: string }) {
  if (kind === 0) return <path d={`M${-h} ${-h}H${h}A${2 * h} ${2 * h} 0 0 1 ${-h} ${h}Z`} fill={fill} />
  if (kind === 1) return <path d={`M${-h} 0A${h} ${h} 0 0 1 ${h} 0Z`} fill={fill} />
  if (kind === 2) return <path d={`M${-h} ${-h}L${h} ${h}H${-h}Z`} fill={fill} />
  return <circle r={h * 0.56} fill={fill} />
}

export function BrandElements({ t, L, id }: SceneProps) {
  const tau = t - 12
  const m = L.p ? 46 : 60
  const tA = L.p ? { y: 70, h: 92 } : { y: 70, h: 100 }
  const box = L.p ? { x: m, y: 196, w: L.W - 2 * m, h: 300 } : { x: m, y: 206, w: 840, h: 488 }
  const tiles = L.p ? { x: m, y: 530, cols: 5, rows: 3, size: (L.W - 2 * m) / 5 } : { x: 940, y: 206, cols: 5, rows: 4, size: 120 }
  const tB = L.p ? { y: tiles.y + 3 * tiles.size + 34, h: 92 } : { y: 730, h: 100 }
  const band = ease.outExpo(prog(tau, 0, 0.7))
  const band2 = ease.outExpo(prog(tau, 0.15, 0.85))
  const tfs = L.p ? 52 : 62
  const size = L.p ? 20 : 15
  const N = L.p ? 34 : 52
  const pad = 28
  const barGap = L.p ? 6 : 6
  const barW = (box.w - 2 * pad - (N - 1) * barGap) / N
  const mid = box.y + box.h / 2 + 18
  const maxH = box.h - 100
  const beatEnv = 0.62 + 0.38 * Math.exp(-((tau % BEAT) / 0.1))
  const head = (tau * 14) % N
  const wipe = ease.inOutCubic(prog(tau, 3.4, 4))
  const boxIn = ease.outCubic(prog(tau, 0.1, 0.6))
  return (
    <>
      <Bg L={L} fill={C.ink} />
      {/* ticker A */}
      <clipPath id={id('ta')}>
        <rect x={L.V.x0} y={tA.y} width={L.V.w * band} height={tA.h} />
      </clipPath>
      <g clipPath={`url(#${id('ta')})`}>
        <rect x={L.V.x0} y={tA.y} width={L.V.w} height={tA.h} fill={C.paper} />
        <Word x={L.V.x0 + 24 - tau * 190} y={tA.y + tA.h / 2 + (tfs * CAP) / 2} text={TICKER_A.repeat(3)} fs={tfs} stretch={lerp(88, 118, 0.5 + 0.5 * Math.sin(tau * 2.2))} fill={C.ink} anchor="start" />
      </g>
      {/* waveform */}
      <g opacity={boxIn}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={C.paper} strokeOpacity={0.16} strokeWidth={1.5} />
        <Mono x={box.x + pad} y={box.y + 40} size={size} fill={C.paper} opacity={0.7}>WAVEFORM</Mono>
        <Mono x={box.x + box.w - pad} y={box.y + 40} size={size} fill={C.paper} opacity={0.7} anchor="end">120 BPM</Mono>
      </g>
      {Array.from({ length: N }, (_, i) => {
        const a = 0.55 * Math.abs(Math.sin(i * 0.37 + tau * 4.2)) + 0.45 * Math.abs(Math.sin(i * 0.11 - tau * 2.3 + 1.3))
        const grow = ease.outCubic(prog(tau, 0.2 + i * 0.008, 0.7 + i * 0.008))
        const h = Math.max(4, maxH * clamp01(0.05 + 0.95 * a * beatEnv) * grow)
        const hot = Math.abs(i - head) < 1.5
        return <rect key={i} x={box.x + pad + i * (barW + barGap)} y={mid - h / 2} width={barW} height={h} rx={barW / 2} fill={hot ? C.volt : C.cobalt} />
      })}
      {/* pattern tiles */}
      {Array.from({ length: tiles.cols * tiles.rows }, (_, j) => {
        const r = Math.floor(j / tiles.cols)
        const c = j % tiles.cols
        const d = (r + c) * 0.05
        const sc = ease.outBack(prog(tau, 0.25 + d, 0.7 + d))
        if (sc <= 0.001) return null
        let n = 0
        let kk = 0
        for (let i = 0; i < 6; i++) {
          const T = 0.9 + i * BEAT + d
          const p = prog(tau, T, T + 0.28)
          if (p >= 1) n++
          else {
            kk = ease.inOutExpo(p)
            break
          }
        }
        const [bg, fg] = TILE_PAIRS[(r * 2 + c * 3) % 5]
        const s = tiles.size
        const x = tiles.x + c * s + s / 2
        const y = tiles.y + r * s + s / 2
        return (
          <g key={j} transform={`translate(${x} ${y}) scale(${sc.toFixed(3)})`}>
            <rect x={-s / 2} y={-s / 2} width={s} height={s} fill={bg} />
            <g transform={`rotate(${((n + kk) * 90 + (r + c) * 90).toFixed(1)})`}>
              <Motif kind={(r + c * 2) % 4} h={s / 2} fill={fg} />
            </g>
          </g>
        )
      })}
      {/* ticker B */}
      <clipPath id={id('tb')}>
        <rect x={L.V.x1 - L.V.w * band2} y={tB.y} width={L.V.w * band2} height={tB.h} />
      </clipPath>
      <g clipPath={`url(#${id('tb')})`}>
        <rect x={L.V.x0} y={tB.y} width={L.V.w} height={tB.h} fill={C.blush} />
        <Word x={L.V.x0 - 1500 + tau * 190} y={tB.y + tB.h / 2 + (tfs * CAP) / 2} text={TICKER_B.repeat(3)} fs={tfs} stretch={62} fill={C.cobalt} anchor="start" />
      </g>
      {wipe > 0 && <rect x={L.V.x0 - 2} y={L.V.y0 - 2} width={(L.V.w + 4) * wipe} height={L.V.h + 4} fill={C.cobalt} />}
    </>
  )
}

// ── CH.05 — Loop ──────────────────────────────────────
export function Loop({ t, L, w, id }: SceneProps) {
  const tau = t - 16
  const m = L.p ? 50 : 150
  const fs = Math.min(L.p ? 230 : 330, ((L.W - 2 * m) / w('SIGNAL', 125, 100)) * 100)
  const capH = fs * CAP
  const stretch = 100 + 25 * Math.sin(Math.PI * prog(tau, 0.55, 2.05))
  const ww = w('SIGNAL', stretch, fs)
  const base = L.cy + capH / 2
  const off = add(rise(tau, 0, 6, fs, 0.6, 0.05), leave(tau, 1.95, 6, fs, 1, 0.45, 0.05))
  const collapse = ease.inOutCubic(prog(tau, 2.0, 2.8))
  const contract = ease.inOutExpo(prog(tau, 2.75, 3.75))
  const RC = lerp(coverRadius(L, L.cx, L.cy), 24, contract)
  const fill = mix(C.cobalt, C.paper, prog(tau, 3.15, 3.7))
  const rx = L.p ? L.W * 0.4 : ww / 2 + 110
  const ry = L.p ? fs * 1.15 : fs * 0.72
  const tag = ease.outCubic(prog(tau, 0.5, 0.9)) * (1 - prog(tau, 1.85, 2.15))
  const orbit = [
    { kind: 0 as ShapeKind, color: C.blush },
    { kind: 1 as ShapeKind, color: C.volt },
    { kind: 2 as ShapeKind, color: C.ink },
  ].map((s, i) => {
    const ang = tau * 1.5 + (i * Math.PI * 2) / 3 - Math.PI / 2
    const depth = Math.sin(ang)
    const sc = ease.outBack(prog(tau, 0.3 + i * 0.1, 0.8 + i * 0.1)) * (1 - collapse) * (0.82 + 0.18 * depth)
    return { ...s, i, depth, sc, x: L.cx + Math.cos(ang) * rx * (1 - collapse), y: L.cy - 10 + depth * ry * (1 - collapse), rot: tau * 2 + i }
  })
  const shape = (o: (typeof orbit)[number]) => (o.sc > 0.001 ? <path key={o.i} d={morphPath(o.x, o.y, (L.p ? 52 : 58) * o.sc, o.kind, o.kind, 0, o.rot)} fill={o.color} /> : null)
  return (
    <>
      <Bg L={L} fill={C.ink} />
      <circle cx={L.cx} cy={L.cy} r={RC} fill={fill} />
      {contract < 1 && (
        <>
          {orbit.filter((o) => o.depth < 0).map(shape)}
          <LineClip id={id('lp')} L={L} y={base} fs={fs} />
          <Word x={L.cx} y={base} text="SIGNAL" fs={fs} stretch={stretch} fill={C.paper} offsets={off} clip={id('lp')} />
          {orbit.filter((o) => o.depth >= 0).map(shape)}
          <Mono x={L.cx} y={base + (L.p ? 110 : 84)} size={L.p ? 24 : 17} fill={C.paper} anchor="middle" opacity={tag}>
            EVERY FRAME IS A POSTER
          </Mono>
        </>
      )}
    </>
  )
}

export const scenes = [LogoReveal, KineticType, ShapeTransitions, BrandElements, Loop]

/** HUD colour per moment, so it always contrasts with the background */
export function hudColor(t: number) {
  const ch = chapterAt(t)
  const tau = t - ch * 4
  if (ch === 1) return tau > 3.75 ? C.ink : C.paper
  if (ch === 2) return tau > 3.6 ? C.paper : C.ink
  return C.paper
}
