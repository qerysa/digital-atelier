import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { activeSocials, contactEmail, displayName, hasEmail, site } from '@/config/site'
import { projects } from '@/data/projects'
import { Link } from '@/lib/router'
import { navItems } from './Nav'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-ivory/10 bg-graphite">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-12 py-16">
        <div className="col-span-12 md:col-span-5">
          <p className="display text-[clamp(2rem,4vw,3.25rem)]">
            {site.brand.name}
            <span className="text-signal">.</span>
          </p>
          <p className="mt-4 max-w-sm text-muted">{site.owner.role}</p>
          {hasEmail && (
            <a href={`mailto:${contactEmail}`} className="mt-8 inline-flex items-center gap-2 border-b border-ivory/25 pb-1 text-lg transition-colors hover:border-signal hover:text-signal">
              {contactEmail}
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </a>
          )}
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2">
          <p className="label-mono mb-5 text-muted">Index</p>
          <ul className="space-y-3">
            {navItems.map((n) => (
              <li key={n.id}>
                <Link to={`/#${n.id}`} className="transition-colors hover:text-signal">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-2">
          <p className="label-mono mb-5 text-muted">Work</p>
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link to={`/work/${p.slug}`} className="transition-colors hover:text-signal">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <p className="label-mono mb-5 text-muted">Elsewhere</p>
          {activeSocials.length > 0 ? (
            <ul className="space-y-3">
              {activeSocials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 transition-colors hover:text-signal">
                    {s.label}
                    <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Profiles coming soon.</p>
          )}
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 py-6">
        <p className="label-mono text-muted">
          © {year} {displayName}. All projects shown are self-initiated concepts.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="group inline-flex min-h-11 items-center gap-2 label-mono text-muted transition-colors hover:text-ivory"
        >
          Back to top
          <span className="grid size-8 place-items-center rounded-full border border-ivory/20 transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-graphite">
            <ArrowUp size={14} />
          </span>
        </button>
      </div>
    </footer>
  )
}
