import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { Project } from '@/data/projects'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ProjectCover } from './ProjectCover'

interface ProjectCardProps {
  project: Project
  aspect: string
  layout?: 'wide' | 'stacked'
  className?: string
  /** edge-to-edge cover (no rounded frame) */
  bleed?: boolean
}

function Meta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="label-mono text-signal">{project.category}</span>
      <span className="h-px w-6 bg-ivory/20" />
      <span className="label-mono text-muted">Self-initiated concept</span>
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {tags.map((t) => (
        <li key={t} className="rounded-[3px] border border-ivory/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ivory/70">
          {t}
        </li>
      ))}
    </ul>
  )
}

export function ProjectCard({ project, aspect, layout = 'stacked', className, bleed }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-3.5%', '3.5%'])
  const href = `/work/${project.slug}`

  return (
    <article className={cn('group', className)} aria-labelledby={`p-${project.slug}`}>
      <Reveal y={48} amount={0.15}>
        <div ref={ref} className={cn('relative', bleed ? '' : 'overflow-hidden rounded-[6px]')}>
          <Link
            to={href}
            data-cursor="View case"
            tabIndex={-1}
            aria-hidden
            className={cn('group/cover relative block overflow-hidden', aspect, !bleed && 'rounded-[6px]')}
          >
            <motion.div className="absolute inset-[-4%_0]" style={{ y }}>
              <ProjectCover project={project} />
            </motion.div>
            <span className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-ivory/10" />
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.1} amount={0.3} className={cn(bleed && 'shell')}>
        {layout === 'wide' ? (
          <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 flex items-baseline gap-5 lg:col-span-6">
              <span className="label-mono pt-2 text-muted">{project.index}</span>
              <h3 id={`p-${project.slug}`} className="display text-[clamp(3rem,8vw,7.5rem)]">
                <Link to={href} className="transition-colors duration-300 hover:text-signal">
                  {project.title}
                </Link>
              </h3>
            </div>
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:col-start-8 lg:pt-4">
              <Meta project={project} />
              <p className="text-[17px] leading-relaxed text-ivory/75">{project.description}</p>
              <Tags tags={project.tags} />
              <div>
                <Button to={href} variant="outline">
                  View case study
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 flex flex-col gap-5">
            <Meta project={project} />
            <h3 id={`p-${project.slug}`} className="display flex items-baseline gap-4 text-[clamp(2.6rem,5vw,4.75rem)]">
              <span className="label-mono text-muted">{project.index}</span>
              <Link to={href} className="transition-colors duration-300 hover:text-signal">
                {project.title}
              </Link>
            </h3>
            <p className="max-w-xl text-[17px] leading-relaxed text-ivory/75">{project.description}</p>
            <Tags tags={project.tags} />
            <div>
              <Button to={href} variant="outline">
                View case study
              </Button>
            </div>
          </div>
        )}
      </Reveal>
    </article>
  )
}
