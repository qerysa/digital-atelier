import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { services } from '@/data/content'
import { getProject } from '@/data/projects'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EASE_OUT, Stagger, StaggerItem } from '@/components/ui/Reveal'

export function Services() {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null)
  return (
    <section id="services" aria-labelledby="services-title" className="relative border-t border-ivory/10 bg-graphite-800 py-[clamp(96px,12vw,180px)]">
      <div className="shell">
        <SectionHeader
          id="services-title"
          index="02"
          label="Services"
          title={['What I can do', <>for you<span className="text-signal">.</span></>]}
          aside={
            <p className="max-w-sm text-[17px] leading-relaxed">
              Five focused ways to work together. Open a service to see what it includes — each one links to a concept that shows it in practice.
            </p>
          }
        />

        <Stagger className="mt-[clamp(56px,7vw,96px)] border-t border-ivory/12" stagger={0.07}>
          {services.map((s, i) => {
            const isOpen = open === s.id
            const related = s.relatedProject ? getProject(s.relatedProject) : undefined
            const Icon = s.icon
            return (
              <StaggerItem key={s.id} className="border-b border-ivory/12">
                <h3>
                  <button
                    type="button"
                    id={`svc-${s.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${s.id}`}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    className="group grid w-full grid-cols-12 items-center gap-x-6 gap-y-3 py-7 text-left md:py-9"
                  >
                    <span className={cn('label-mono col-span-2 transition-colors md:col-span-1', isOpen ? 'text-signal' : 'text-muted group-hover:text-signal')}>
                      0{i + 1}
                    </span>
                    <span className="col-span-8 font-display text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium uppercase leading-none tracking-[-0.035em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:col-span-6">
                      {s.title}
                    </span>
                    <span className="col-span-4 hidden text-[15px] leading-snug text-muted lg:block">{s.summary}</span>
                    <span className="col-span-2 flex justify-end md:col-span-5 lg:col-span-1">
                      <span
                        className={cn(
                          'grid size-11 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)]',
                          isOpen ? 'rotate-45 border-signal bg-signal text-graphite' : 'border-ivory/20 group-hover:border-ivory/60',
                        )}
                      >
                        <Plus size={18} strokeWidth={1.75} />
                      </span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`svc-panel-${s.id}`}
                      role="region"
                      aria-labelledby={`svc-${s.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-6 gap-y-8 pb-10 md:pb-12">
                        <div className="col-span-12 md:col-span-6 md:col-start-2">
                          <motion.div
                            initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
                            className="mb-6 grid size-14 place-items-center rounded-[4px] bg-ivory text-graphite"
                          >
                            <Icon size={24} strokeWidth={1.5} />
                          </motion.div>
                          <p className="max-w-xl text-lg leading-relaxed text-ivory/85">{s.description}</p>
                          <p className="mt-4 text-muted lg:hidden">{s.summary}</p>
                          {related && (
                            <Link
                              to={`/work/${related.slug}`}
                              className="group/rel mt-8 inline-flex items-center gap-2 border-b border-ivory/25 pb-1 label-mono text-ivory transition-colors hover:border-signal hover:text-signal"
                            >
                              See it in practice: {related.title}
                              <ArrowUpRight size={15} className="transition-transform group-hover/rel:-translate-y-0.5 group-hover/rel:translate-x-0.5" />
                            </Link>
                          )}
                        </div>
                        <ul className="col-span-12 grid content-start gap-px overflow-hidden rounded-[4px] border border-ivory/10 bg-ivory/10 sm:grid-cols-2 md:col-span-5">
                          {s.capabilities.map((c, ci) => (
                            <motion.li
                              key={c}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.12 + ci * 0.05, duration: 0.5, ease: EASE_OUT }}
                              className="flex items-start gap-3 bg-graphite-800 p-4 text-[15px] sm:odd:last:col-span-2"
                            >
                              <span className="mt-2 size-1.5 shrink-0 bg-lime" />
                              {c}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
