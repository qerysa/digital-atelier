import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { initials, members, PRIORITIES, statusColor, STATUSES, type Priority, type Status } from './data'

export interface PulseTheme {
  name: 'dark' | 'light'
  bg: string
  panel: string
  panel2: string
  line: string
  fg: string
  muted: string
  accent: string
  accentFg: string
  soft: string
  grid: string
  good: string
  bad: string
  warn: string
}

export const themes: Record<'dark' | 'light', PulseTheme> = {
  dark: { name: 'dark', bg: '#0E1015', panel: '#15181F', panel2: '#1B1F28', line: 'rgba(233,235,242,0.08)', fg: '#E9EBF2', muted: '#959AAB', accent: '#8B8BFF', accentFg: '#0E1015', soft: 'rgba(139,139,255,0.14)', grid: 'rgba(233,235,242,0.06)', good: '#3DD6A5', bad: '#FF8A7D', warn: '#F5B544' },
  light: { name: 'light', bg: '#F3F4F7', panel: '#FFFFFF', panel2: '#F6F7FA', line: 'rgba(14,16,21,0.09)', fg: '#14161C', muted: '#5F6574', accent: '#5454E0', accentFg: '#FFFFFF', soft: 'rgba(84,84,224,0.1)', grid: 'rgba(14,16,21,0.06)', good: '#0B8A5E', bad: '#C8372A', warn: '#A86B0C' },
}

export const themeVars = (t: PulseTheme) =>
  ({
    '--p-bg': t.bg,
    '--p-panel': t.panel,
    '--p-panel2': t.panel2,
    '--p-line': t.line,
    '--p-fg': t.fg,
    '--p-muted': t.muted,
    '--p-accent': t.accent,
    '--p-accent-fg': t.accentFg,
    '--p-soft': t.soft,
    '--p-good': t.good,
    '--p-bad': t.bad,
    '--p-warn': t.warn,
    colorScheme: t.name,
  }) as React.CSSProperties

export const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-(--p-accent) focus-visible:ring-offset-1 focus-visible:ring-offset-(--p-bg)'

export function Card({ title, action, children, className, bodyClassName }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn('min-w-0 rounded-[10px] border border-(--p-line) bg-(--p-panel)', className)}>
      {(title || action) && (
        <header className="flex min-h-12 items-center justify-between gap-3 px-4 pt-3">
          {title && <h2 className="text-[13px] font-semibold">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

export function Avatar({ id, size = 26, ring = false }: { id: string; size?: number; ring?: boolean }) {
  const m = members.find((x) => x.id === id)!
  return (
    <span
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold text-[#0E1015]', ring && 'ring-2 ring-(--p-panel)')}
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.38 }}
      title={m.name}
      aria-hidden
    >
      {initials(m.name)}
    </span>
  )
}

export function StatusDot({ status }: { status: Status }) {
  return <span className="inline-block size-2 shrink-0 rounded-full" style={{ background: statusColor[status] }} aria-hidden />
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `color-mix(in oklab, ${statusColor[status]} 16%, transparent)`, color: 'var(--p-fg)' }}>
      <StatusDot status={status} />
      {status}
    </span>
  )
}

/** Inline status editor — a native select styled as a pill (keyboard & screen-reader friendly). */
export function StatusSelect({ value, onChange, label }: { value: Status; onChange: (s: Status) => void; label: string }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute left-2.5">
        <StatusDot status={value} />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Status)}
        className={cn('min-h-8 cursor-pointer appearance-none rounded-full border border-(--p-line) py-1 pl-6 pr-7 text-[12px] font-medium text-(--p-fg) transition-colors hover:border-(--p-muted)', focus)}
        style={{ background: `color-mix(in oklab, ${statusColor[value]} 14%, var(--p-panel))` }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2 text-(--p-muted)" />
    </label>
  )
}

const priorityStyle: Record<Priority, string> = {
  Low: 'text-(--p-muted)',
  Medium: 'text-(--p-fg)',
  High: 'text-(--p-warn)',
  Urgent: 'text-(--p-bad)',
}
export function PriorityTag({ priority }: { priority: Priority }) {
  const level = PRIORITIES.indexOf(priority)
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium', priorityStyle[priority])}>
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn('w-[3px] rounded-[1px] bg-current', i > level && 'opacity-20')} style={{ height: 4 + i * 2.5 }} />
        ))}
      </span>
      {priority}
    </span>
  )
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-[7px] border border-(--p-line) bg-(--p-panel2) p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn('min-h-7 rounded-[5px] px-2.5 text-[11px] font-semibold transition-colors', focus, value === o.id ? 'bg-(--p-panel) text-(--p-fg) shadow-[0_1px_2px_rgba(0,0,0,0.25)]' : 'text-(--p-muted) hover:text-(--p-fg)')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 py-4">
      <span>
        <span className="block text-[13px] font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[12px] text-(--p-muted)">{description}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className={cn('h-6 w-10 rounded-full border border-(--p-line) transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-(--p-accent)', checked ? 'bg-(--p-accent)' : 'bg-(--p-panel2)')} />
        <span className={cn('absolute left-[3px] top-[3px] size-[18px] rounded-full shadow transition-transform duration-300', checked ? 'translate-x-4 bg-(--p-accent-fg)' : 'bg-(--p-muted)')} />
      </span>
    </label>
  )
}

export function Progress({ value, color }: { value: number; color?: string }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-(--p-panel2)" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <span className="block h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${value * 100}%`, background: color ?? 'var(--p-accent)' }} />
    </span>
  )
}

export const pct = (n: number) => `${Math.round(n * 100)}%`
