import { site } from '@/config/site'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className={cn('group inline-flex items-center gap-3', className)} aria-label={`${site.brand.name} — home`}>
      <span className="relative grid size-10 place-items-center rounded-[3px] border border-ivory/20 font-display text-[15px] font-bold tracking-[-0.04em] transition-colors duration-300 group-hover:border-signal">
        {site.brand.initials}
        <span className="absolute -right-px -top-px size-2 bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-150" />
      </span>
      <span className="hidden font-display text-[15px] font-semibold uppercase tracking-[-0.01em] xl:block">{site.brand.name}</span>
    </Link>
  )
}
