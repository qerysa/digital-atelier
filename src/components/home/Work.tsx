import { projects } from '@/data/projects'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from './ProjectCard'

export function Work() {
  const [ember, aurel, pulse, noire, signal] = projects
  const rest = projects.slice(5)
  return (
    <section id="work" aria-labelledby="work-title" className="py-[clamp(96px,13vw,190px)]">
      <div className="shell">
        <SectionHeader
          id="work-title"
          index="01"
          label="Selected work"
          title={[
            'Selected',
            <>
              work<sup className="ml-3 align-top font-mono text-[0.18em] font-normal tracking-normal text-signal">(0{projects.length})</sup>
            </>,
          ]}
          aside={
            <p className="max-w-sm text-[17px] leading-relaxed">
              Five self-initiated concepts — each built to demonstrate a different service, from commerce frontends to real-time 3D. Every case study includes a working demo.
            </p>
          }
        />

        <div className="mt-[clamp(64px,8vw,120px)] grid grid-cols-12 gap-x-6 gap-y-[clamp(80px,10vw,150px)]">
          {ember && <ProjectCard project={ember} layout="wide" aspect="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8.2]" className="col-span-12" />}
          {aurel && <ProjectCard project={aurel} aspect="aspect-[4/5] sm:aspect-[5/4]" className="col-span-12 md:col-span-7" />}
          {pulse && <ProjectCard project={pulse} aspect="aspect-[4/5]" className="col-span-12 md:col-span-5 md:mt-[clamp(120px,14vw,220px)]" />}
        </div>
      </div>

      {noire && (
        <div className="mt-[clamp(80px,10vw,150px)]">
          <ProjectCard project={noire} layout="wide" bleed aspect="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" />
        </div>
      )}

      <div className="shell mt-[clamp(80px,10vw,150px)] grid grid-cols-12 gap-x-6 gap-y-[clamp(80px,10vw,150px)]">
        {signal && <ProjectCard project={signal} aspect="aspect-[4/5] sm:aspect-[16/10]" className="col-span-12 lg:col-span-9 lg:col-start-4" />}
        {rest.map((p, i) => (
          <ProjectCard key={p.slug} project={p} aspect="aspect-[4/5] sm:aspect-[16/10]" className={i % 2 ? 'col-span-12 md:col-span-6 md:mt-32' : 'col-span-12 md:col-span-6'} />
        ))}
      </div>
    </section>
  )
}
