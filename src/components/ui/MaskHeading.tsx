import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { EASE_OUT } from './Reveal'
import { cn } from '@/lib/utils'

interface MaskHeadingProps {
  id?: string
  lines: ReactNode[]
  as?: ElementType
  className?: string
  lineClassName?: string
  /** Animate on mount instead of when scrolled into view */
  immediate?: boolean
  delay?: number
  stagger?: number
}

/** Headline whose lines slide up from behind a mask. */
export function MaskHeading({ id, lines, as: Tag = 'h2', className, lineClassName, immediate, delay = 0, stagger = 0.09 }: MaskHeadingProps) {
  const trigger = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } }
  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        {...trigger}
      >
        {lines.map((line, i) => (
          <span key={i} className={cn('block overflow-hidden pt-[0.14em] -mt-[0.14em] pb-[0.06em] -mb-[0.06em]', lineClassName)}>
            <motion.span
              className="block will-change-transform"
              variants={{
                hidden: { y: '108%', rotate: 2 },
                show: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: EASE_OUT } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
