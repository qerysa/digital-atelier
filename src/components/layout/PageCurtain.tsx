import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/** Full-screen wipe that plays between routes. Content swaps while covered. */
export function PageCurtain({ routeKey, label }: { routeKey: string; label: string }) {
  const reduce = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState<{ key: string; label: string } | null>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!reduce) setRun({ key: routeKey + Date.now(), label })
  }, [routeKey, label, reduce])

  if (!run) return null
  return (
    <motion.div
      key={run.key}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] flex items-end bg-graphite-700"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 1.15, times: [0, 0.36, 0.58, 1], ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setRun(null)}
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
      <div className="shell flex w-full items-end justify-between pb-10">
        <span className="display text-[clamp(2.5rem,8vw,7rem)] text-ivory">{run.label}</span>
        <span className="label-mono hidden text-muted sm:block">Digital Atelier</span>
      </div>
    </motion.div>
  )
}
