import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinePointer } from '@/lib/hooks'

/**
 * A contextual cursor label — appears only over elements marked with
 * data-cursor="Label" (e.g. project previews). The native cursor stays visible,
 * and the label is disabled on touch devices and for reduced motion.
 */
export function CursorLabel() {
  const fine = useFinePointer()
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (!fine || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(target?.dataset.cursor ?? null)
    }
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('scroll', leave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', leave)
    }
  }, [fine, x, y])

  if (!fine) return null
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[75]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <motion.div
            key="cursor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="-ml-12 -mt-12 grid size-24 place-items-center rounded-full bg-signal text-center label-mono !text-[11px] font-medium leading-tight text-graphite"
          >
            <span className="max-w-[70px]">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
