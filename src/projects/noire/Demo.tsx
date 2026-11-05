import '@fontsource-variable/bodoni-moda/index.css'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Hand, Pause, Play, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { asset, cn, hasWebGL } from '@/lib/utils'
import type { DemoProps } from '../registry'
import { DURATION, moods, type Mood, type NoireHandle } from './config'

const chapters = [
  { start: 0, end: 5.6, kicker: 'Eau de parfum', title: 'Noiré', sub: null, align: 'left' },
  { start: 6, end: 10.2, kicker: 'The scent', title: 'Amber. Smoke. Light.', sub: 'Warm resin, black tea and a trace of fig.', align: 'right' },
  { start: 10.6, end: 14.8, kicker: 'The cap', title: 'Lacquer & gold', sub: 'Faceted black lacquer, finished with a brushed gold rim.', align: 'left' },
  { start: 15.2, end: 19.4, kicker: 'The flacon', title: 'Weighted glass', sub: 'A 50 ml bottle with a thick, light-catching base.', align: 'right' },
  { start: 19.8, end: 23.6, kicker: 'Noiré', title: 'Wear the dark.', sub: 'Concept piece · real-time WebGL', align: 'left' },
] as const

/** Where the bottle should sit on screen so it never collides with the copy. */
function framingAt(t: number) {
  const c = chapters.find((ch) => t < ch.end) ?? chapters[0]
  return c.align === 'left' ? 1 : -1
}

const moodList: { id: Mood; label: string }[] = [
  { id: 'amber', label: 'Amber' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'gold', label: 'Gold' },
]

const serif = "font-['Bodoni_Moda_Variable',Didot,serif]"
const mono = "font-['IBM_Plex_Mono',monospace] uppercase tracking-[0.24em]"
const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-[#D2A867] focus-visible:ring-offset-2 focus-visible:ring-offset-black'

/** NOIRÉ — a real-time 3D product film. */
export default function NoireDemo({ embedded }: DemoProps) {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const handle = useRef<NoireHandle | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [playing, setPlaying] = useState(!reduce)
  const [mood, setMood] = useState<Mood>('amber')
  const [chapter, setChapter] = useState(0)
  const [touched, setTouched] = useState(false)
  const chapterRef = useRef(-1)

  const onFrame = useCallback((t: number) => {
    if (bar.current) bar.current.style.transform = `scaleX(${t / DURATION})`
    const i = chapters.findIndex((c) => t >= c.start && t < c.end)
    if (i !== chapterRef.current) {
      chapterRef.current = i
      setChapter(i)
    }
  }, [])

  useEffect(() => {
    if (!canvas.current) return
    if (!hasWebGL()) {
      setStatus('error')
      return
    }
    let disposed = false
    import('./scene')
      .then(({ createNoireScene }) => {
        if (disposed || !canvas.current) return
        handle.current = createNoireScene(canvas.current, {
          onFrame,
          framingAt,
          onReady: () => setStatus('ready'),
          reducedMotion: !!reduce,
          maxDpr: embedded ? 1.5 : 1.75,
        })
      })
      .catch((err) => {
        console.warn('[noire] WebGL scene failed to start', err)
        setStatus('error')
      })
    return () => {
      disposed = true
      handle.current?.dispose()
      handle.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pause rendering when off-screen or the tab is hidden
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    let visible = true
    const update = () => handle.current?.setActive(visible && !document.hidden)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [status])

  useEffect(() => handle.current?.setPlaying(playing), [playing])
  useEffect(() => handle.current?.setMood(mood), [mood])

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    handle.current?.seek(k * DURATION)
    onFrame(k * DURATION)
  }

  const c = chapter >= 0 ? chapters[chapter] : null
  const accent = mood === 'midnight' ? '#B9B2FF' : '#E3C38A'

  return (
    <div ref={wrap} className="absolute inset-0 select-none overflow-hidden bg-[#070607] text-[#EEE6D8]" onPointerDown={() => setTouched(true)}>
      <canvas ref={canvas} className={cn('absolute inset-0 size-full transition-opacity duration-1000', status === 'ready' ? 'opacity-100' : 'opacity-0')} aria-label="Interactive 3D perfume bottle. Drag to rotate." role="img" />

      {status !== 'ready' && (
        <div className="absolute inset-0">
          <img src={asset('/images/noire-poster-1600.webp')} srcSet={`${asset('/images/noire-poster-960.webp')} 960w, ${asset('/images/noire-poster-1600.webp')} 1600w`} sizes="100vw" alt="" className="size-full object-cover opacity-60" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            {status === 'loading' ? (
              <p className={cn(mono, 'text-[10px] text-[#EEE6D8]/70')}>Preparing the scene…</p>
            ) : (
              <div className="max-w-sm bg-black/60 p-6 backdrop-blur">
                <p className={cn(mono, 'text-[10px] text-[#D2A867]')}>3D unavailable</p>
                <p className="mt-3 text-[14px] leading-relaxed">Your browser couldn’t start WebGL, so here is a still frame of the scene. Try a recent desktop browser to explore it live.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vignette for legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Chapter text */}
      <div className="pointer-events-none absolute inset-0 p-[clamp(20px,5cqw,64px)] pb-[96px]">
        <AnimatePresence mode="wait">
          {status === 'ready' && c && (
            <motion.div
              key={chapter}
              className={cn(
                'absolute max-w-[min(42%,520px)] @max-xl:inset-x-[clamp(20px,5cqw,64px)] @max-xl:top-[clamp(20px,5cqw,64px)] @max-xl:max-w-none',
                c.align === 'left' && 'left-[clamp(20px,5cqw,64px)] top-1/2 -translate-y-1/2 @max-xl:translate-y-0',
                c.align === 'right' && 'right-[clamp(20px,5cqw,64px)] top-1/2 -translate-y-1/2 text-right @max-xl:translate-y-0 @max-xl:text-left',
              )}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.p className={cn(mono, 'text-[10px]')} style={{ color: accent }} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } }, exit: { opacity: 0, transition: { duration: 0.4 } } }}>
                {c.kicker}
              </motion.p>
              <h2 className={cn(serif, 'mt-4 text-[clamp(34px,6.4cqw,96px)] font-medium leading-[0.92] tracking-[-0.01em]', chapter === 0 && 'italic text-[clamp(56px,11cqw,170px)]')}>
                {c.title.split(' ').map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em] pr-[0.22em] align-bottom last:-mr-[0.1em] last:pr-[0.1em]">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 },
                        show: { y: 0, opacity: 1, transition: { delay: 0.15 + i * 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
                        exit: { y: reduce ? 0 : '-30%', opacity: 0, transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } },
                      }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h2>
              {c.sub && (
                <motion.p className="mt-4 text-[clamp(13px,1.35cqw,16px)] leading-relaxed text-[#EEE6D8]/70" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.6, duration: 1 } }, exit: { opacity: 0, transition: { duration: 0.3 } } }}>
                  {c.sub}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drag hint */}
      <AnimatePresence>
        {status === 'ready' && !touched && (
          <motion.p className={cn(mono, 'pointer-events-none absolute right-[clamp(20px,5cqw,64px)] top-[clamp(20px,5cqw,48px)] flex items-center gap-2 text-[9px] text-[#EEE6D8]/60 @max-xl:hidden')} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.5 } }} exit={{ opacity: 0 }}>
            <Hand size={13} /> Drag to rotate
          </motion.p>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-[clamp(16px,4cqw,48px)] pb-[clamp(14px,2.5cqw,28px)] pt-10">
        <div
          className="group relative h-4 cursor-pointer"
          onPointerDown={(e) => {
            e.stopPropagation()
            seek(e)
          }}
          role="slider"
          aria-label="Film position"
          aria-valuemin={0}
          aria-valuemax={DURATION}
          aria-valuenow={Math.max(0, chapter) * 5}
          aria-valuetext={c ? `Chapter ${chapter + 1}: ${c.title}` : 'Between chapters'}
          tabIndex={0}
          onKeyDown={(e) => {
            const idx = Math.max(0, chapter)
            if (e.key === 'ArrowRight') handle.current?.seek(chapters[Math.min(chapters.length - 1, idx + 1)].start + 0.01)
            if (e.key === 'ArrowLeft') handle.current?.seek(chapters[Math.max(0, idx - 1)].start + 0.01)
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#EEE6D8]/20" />
          <div ref={bar} className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left scale-x-0" style={{ background: accent }} />
          {chapters.map((ch, i) => (
            <span key={i} className={cn('absolute top-1/2 h-2 w-px -translate-y-1/2 transition-colors', i === chapter ? 'bg-[#EEE6D8]' : 'bg-[#EEE6D8]/30')} style={{ left: `${(ch.start / DURATION) * 100}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPlaying((p) => !p)} className={cn('grid size-10 place-items-center rounded-full border border-[#EEE6D8]/25 bg-black/30 backdrop-blur transition-colors hover:border-[#EEE6D8]/70', focus)} aria-label={playing ? 'Pause film' : 'Play film'}>
              {playing ? <Pause size={15} /> : <Play size={15} className="translate-x-px" />}
            </button>
            <button
              type="button"
              onClick={() => {
                handle.current?.replay()
                setPlaying(true)
              }}
              className={cn('grid size-10 place-items-center rounded-full border border-[#EEE6D8]/25 bg-black/30 backdrop-blur transition-colors hover:border-[#EEE6D8]/70', focus)}
              aria-label="Replay from the start"
            >
              <RotateCcw size={15} />
            </button>
            <span className={cn(mono, 'ml-2 hidden text-[9px] text-[#EEE6D8]/55 @lg:inline')}>
              {String(Math.max(1, chapter + 1)).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
            </span>
          </div>
          <div role="radiogroup" aria-label="Lighting mood" className="flex rounded-full border border-[#EEE6D8]/20 bg-black/35 p-1 backdrop-blur">
            {moodList.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mood === m.id}
                onClick={() => setMood(m.id)}
                className={cn(mono, 'flex min-h-8 items-center gap-2 rounded-full px-3 text-[9px] transition-colors', focus, mood === m.id ? 'bg-[#EEE6D8] text-[#0b0706]' : 'text-[#EEE6D8]/70 hover:text-[#EEE6D8]')}
              >
                <span className="size-2 rounded-full" style={{ background: moods[m.id].rimA }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
