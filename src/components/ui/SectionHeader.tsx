import type { ReactNode } from 'react'
import { MaskHeading } from './MaskHeading'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode[]
  aside?: ReactNode
  tone?: 'dark' | 'light'
  className?: string
  id?: string
}

/** Editorial section opener: index rail + large title + optional aside. */
export function SectionHeader({ index, label, title, aside, tone = 'dark', className, id }: SectionHeaderProps) {
  const muted = tone === 'dark' ? 'text-muted' : 'text-ink-muted'
  const rule = tone === 'dark' ? 'bg-ivory/12' : 'bg-graphite/15'
  return (
    <header className={cn('grid grid-cols-12 gap-x-6 gap-y-8', className)}>
      <div className="col-span-12 flex items-center gap-4">
        <span className={cn('label-mono', muted)}>({index})</span>
        <span className={cn('h-px flex-1', rule)} />
        <span className={cn('label-mono', muted)}>{label}</span>
      </div>
      <MaskHeading
        id={id}
        lines={title}
        className="display col-span-12 text-[clamp(2.6rem,7vw,7.5rem)] lg:col-span-8"
      />
      {aside && (
        <Reveal delay={0.15} className={cn('col-span-12 self-end lg:col-span-4 lg:pb-3', muted)}>
          {aside}
        </Reveal>
      )}
    </header>
  )
}
