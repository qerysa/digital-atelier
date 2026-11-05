import './fonts'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { DemoProps } from '../registry'
import { ARCHIVO, Hud, LS, hudColor, layoutFor, scenes, type WidthFn } from './scenes'
import { DURATION, chapterAt, chapters, fmtTime } from './timeline'

const WORDS = ['SIGNAL', 'DIGITAL', 'CULTURE', 'FESTIVAL']
const STRETCHES = [62, 100, 125] as const
const mono = "font-['IBM_Plex_Mono',monospace] uppercase tracking-[0.18em]"
const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-[#FFB8DA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A14]'

/** Measures display words once the variable font is ready, so layouts can fit any width setting. */
function useWordWidths(): WidthFn {
  const [table, setTable] = useState<Record<string, number[]> | null>(null)
  useEffect(() => {
    let dead = false
    const measure = () => {
      if (dead) return
      const NS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(NS, 'svg')
      svg.setAttribute('width', '0')
      svg.setAttribute('height', '0')
      svg.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
      document.body.appendChild(svg)
      const res: Record<string, number[]> = {}
      for (const word of WORDS) {
        res[word] = STRETCHES.map((s) => {
          const el = document.createElementNS(NS, 'text')
          el.textContent = word
          el.setAttribute('style', `font-family:${ARCHIVO};font-weight:800;font-size:100px;font-stretch:${s}%;letter-spacing:${LS}`)
          svg.appendChild(el)
          return el.getComputedTextLength()
        })
      }
      svg.remove()
      if (Object.values(res).every((v) => v.every((n) => n > 0))) setTable(res)
    }
    document.fonts.load(`800 100px 'Archivo Variable'`, 'SIGNALDUTREFV').then(measure, measure)
    return () => {
      dead = true
    }
  }, [])
  return useCallback(
    (word, stretch, fs) => {
      const row = table?.[word]
      if (!row) return word.length * 0.62 * (stretch / 100) * fs
      const [a, b, c] = row
      const v = stretch <= 100 ? a + ((b - a) * (stretch - 62)) / 38 : b + ((c - b) * (stretch - 100)) / 25
      return (v * fs) / 100
    },
    [table],
  )
}

/** SIGNAL — a 20-second motion identity, rendered live as SVG from one deterministic clock. */
export default function SignalDemo({ embedded }: DemoProps) {
  const reduce = useReducedMotion()
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = useCallback((name: string) => `sg${uid}-${name}`, [uid])
  const wrap = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const tRef = useRef(reduce ? 2.95 : 0)
  const [t, setT] = useState(tRef.current)
  const [playing, setPlaying] = useState(!reduce)
  const [inView, setInView] = useState(false)
  const ratio = useRef(0)
  const drag = useRef<{ resume: boolean } | null>(null)
  const [size, setSize] = useState({ w: 1600, h: 900 })
  const w = useWordWidths()
  const L = useMemo(() => layoutFor(size.w, size.h), [size])

  const setTime = useCallback((v: number) => {
    tRef.current = ((v % DURATION) + DURATION) % DURATION
    setT(tRef.current)
  }, [])

  // dev-only hook for visual QA: window.__signalSeek(seconds)
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const w = window as unknown as { __signalSeek?: (v: number) => void }
    w.__signalSeek = (v: number) => {
      setPlaying(false)
      setTime(v)
    }
    return () => {
      delete w.__signalSeek
    }
  }, [setTime])

  // stage size → layout
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // visibility → only animate on screen
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        ratio.current = e.intersectionRatio
        setInView(e.isIntersecting)
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // the clock
  useEffect(() => {
    if (!playing || !inView) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      if (!document.hidden) setTime(tRef.current + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, inView, setTime])

  // Space toggles playback while the piece is focused or mostly on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat || e.defaultPrevented) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, button, a, [contenteditable="true"], [role="slider"]')) return
      const inside = !!target && !!wrap.current?.contains(target)
      const onPage = (!target || target === document.body || target === document.documentElement) && ratio.current >= 0.6
      if (!inside && !onPage) return
      e.preventDefault()
      setPlaying((p) => !p)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const seekFromPointer = (clientX: number) => {
    const r = track.current?.getBoundingClientRect()
    if (!r) return
    setTime(Math.min(DURATION - 0.001, Math.max(0, ((clientX - r.left) / r.width) * DURATION)))
  }

  const ch = chapterAt(t)
  const Scene = scenes[ch]
  const vb = `0 0 ${L.W} ${L.H}`

  return (
    <div ref={wrap} className="absolute inset-0 flex select-none flex-col bg-[#0A0A14] text-[#F4F1EA]">
      <div ref={stage} className="relative min-h-0 flex-1 cursor-pointer overflow-hidden" onClick={() => setPlaying((p) => !p)}>
        <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" role="img" aria-label={`Signal motion identity — chapter ${chapters[ch].n}, ${chapters[ch].name}`}>
          <Scene t={t} L={L} w={w} id={id} />
          <Hud t={t} L={L} color={hudColor(t)} />
        </svg>
        {!playing && (
          <span className={cn(mono, 'pointer-events-none absolute left-1/2 top-[clamp(12px,3cqw,28px)] -translate-x-1/2 rounded-full @max-2xl:hidden bg-[#0A0A14]/80 px-3 py-1.5 text-[9px] text-[#F4F1EA] backdrop-blur')}>
            Paused{reduce ? ' · reduced motion' : ''}
          </span>
        )}
      </div>

      {/* Player */}
      <div className="shrink-0 border-t border-[#F4F1EA]/10 bg-[#0A0A14] px-[clamp(12px,3cqw,28px)] pb-[clamp(10px,2cqw,18px)] pt-2">
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Timeline"
          aria-valuemin={0}
          aria-valuemax={DURATION}
          aria-valuenow={Number(t.toFixed(1))}
          aria-valuetext={`${t.toFixed(1)} of ${DURATION} seconds — chapter ${chapters[ch].n}, ${chapters[ch].name}`}
          className={cn('group relative h-7 cursor-pointer touch-none rounded-[2px]', focus)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { resume: playing }
            setPlaying(false)
            seekFromPointer(e.clientX)
          }}
          onPointerMove={(e) => drag.current && seekFromPointer(e.clientX)}
          onPointerUp={() => {
            if (drag.current?.resume) setPlaying(true)
            drag.current = null
          }}
          onPointerCancel={() => {
            if (drag.current?.resume) setPlaying(true)
            drag.current = null
          }}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 0.1 : 1
            const keys: Record<string, () => void> = {
              ArrowRight: () => setTime(Math.min(DURATION - 0.001, t + step)),
              ArrowUp: () => setTime(Math.min(DURATION - 0.001, t + step)),
              ArrowLeft: () => setTime(Math.max(0, t - step)),
              ArrowDown: () => setTime(Math.max(0, t - step)),
              Home: () => setTime(0),
              End: () => setTime(DURATION - 0.001),
              PageUp: () => setTime(chapters[Math.min(chapters.length - 1, ch + 1)].start),
              PageDown: () => setTime(chapters[Math.max(0, ch - 1)].start),
              ' ': () => setPlaying((p) => !p),
            }
            const fn = keys[e.key]
            if (fn) {
              e.preventDefault()
              fn()
            }
          }}
        >
          {chapters.map((c, i) => {
            const k = Math.min(1, Math.max(0, (t - c.start) / (c.end - c.start)))
            return (
              <span key={c.n} className="absolute top-1/2 h-[3px] -translate-y-1/2 overflow-hidden bg-[#F4F1EA]/15 transition-[height] group-hover:h-[5px]" style={{ left: `calc(${(c.start / DURATION) * 100}% + ${i ? 2 : 0}px)`, width: `calc(${((c.end - c.start) / DURATION) * 100}% - ${i ? 2 : 0}px)` }}>
                <span className="absolute inset-0 origin-left" style={{ transform: `scaleX(${k})`, background: i === ch ? '#3D4BFF' : '#F4F1EA' }} />
              </span>
            )
          })}
          <span className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4F1EA] shadow-[0_0_0_4px_rgba(61,75,255,0.45)]" style={{ left: `${(t / DURATION) * 100}%` }} />
        </div>

        <div className="mt-1.5 flex items-center gap-2.5 @md:gap-3">
          <button type="button" onClick={() => setPlaying((p) => !p)} className={cn('grid size-10 shrink-0 place-items-center rounded-full bg-[#F4F1EA] text-[#0A0A14] transition-transform hover:scale-105', focus)} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="translate-x-px" />}
          </button>
          <span className={cn(mono, 'shrink-0 whitespace-nowrap text-[10px] tabular-nums text-[#F4F1EA]/70')}>
            {fmtTime(t)}<span className="text-[#F4F1EA]/35 @max-md:hidden"> / 0:20</span>
          </span>
          <div className="-my-1 flex min-w-0 flex-1 gap-1 overflow-x-auto py-1 [scrollbar-width:none]" role="group" aria-label="Chapters">
            {chapters.map((c, i) => (
              <button
                key={c.n}
                type="button"
                onClick={() => setTime(c.start + 0.001)}
                aria-current={i === ch ? 'step' : undefined}
                className={cn(
                  mono,
                  'flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-[9px] transition-colors @max-3xl:px-2.5',
                  i === ch ? 'border-[#3D4BFF] bg-[#3D4BFF] text-[#F4F1EA]' : 'border-[#F4F1EA]/15 text-[#F4F1EA]/65 hover:border-[#F4F1EA]/50 hover:text-[#F4F1EA]',
                  focus,
                )}
              >
                <span className={i === ch ? 'text-[#FFB8DA]' : 'text-[#F4F1EA]/40'}>{c.n}</span>
                <span className="@max-3xl:hidden">{c.name}</span>
              </button>
            ))}
          </div>
          <span className={cn(mono, 'hidden shrink-0 text-[9px] text-[#F4F1EA]/45 @5xl:inline')}>
            Space · play/pause
          </span>
        </div>
      </div>
      {!embedded && <span className="sr-only">Press Space to play or pause. Use the arrow keys on the timeline to scrub.</span>}
    </div>
  )
}
