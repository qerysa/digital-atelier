import { Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Coffee } from './data'
import { roastLevel } from './data'
import { CoffeeBag } from './CoffeeBag'

export const C = {
  espresso: '#1E140F',
  roast: '#2A1A12',
  cream: '#F3E9DC',
  sand: '#E6D6C2',
  ink: '#2A160E',
  muted: '#7A5A45',
  terracotta: '#C4552D',
  amber: '#E39A4F',
}

export const serif = "font-['Fraunces_Variable',Georgia,serif]"
export const mono = "font-['IBM_Plex_Mono',monospace] uppercase tracking-[0.16em]"
export const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-[#E39A4F] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

export function EButton({
  children,
  onClick,
  variant = 'solid',
  className,
  type = 'button',
  disabled,
  ...rest
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'light' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  autoFocus?: boolean
  'aria-label'?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] px-5 text-[12px] font-medium uppercase tracking-[0.16em] transition-[background-color,color,transform,border-color] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
        focus,
        variant === 'solid' && 'bg-[#C4552D] text-[#F7EEE2] hover:bg-[#A9441F]',
        variant === 'outline' && 'border border-current/30 hover:border-current',
        variant === 'light' && 'bg-[#F3E9DC] text-[#2A160E] hover:bg-white',
        variant === 'ghost' && 'px-2 hover:opacity-70',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function RoastMeter({ coffee, className }: { coffee: Coffee; className?: string }) {
  const level = roastLevel[coffee.roast]
  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={`${coffee.roast} roast`}>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn('h-[3px] w-4 rounded-full', i < level ? 'bg-[#C4552D]' : 'bg-current opacity-20')} />
        ))}
      </span>
      <span className={cn(mono, 'text-[10px]')}>{coffee.roast}</span>
    </span>
  )
}

/** Product image panel: the parametric bag on a softly lit, colour-matched backdrop. */
export function BagStage({ coffee, className, bagClassName }: { coffee: Coffee; className?: string; bagClassName?: string }) {
  return (
    <div
      className={cn('relative grid place-items-center overflow-hidden', className)}
      style={{ background: `radial-gradient(120% 90% at 50% 18%, #F7EEE2 0%, ${C.sand} 55%, color-mix(in oklab, ${coffee.bag} 22%, ${C.sand}) 100%)` }}
    >
      <CoffeeBag coffee={coffee} className={cn('h-[82%] w-auto drop-shadow-[0_18px_24px_rgba(42,22,14,0.18)]', bagClassName)} />
    </div>
  )
}

export function QtyStepper({ value, onChange, max = 20, label, size = 'md' }: { value: number; onChange: (v: number) => void; max?: number; label: string; size?: 'sm' | 'md' }) {
  const btn = cn('grid place-items-center transition-colors hover:bg-black/5 disabled:opacity-30', focus, size === 'sm' ? 'size-9' : 'size-11')
  return (
    <div className="inline-flex items-center rounded-[3px] border border-current/20" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= (size === 'sm' ? 0 : 1)}>
        <Minus size={14} />
      </button>
      <span className={cn('min-w-8 text-center text-sm tabular-nums', size === 'md' && 'min-w-10')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= max}>
        <Plus size={14} />
      </button>
    </div>
  )
}
