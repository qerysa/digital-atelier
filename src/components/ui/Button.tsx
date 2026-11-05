import { ArrowUpRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'light'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  className?: string
  /** Show the bracket frame: [ LABEL ] */
  brackets?: boolean
  icon?: ReactNode | false
}

type ButtonProps = BaseProps &
  (
    | ({ to: string; href?: never } & { onClick?: () => void; 'aria-label'?: string })
    | ({ href: string; to?: never } & { onClick?: () => void; 'aria-label'?: string; target?: string; rel?: string })
    | ({ to?: never; href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
  )

const variants: Record<Variant, string> = {
  primary: 'bg-signal text-graphite before:bg-ivory',
  outline: 'border border-ivory/25 text-ivory before:bg-ivory hover:text-graphite',
  ghost: 'text-ivory before:bg-ivory/10',
  light: 'bg-graphite text-ivory before:bg-signal hover:text-graphite',
}

/**
 * Atelier button: mono label in brackets, fill sweep + bracket expansion on hover.
 */
export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className, brackets = true, icon, ...rest } = props
  const classes = cn(
    'group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[3px] px-5 py-3 label-mono !text-[13px] font-medium transition-colors duration-300',
    'before:absolute before:inset-0 before:-z-0 before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[var(--ease-out-expo)] hover:before:scale-x-100 focus-visible:before:scale-x-100',
    variants[variant],
    className,
  )
  const inner = (
    <span className="relative z-10 inline-flex items-center gap-3">
      {brackets && <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1">[</span>}
      <span>{children}</span>
      {icon !== false && (
        <span aria-hidden className="inline-flex transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon ?? <ArrowUpRight size={16} strokeWidth={1.75} />}
        </span>
      )}
      {brackets && <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">]</span>}
    </span>
  )
  if ('to' in rest && rest.to) {
    const { to, ...linkRest } = rest
    return (
      <Link to={to} className={classes} {...linkRest}>
        {inner}
      </Link>
    )
  }
  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
