import { about } from '@/data/content'
import { site } from '@/config/site'
import { MaskHeading } from '@/components/ui/MaskHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-ivory py-[clamp(96px,12vw,180px)] text-graphite">
      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="label-mono text-ink-muted">(03)</span>
          <span className="h-px flex-1 bg-graphite/15" />
          <span className="label-mono text-ink-muted">About</span>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-12">
          <MaskHeading
            id="about-title"
            lines={about.headline.map((l, i) =>
              i === about.headline.length - 1 ? (
                <>
                  {l.replace(/\.$/, '')}
                  <span className="text-signal-deep">.</span>
                </>
              ) : (
                l
              ),
            )}
            className="display col-span-12 text-[clamp(2.75rem,8.2vw,8.75rem)] lg:col-span-8"
            lineClassName="[&:nth-child(2)]:pl-[0.9em] [&:nth-child(3)]:pl-[1.8em] max-sm:!pl-0"
          />
          <Reveal delay={0.1} className="col-span-12 flex flex-col gap-6 self-end text-[18px] leading-relaxed text-graphite/80 lg:col-span-4">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-[21px] leading-snug text-graphite' : ''}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="mt-[clamp(72px,9vw,130px)] grid grid-cols-12 gap-x-6 gap-y-10 border-t border-graphite/15 pt-10">
          <div className="col-span-12 lg:col-span-3">
            <h3 className="label-mono text-ink-muted">What I value</h3>
          </div>
          <Stagger className="col-span-12 grid gap-px overflow-hidden rounded-[4px] border border-graphite/12 bg-graphite/12 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-5" stagger={0.08}>
            {about.values.map((v, i) => (
              <StaggerItem key={v} className="group relative flex min-h-[150px] flex-col justify-between gap-6 bg-ivory p-5 transition-colors duration-500 hover:bg-graphite hover:text-ivory">
                <span className="label-mono text-ink-muted transition-colors group-hover:text-signal">0{i + 1}</span>
                <span className="font-display text-[22px] font-medium leading-[1.05] tracking-[-0.02em]">{v}</span>
                <span className="absolute right-5 top-5 size-2 bg-signal opacity-0 transition-opacity group-hover:opacity-100" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 lg:col-span-3">
            <h3 className="label-mono text-ink-muted">This site is built with</h3>
          </div>
          <Reveal className="col-span-12 lg:col-span-9">
            <ul className="flex flex-wrap gap-2">
              {about.toolkit.map((t) => (
                <li key={t} className="rounded-[3px] border border-graphite/20 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em]">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-[15px] text-ink-muted">
              {site.owner.role}. Every project on this page is a self-initiated concept, designed and built to show the range of work I can deliver.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
