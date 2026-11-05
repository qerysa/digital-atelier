import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { getNextProject, projects, type Project } from '@/data/projects'
import { useDocumentMeta } from '@/lib/hooks'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import { MaskHeading } from '@/components/ui/MaskHeading'
import { EASE_OUT, Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { ProjectCover } from '@/components/home/ProjectCover'
import { DemoFrame } from '@/components/case/DemoFrame'
import { Footer } from '@/components/layout/Footer'

function themeVars(p: Project): CSSProperties {
  const t = p.theme
  return {
    ['--cs-bg' as string]: t.bg,
    ['--cs-surface' as string]: t.surface,
    ['--cs-fg' as string]: t.fg,
    ['--cs-muted' as string]: t.muted,
    ['--cs-accent' as string]: t.accent,
    ['--cs-on-accent' as string]: t.onAccent,
    ['--cs-line' as string]: t.line,
    colorScheme: t.scheme,
  }
}

function Block({ n, label, children, className }: { n: string; label: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('shell grid grid-cols-12 gap-x-6 gap-y-8 border-t border-[var(--cs-line)] py-[clamp(64px,8vw,120px)]', className)} aria-label={label}>
      <div className="col-span-12 lg:col-span-3">
        <p className="label-mono flex gap-3 text-[var(--cs-muted)] lg:sticky lg:top-28">
          <span className="text-[var(--cs-accent)]">{n}</span> {label}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-9">{children}</div>
    </section>
  )
}

export function CaseStudyPage({ project }: { project: Project }) {
  const cs = project.caseStudy
  const next = getNextProject(project.slug)
  const position = projects.findIndex((p) => p.slug === project.slug) + 1
  useDocumentMeta(`${project.title} — ${project.category}`, project.description, `/work/${project.slug}`)

  return (
    <div style={themeVars(project)} className="bg-[var(--cs-bg)] text-[var(--cs-fg)] selection:bg-[var(--cs-accent)] selection:text-[var(--cs-on-accent)]">
      {/* 1 — Project hero */}
      <header className="shell pb-12 pt-[124px] md:pt-[150px]">
        <div className="flex items-center justify-between gap-4">
          <Link to="/#work" className="group inline-flex min-h-11 items-center gap-2 label-mono text-[var(--cs-muted)] transition-colors hover:text-[var(--cs-fg)]">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> All work
          </Link>
          <span className="label-mono text-[var(--cs-muted)]">
            {String(position).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label-mono text-[var(--cs-accent)]">{project.category}</span>
          <span className="h-px w-8 bg-[var(--cs-line)]" />
          <span className="label-mono rounded-[3px] border border-[var(--cs-line)] px-2 py-1 text-[var(--cs-muted)]">Self-initiated concept</span>
        </motion.div>
        <MaskHeading as="h1" immediate delay={0.1} lines={[project.title]} className="display mt-6 text-[clamp(4.5rem,17vw,17rem)] !leading-[0.82]" />
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
            className="col-span-12 max-w-2xl font-display text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.02em] lg:col-span-6"
          >
            {cs.tagline}
          </motion.p>
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: EASE_OUT }}
            className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:col-span-6"
          >
            {[
              ['Type', project.type],
              ['Role', cs.role],
              ['Year', project.year],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-[var(--cs-line)] pt-3">
                <dt className="label-mono text-[var(--cs-muted)]">{k}</dt>
                <dd className="mt-2 text-[15px] leading-snug">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 1.2, ease: EASE_OUT }}
        className="shell pb-[clamp(64px,8vw,120px)]"
      >
        <div className="group/cover relative aspect-[4/5] overflow-hidden rounded-[8px] sm:aspect-[16/9]">
          <ProjectCover project={project} />
        </div>
      </motion.div>

      {/* 2 — Overview */}
      <Block n="01" label="Project overview">
        <Reveal>
          <p className="max-w-4xl font-display text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.025em]">{cs.overview}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <p className="label-mono mb-4 text-[var(--cs-muted)]">Scope</p>
          <ul className="flex flex-wrap gap-2">
            {cs.deliverables.map((d) => (
              <li key={d} className="rounded-[3px] border border-[var(--cs-line)] px-3 py-1.5 text-[14px]">
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* 3 — Challenge */}
      <Block n="02" label="The challenge">
        <Reveal>
          <p className="max-w-3xl text-[clamp(1.15rem,1.6vw,1.4rem)] leading-relaxed">{cs.challenge.summary}</p>
        </Reveal>
        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[6px] border border-[var(--cs-line)] bg-[var(--cs-line)] md:grid-cols-2">
          {cs.challenge.points.map((pt, i) => (
            <StaggerItem key={pt} className="flex gap-5 bg-[var(--cs-bg)] p-6 md:p-8">
              <span className="label-mono pt-1 text-[var(--cs-accent)]">Q{i + 1}</span>
              <p className="text-[17px] leading-relaxed">{pt}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Block>

      {/* 4 — Creative direction */}
      <Block n="03" label="Creative direction">
        <Reveal>
          <p className="max-w-3xl text-[clamp(1.15rem,1.6vw,1.4rem)] leading-relaxed">{cs.direction.summary}</p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5" stagger={0.06}>
          {cs.direction.palette.map((s) => (
            <StaggerItem key={s.hex}>
              <div className="aspect-[3/4] rounded-[4px] border border-[var(--cs-line)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5" style={{ background: s.hex }} />
              <p className="mt-3 text-[15px] font-medium">{s.name}</p>
              <p className="font-mono text-[12px] uppercase text-[var(--cs-muted)]">{s.hex}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cs.direction.typography.map((t) => (
            <Reveal key={t.role} className="rounded-[6px] border border-[var(--cs-line)] bg-[var(--cs-surface)] p-6 md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label-mono text-[var(--cs-muted)]">{t.role}</span>
                <span className="text-[14px]">{t.family}</span>
              </div>
              <p className="mt-8 text-[clamp(1.6rem,3vw,2.8rem)] leading-[1.05] [overflow-wrap:anywhere]" style={{ fontFamily: t.css, fontWeight: t.weight }}>
                {t.sample}
              </p>
              <p className="mt-6 text-[15px] tracking-wide text-[var(--cs-muted)]" style={{ fontFamily: t.css }}>
                Aa Bb Cc 0123456789
              </p>
            </Reveal>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {cs.direction.principles.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[16px]">
              <span className="size-2 bg-[var(--cs-accent)]" /> {p}
            </li>
          ))}
        </ul>
      </Block>

      {/* 5 — Design & development */}
      <Block n="04" label="Design & development">
        <ol className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {cs.process.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08}>
              <li className="list-none border-t border-[var(--cs-line)] pt-6">
                <span className="display text-[clamp(2.5rem,4vw,3.5rem)] text-[var(--cs-accent)]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-[24px] font-medium tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[var(--cs-muted)]">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Block>

      {/* 6 — Key features */}
      <Block n="05" label="Key features">
        <Stagger className="grid gap-px overflow-hidden rounded-[6px] border border-[var(--cs-line)] bg-[var(--cs-line)] sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {cs.features.map((f, i) => (
            <StaggerItem key={f.title} className="group flex min-h-[200px] flex-col justify-between gap-8 bg-[var(--cs-bg)] p-6 transition-colors duration-500 hover:bg-[var(--cs-surface)]">
              <span className="label-mono text-[var(--cs-muted)] transition-colors group-hover:text-[var(--cs-accent)]">F.{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-[21px] font-medium tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--cs-muted)]">{f.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Block>

      {/* 7 — Final presentation (live) */}
      <section aria-label="Final presentation" className="border-t border-[var(--cs-line)] py-[clamp(64px,8vw,120px)]">
        <div className="shell">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <p className="label-mono col-span-12 flex gap-3 text-[var(--cs-muted)] lg:col-span-3">
              <span className="text-[var(--cs-accent)]">06</span> Final presentation
            </p>
            <div className="col-span-12 lg:col-span-9">
              <MaskHeading lines={[project.demo.label]} className="display text-[clamp(2.5rem,6vw,5.5rem)]" />
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--cs-muted)]">{cs.finalNote}</p>
            </div>
          </div>
          <Reveal className="mt-12" y={60} amount={0.05}>
            <DemoFrame project={project} />
          </Reveal>
        </div>
      </section>

      {/* 8 — Technologies & tools */}
      <Block n="07" label="Technologies & tools">
        <ul className="border-t border-[var(--cs-line)]">
          {cs.tools.map((t) => (
            <Reveal key={t.name} amount={0.5}>
              <li className="grid grid-cols-12 gap-4 border-b border-[var(--cs-line)] py-5">
                <span className="col-span-12 font-display text-[22px] font-medium tracking-[-0.02em] sm:col-span-5">{t.name}</span>
                <span className="col-span-12 text-[16px] text-[var(--cs-muted)] sm:col-span-7">{t.purpose}</span>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-[14px] text-[var(--cs-muted)]">
          This is a self-initiated concept. It has no client, and the brand, products and content shown are fictional.
        </p>
      </Block>

      {/* 9 — Next project */}
      <section aria-label="Next project" className="border-t border-[var(--cs-line)]">
        <Link to={`/work/${next.slug}`} className="group block" data-cursor="Next case">
          <div className="shell flex flex-col gap-6 py-[clamp(64px,8vw,120px)]">
            <span className="label-mono text-[var(--cs-muted)]">Next project — {next.index}</span>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <span className="display text-[clamp(4rem,13vw,13rem)] !leading-[0.85] transition-colors duration-500 group-hover:text-[var(--cs-accent)]">
                {next.title}
              </span>
              <span className="mb-4 grid size-16 place-items-center rounded-full border border-[var(--cs-line)] transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-[var(--cs-accent)] group-hover:bg-[var(--cs-accent)] group-hover:text-[var(--cs-on-accent)] md:size-24">
                <ArrowUpRight size={28} strokeWidth={1.5} />
              </span>
            </div>
            <span className="label-mono text-[var(--cs-accent)]">{next.category}</span>
          </div>
        </Link>
      </section>
      <Footer />
    </div>
  )
}
