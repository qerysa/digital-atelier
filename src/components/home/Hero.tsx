import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { hero } from '@/data/content'
import { projects } from '@/data/projects'
import { Button } from '@/components/ui/Button'
import { MaskHeading } from '@/components/ui/MaskHeading'
import { EASE_OUT } from '@/components/ui/Reveal'
import { HeroVisual } from './HeroVisual'

function renderLine(line: string) {
  const word = hero.accentWord
  const i = line.toLowerCase().indexOf(word.toLowerCase())
  if (i === -1) return line
  return (
    <>
      {line.slice(0, i)}
      <span className="text-signal">{line.slice(i, i + word.length)}</span>
      {line.slice(i + word.length)}
    </>
  )
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[76px]">
      {/* Fine editorial grid lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="shell grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={i >= 4 ? 'hidden border-l border-ivory/[0.045] lg:block' : 'border-l border-ivory/[0.045]'} />
          ))}
        </div>
      </div>

      <div className="shell relative flex flex-1 flex-col justify-center gap-8 py-10 lg:gap-10 lg:py-14">
        <motion.p
          className="label-mono relative z-10 flex items-center gap-4 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span>(00)</span>
          <span>Portfolio — Selected work 01—{String(projects.length).padStart(2, '0')}</span>
        </motion.p>

        <MaskHeading
          as="h1"
          id="hero-title"
          immediate
          delay={0.15}
          lines={hero.lines.map(renderLine)}
          lineClassName="lg:whitespace-nowrap"
          className="display relative z-10 text-[clamp(2.4rem,10.2vw,5.6rem)] sm:text-[clamp(3.5rem,9vw,6.75rem)] lg:max-w-[64%] lg:text-[clamp(4rem,6.3vw,6.8rem)]"
        />

        <HeroVisual className="-mx-[clamp(20px,4.2vw,64px)] -my-4 aspect-square max-h-[46svh] self-stretch sm:mx-auto sm:my-0 sm:max-h-[62svh] sm:w-[min(100%,600px)] sm:self-center lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:aspect-auto lg:max-h-none lg:w-[52%] lg:self-stretch" />

        <motion.div
          className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:max-w-[56%] lg:justify-start lg:gap-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9, ease: EASE_OUT }}
        >
          <p className="max-w-[25rem] text-[17px] leading-relaxed text-ivory/80">{hero.intro}</p>
          <div className="flex shrink-0 flex-col gap-3">
            <Button to="/#work" icon={<ArrowDown size={16} strokeWidth={1.75} />}>
              Explore selected work
            </Button>
            <Button to="/#contact" variant="outline">
              Let&apos;s talk
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="shell relative z-10 flex items-center justify-between border-t border-ivory/10 py-4">
        <span className="label-mono flex items-center gap-3 text-muted">
          <span className="relative block h-6 w-px overflow-hidden bg-ivory/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-signal"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Scroll to explore
        </span>
        <span className="label-mono hidden text-muted sm:block">Design · Development · Motion · Interaction</span>
      </div>
    </section>
  )
}
