import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { activeSocials } from '@/config/site'
import { Link, useRouter } from '@/lib/router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EASE_OUT } from '@/components/ui/Reveal'
import { Logo } from './Logo'
import { StatusBadge } from './StatusBadge'

export const navItems = [
  { id: 'work', label: 'Work', n: '01' },
  { id: 'services', label: 'Services', n: '02' },
  { id: 'about', label: 'About', n: '03' },
  { id: 'contact', label: 'Contact', n: '04' },
]

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const goingDown = y > lastY + 4
      const goingUp = y < lastY - 4
      setState((s) => ({
        scrolled: y > 24,
        hidden: goingDown && y > 480 ? true : goingUp || y < 480 ? false : s.hidden,
      }))
      lastY = y
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return state
}

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    const els = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)))
        // the hero isn't a nav item, so nothing is highlighted above the work section
        setActive(navItems.find((n) => visible.has(n.id))?.id ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled])
  return active
}

export function Nav() {
  const { path } = useRouter()
  const isHome = path === '/'
  const { scrolled, hidden } = useScrollState()
  const active = useActiveSection(isHome)
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled || open || !isHome ? 'border-b border-ivory/10 bg-graphite/80 backdrop-blur-xl' : 'border-b border-transparent',
        )}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <nav aria-label="Primary" className="shell flex h-[76px] items-center justify-between gap-6">
          <div className="flex items-center gap-6 lg:gap-10">
            <Logo />
            <StatusBadge className="hidden md:flex" />
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <Link
                    to={`/#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group relative flex items-center gap-2 px-4 py-3 text-[15px] font-medium text-ivory/80 transition-colors hover:text-ivory"
                  >
                    <span className={cn('label-mono !text-[10px] transition-colors', isActive ? 'text-signal' : 'text-muted group-hover:text-signal')}>
                      {item.n}
                    </span>
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-4 bottom-2 h-px origin-left bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)]',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Button to="/#contact" variant="outline" className="hidden !min-h-11 sm:inline-flex" brackets={false}>
              Let&apos;s talk
            </Button>
            <MenuButton open={open} onToggle={() => setOpen((o) => !o)} />
          </div>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative grid size-11 place-items-center rounded-[3px] border border-ivory/20 lg:hidden"
    >
      <span className={cn('absolute h-px w-5 bg-ivory transition-transform duration-500 ease-[var(--ease-out-expo)]', open ? 'rotate-45' : '-translate-y-[4px]')} />
      <span className={cn('absolute h-px w-5 bg-ivory transition-transform duration-500 ease-[var(--ease-out-expo)]', open ? '-rotate-45' : 'translate-y-[4px]')} />
    </button>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLink.current?.focus(), 250)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-graphite pt-[76px] lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="shell flex flex-1 flex-col justify-between gap-10 overflow-y-auto pb-10 pt-8">
            <StatusBadge />
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE_OUT }}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    to={`/#${item.id}`}
                    onClick={onClose}
                    className="flex items-baseline gap-4 border-b border-ivory/10 py-4"
                  >
                    <span className="label-mono text-signal">{item.n}</span>
                    <span className="display text-[clamp(2.6rem,12vw,4.5rem)]">{item.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button to="/#contact" onClick={onClose}>
                Let&apos;s talk
              </Button>
              {activeSocials.length > 0 && (
                <ul className="flex flex-wrap gap-4">
                  {activeSocials.map((s) => (
                    <li key={s.key}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="label-mono text-muted hover:text-ivory">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
