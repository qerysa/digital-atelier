import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  y?: number
  amount?: number
  children: ReactNode
}

/** Fades and lifts content into view once. */
export function Reveal({ delay = 0, y = 28, amount = 0.25, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

export const fadeUpChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
}

type StaggerProps = HTMLMotionProps<'div'> & { stagger?: number; delay?: number; amount?: number; children: ReactNode }

export function Stagger({ stagger = 0.08, delay = 0, amount = 0.2, children, ...rest }: StaggerProps) {
  return (
    <motion.div
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<'div'> & { children: ReactNode }) {
  return (
    <motion.div variants={fadeUpChild} {...rest}>
      {children}
    </motion.div>
  )
}
