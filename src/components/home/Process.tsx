import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { processSteps } from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EASE_OUT } from '@/components/ui/Reveal'

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 1.4, ease: EASE_OUT, delay },
})

/** One distinct glyph per stage — each its own visual accent. */
function Glyph({ i }: { i: number }) {
  const common = { fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (i === 0)
    return (
      <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
        <motion.circle cx="34" cy="34" r="20" stroke="#FF5A36" {...common} {...draw(0)} />
        <motion.path d="M49 49 L66 66" stroke="#FF5A36" {...common} {...draw(0.3)} />
        <motion.path d="M34 22 V46 M22 34 H46" stroke="#F1EFE8" strokeOpacity={0.5} {...common} {...draw(0.5)} />
      </svg>
    )
  if (i === 1)
    return (
      <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
        <motion.path d="M10 62 C 24 10, 56 70, 70 18" stroke="#D6FF52" {...common} {...draw(0)} />
        <motion.path d="M10 62 L24 30 M70 18 L56 48" stroke="#F1EFE8" strokeOpacity={0.5} {...common} {...draw(0.4)} />
        <motion.rect x="7" y="59" width="6" height="6" stroke="#F1EFE8" {...common} {...draw(0.6)} />
        <motion.rect x="67" y="15" width="6" height="6" stroke="#F1EFE8" {...common} {...draw(0.6)} />
      </svg>
    )
  if (i === 2)
    return (
      <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
        <motion.path d="M28 20 L10 40 L28 60" stroke="#F1EFE8" {...common} {...draw(0)} />
        <motion.path d="M52 20 L70 40 L52 60" stroke="#F1EFE8" {...common} {...draw(0.15)} />
        <motion.path d="M46 14 L34 66" stroke="#FF5A36" {...common} {...draw(0.4)} />
      </svg>
    )
  return (
    <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
      <motion.rect x="12" y="12" width="56" height="56" rx="2" stroke="#F1EFE8" strokeOpacity={0.5} {...common} {...draw(0)} />
      <motion.path d="M26 41 L36 51 L56 29" stroke="#D6FF52" {...common} strokeWidth={2} {...draw(0.4)} />
    </svg>
  )
}

export function Process() {
  const track = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="process" aria-labelledby="process-title" className="py-[clamp(96px,12vw,180px)]">
      <div className="shell">
        <SectionHeader
          id="process-title"
          index="04"
          label="Process"
          title={['From idea', <>to execution<span className="text-signal">.</span></>]}
          aside={<p className="max-w-sm text-[17px] leading-relaxed">A clear, predictable workflow — you always know what is happening, what comes next and when it will be ready.</p>}
        />

        <ol ref={track} className="relative mt-[clamp(64px,8vw,110px)] grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {/* progress rail */}
          <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-ivory/12 lg:block">
            <motion.div className="h-full origin-left bg-signal" style={{ scaleX: reduce ? 1 : progress }} />
          </div>
          {processSteps.map((s, i) => (
            <motion.li
              key={s.n}
              className="relative flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.12 }}
            >
              <span aria-hidden className="relative z-10 mb-10 hidden size-[15px] place-items-center rounded-full border border-ivory/30 bg-graphite lg:grid">
                <span className={i % 2 ? 'size-[5px] rounded-full bg-lime' : 'size-[5px] rounded-full bg-signal'} />
              </span>
              <div className="flex items-start justify-between border-t border-ivory/12 pt-6 lg:border-0 lg:pt-0">
                <span className="display text-[clamp(4rem,7vw,6.5rem)] text-transparent [-webkit-text-stroke:1px_rgb(241_239_232/0.45)]">{s.n}</span>
                <Glyph i={i} />
              </div>
              <h3 className="mt-6 font-display text-[28px] font-medium uppercase tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-3 max-w-xs text-[16px] leading-relaxed text-ivory/70">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
