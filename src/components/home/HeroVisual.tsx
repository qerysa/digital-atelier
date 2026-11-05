import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { hero } from '@/data/content'
import { asset, canRunHeavy3D, cn } from '@/lib/utils'
import type { HeroSceneHandle } from '@/three/heroScene'

const labelPositions = [
  'left-[26%] top-[14%]',
  'right-[5%] top-[24%]',
  'left-[28%] bottom-[13%]',
  'right-[7%] bottom-[19%]',
]

/**
 * Hero 3D composition. The WebGL scene is code-split and only loaded on capable
 * devices once the hero is visible; everyone else gets a pre-rendered poster.
 */
export function HeroVisual({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<HeroSceneHandle | null>(null)
  const [use3D, setUse3D] = useState(false)
  const [ready, setReady] = useState(false)
  const [posterOk, setPosterOk] = useState(true)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const lx = useTransform(sx, (v) => v * -10)
  const ly = useTransform(sy, (v) => v * -8)

  useEffect(() => {
    setUse3D(canRunHeavy3D())
  }, [])

  // Load the scene lazily
  useEffect(() => {
    if (!use3D || !canvas.current) return
    let disposed = false
    const start = async () => {
      try {
        const { createHeroScene } = await import('@/three/heroScene')
        if (disposed || !canvas.current) return
        handle.current = createHeroScene(canvas.current, { onReady: () => setReady(true) })
      } catch (err) {
        console.warn('[hero] 3D scene unavailable, showing poster instead.', err)
        setUse3D(false)
      }
    }
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const id = idle ? idle(start, { timeout: 900 }) : window.setTimeout(start, 250)
    return () => {
      disposed = true
      if (!idle) clearTimeout(id)
      handle.current?.dispose()
      handle.current = null
    }
  }, [use3D])

  // Pointer, scroll and visibility wiring
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      px.set(x)
      py.set(y)
      handle.current?.setPointer(x, y)
    }
    const onScroll = () => {
      const h = wrap.current?.offsetHeight || window.innerHeight
      handle.current?.setScroll(Math.min(1.2, window.scrollY / h))
    }
    const io = new IntersectionObserver(([e]) => handle.current?.setActive(e.isIntersecting && !document.hidden), { threshold: 0 })
    if (wrap.current) io.observe(wrap.current)
    const onVis = () => handle.current?.setActive(!document.hidden)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [px, py, ready])

  return (
    <div ref={wrap} className={cn('relative', className)} aria-hidden>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_62%,transparent_100%)]">
      {/* Poster: always rendered first; stays for mobile / reduced motion / no WebGL */}
      {posterOk && (
        <img
          src={asset('/images/hero-poster-1400.webp')}
          srcSet={`${asset('/images/hero-poster-800.webp')} 800w, ${asset('/images/hero-poster-1400.webp')} 1400w`}
          sizes="(min-width: 1024px) 55vw, 100vw"
          alt=""
          width={1400}
          height={1250}
          fetchPriority="high"
          onError={() => setPosterOk(false)}
          className={cn(
            'absolute inset-0 size-full object-contain transition-opacity duration-1000',
            !use3D && 'animate-float motion-reduce:animate-none',
            ready ? 'opacity-0' : 'opacity-100',
          )}
        />
      )}
      {use3D && (
        <canvas
          ref={canvas}
          className={cn('absolute inset-0 size-full transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}
        />
      )}
      </div>

      {/* Technical annotations */}
      <motion.div className="pointer-events-none absolute inset-0 hidden md:block" style={{ x: lx, y: ly }}>
        {hero.labels.map((l, i) => (
          <motion.div
            key={l}
            className={cn('absolute flex items-center gap-3', labelPositions[i])}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={cn('size-1.5 rounded-full', i === 2 ? 'bg-lime' : 'bg-signal')} />
            <span className="label-mono !text-[11px] text-ivory/80">
              <span className="text-muted">0{i + 1} /</span> {l}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
