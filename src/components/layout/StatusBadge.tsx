import { site } from '@/config/site'
import { cn } from '@/lib/utils'

export function StatusBadge({ className }: { className?: string }) {
  const { label, availability, available } = site.status
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden
        className={cn('size-2 shrink-0 rounded-full', available ? 'animate-pulse-dot bg-lime' : 'bg-muted')}
      />
      <span className="label-mono !text-[11px] leading-tight">
        <span className="block text-muted">{label}</span>
        <span className="block text-ivory">{availability}</span>
      </span>
    </div>
  )
}
