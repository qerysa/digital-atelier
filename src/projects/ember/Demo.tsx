import '@fontsource-variable/fraunces/index.css'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Menu, ShoppingBag, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn, formatPrice } from '@/lib/utils'
import { DemoOverlay, useDemo } from '../DemoContext'
import type { DemoProps } from '../registry'
import { coffees, sizes, type Coffee, type Grind, type Roast, type SizeId } from './data'
import { AboutPage, CartPage, HomePage, ProductPage, ShopPage } from './pages'
import { useCart } from './store'
import { EButton, focus, mono, serif } from './ui'

export type Route = { name: 'home' } | { name: 'shop'; roast?: Roast } | { name: 'product'; id: string } | { name: 'about' } | { name: 'cart' }
export type Go = (r: Route) => void

const routeKey = (r: Route) => (r.name === 'product' ? `product-${r.id}` : r.name === 'shop' ? `shop-${r.roast ?? 'all'}` : r.name)

const navLinks: { label: string; route: Route }[] = [
  { label: 'Shop', route: { name: 'shop' } },
  { label: 'Light roasts', route: { name: 'shop', roast: 'Light' } },
  { label: 'About', route: { name: 'about' } },
]

/** EMBER — a small multi-page storefront running entirely in the browser. */
export default function EmberDemo(_props: DemoProps) {
  const { scrollRef } = useDemo()
  const cart = useCart()
  const [route, setRoute] = useState<Route>({ name: 'home' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(null)
  const [bump, setBump] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  const go = useCallback<Go>(
    (r) => {
      setRoute(r)
      setMenuOpen(false)
      setNotice(null)
      scrollRef.current?.scrollTo({ top: 0 })
    },
    [scrollRef],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const on = () => setScrolled(el.scrollTop > 24)
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [scrollRef])

  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(() => setNotice(null), 3200)
    return () => clearTimeout(t)
  }, [notice])

  const addToCart = useCallback(
    (c: Coffee, size: SizeId, grind: Grind, qty: number) => {
      cart.add(c.id, size, grind, qty)
      setBump((b) => b + 1)
      setNotice({ id: Date.now(), text: `${qty} × ${c.name} · ${sizes.find((s) => s.id === size)?.label}, ${grind.toLowerCase()}` })
    },
    [cart],
  )
  const quickAdd = useCallback((c: Coffee) => addToCart(c, '250g', 'Whole bean', 1), [addToCart])

  const dark = route.name === 'home' || route.name === 'about'
  const overHero = dark && !scrolled
  const current = coffees.find((c) => route.name === 'product' && c.id === route.id)

  return (
    <div className="min-h-full bg-[#F3E9DC] font-['Inter_Variable',system-ui,sans-serif] text-[#2A160E] antialiased selection:bg-[#C4552D] selection:text-[#F7EEE2]">
      <div className="bg-[#C4552D] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7EEE2]">Free shipping over $50 · Concept store, no real orders</div>
      <header
        className={cn(
          'sticky top-0 z-40 transition-[background-color,color,box-shadow] duration-500',
          overHero ? 'bg-[#1E140F] text-[#F3E9DC]' : 'bg-[#F3E9DC]/95 text-[#2A160E] shadow-[0_1px_0_rgba(42,22,14,0.1)] backdrop-blur',
          dark && !overHero && 'bg-[#1E140F]/95 text-[#F3E9DC] shadow-[0_1px_0_rgba(243,233,220,0.08)]',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-[clamp(20px,5cqw,64px)]">
          <button type="button" onClick={() => go({ name: 'home' })} className={cn('flex items-center gap-2.5', focus)} aria-label="Ember — home">
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M12 5.5c3 3.6 3.8 6 0 12.5-3.8-6.5-3-8.9 0-12.5Z" fill="#C4552D" />
            </svg>
            <span className={cn(serif, 'text-[19px] font-semibold tracking-[0.28em]')}>EMBER</span>
          </button>
          <nav aria-label="Store" className="hidden items-center gap-8 @3xl:flex">
            {navLinks.map((l) => {
              const on = routeKey(l.route) === routeKey(route) || (l.label === 'Shop' && route.name === 'product')
              return (
                <button key={l.label} type="button" onClick={() => go(l.route)} className={cn('relative min-h-10 text-[12px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-70', focus)} aria-current={on ? 'page' : undefined}>
                  {l.label}
                  <span className={cn('absolute inset-x-0 bottom-1.5 h-px origin-left bg-[#C4552D] transition-transform duration-500', on ? 'scale-x-100' : 'scale-x-0')} />
                </button>
              )
            })}
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go({ name: 'cart' })}
              className={cn('relative inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-75', focus)}
              aria-label={`Cart, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="hidden @md:inline">Cart</span>
              <motion.span key={bump} initial={bump ? { scale: 1.6 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="grid h-5 min-w-5 place-items-center rounded-full bg-[#C4552D] px-1.5 text-[10px] tabular-nums text-[#F7EEE2]">
                {cart.count}
              </motion.span>
            </button>
            <button type="button" onClick={() => setMenuOpen(true)} className={cn('grid size-10 place-items-center @3xl:hidden', focus)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={routeKey(route)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            {route.name === 'home' && <HomePage go={go} onQuickAdd={quickAdd} />}
            {route.name === 'shop' && <ShopPage go={go} initialRoast={route.roast} onQuickAdd={quickAdd} />}
            {route.name === 'product' && current && <ProductPage key={current.id} coffee={current} go={go} onAdd={addToCart} onQuickAdd={quickAdd} />}
            {route.name === 'about' && <AboutPage go={go} />}
            {route.name === 'cart' && <CartPage cart={cart} go={go} onCheckout={() => setCheckout(true)} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-[#F3E9DC]/10 bg-[#1E140F] px-[clamp(20px,5cqw,64px)] pb-10 pt-16 text-[#F3E9DC]">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-[#F3E9DC]/10 pb-10">
          <p className={cn(serif, 'max-w-[14ch] text-[clamp(30px,4.4cqw,52px)] font-[420] leading-[1]')}>
            Good coffee, <em className="font-[320] text-[#F0C9A0]">slowly.</em>
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[{ label: 'Home', route: { name: 'home' } as Route }, ...navLinks, { label: 'Cart', route: { name: 'cart' } as Route }].map((l) => (
              <button key={l.label} type="button" onClick={() => go(l.route)} className={cn('min-h-10 text-[12px] uppercase tracking-[0.16em] text-[#F3E9DC]/70 hover:text-[#F3E9DC]', focus)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <p className={cn(mono, 'mt-6 text-[10px] text-[#F3E9DC]/45')}>Ember is a self-initiated concept · No real products or orders</p>
      </footer>

      {/* Mobile navigation drawer */}
      <DemoOverlay>
        <AnimatePresence>
          {menuOpen && (
            <motion.div key="menu" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-[#1E140F]/60 backdrop-blur-[2px]" onClick={() => setMenuOpen(false)} />
              <motion.nav
                aria-label="Store menu"
                className="absolute inset-y-0 right-0 flex w-[min(86%,360px)] flex-col bg-[#1E140F] p-6 text-[#F3E9DC]"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(serif, 'text-[17px] font-semibold tracking-[0.28em]')}>EMBER</span>
                  <button type="button" autoFocus onClick={() => setMenuOpen(false)} className={cn('grid size-10 place-items-center', focus)} aria-label="Close menu">
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <ul className="mt-12 space-y-2">
                  {[{ label: 'Home', route: { name: 'home' } as Route }, ...navLinks, { label: `Cart (${cart.count})`, route: { name: 'cart' } as Route }].map((l, i) => (
                    <motion.li key={l.label} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                      <button type="button" onClick={() => go(l.route)} className={cn(serif, 'flex min-h-12 w-full items-center justify-between text-[30px] font-[420]', focus)}>
                        {l.label} <ArrowRight size={18} className="opacity-40" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <p className={cn(mono, 'mt-auto text-[10px] text-[#F3E9DC]/45')}>Concept store · no real orders</p>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoOverlay>

      {/* Add-to-cart notice */}
      <DemoOverlay>
        <AnimatePresence>
          {notice && (
            <motion.div
              key={notice.id}
              role="status"
              className="absolute bottom-4 left-1/2 flex w-[min(92%,440px)] -translate-x-1/2 items-center gap-4 rounded-[4px] bg-[#2A1A12] p-3 pl-4 text-[#F3E9DC] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#C4552D]">
                <Check size={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium">Added to cart</span>
                <span className="block truncate text-[12px] text-[#F3E9DC]/65">{notice.text}</span>
              </span>
              <button type="button" onClick={() => go({ name: 'cart' })} className={cn('min-h-9 shrink-0 rounded-[3px] bg-[#F3E9DC] px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A160E] hover:bg-white', focus)}>
                View cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoOverlay>

      {/* Demo checkout */}
      <DemoOverlay>
        <AnimatePresence>
          {checkout && (
            <motion.div key="checkout" className="absolute inset-0 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-[#1E140F]/70 backdrop-blur-[3px]" onClick={() => setCheckout(false)} />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="ember-checkout-title"
                className="relative max-h-[90%] w-[min(100%,460px)] overflow-y-auto rounded-[6px] bg-[#F3E9DC] p-7 text-[#2A160E] shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
                initial={{ y: 30, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onKeyDown={(e) => e.key === 'Escape' && setCheckout(false)}
              >
                <p className={cn(mono, 'text-[10px] text-[#C4552D]')}>Demo checkout</p>
                <h2 id="ember-checkout-title" className={cn(serif, 'mt-3 text-[30px] font-[420] leading-[1.05]')}>
                  This is where payment would happen.
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-[#7A5A45]">Ember is a portfolio concept, so no payment is taken and no data leaves your browser. Here’s the order that would be placed:</p>
                <ul className="mt-5 space-y-2 border-y border-[#2A160E]/10 py-4 text-[14px]">
                  {cart.rows.map((r) => (
                    <li key={r.key} className="flex justify-between gap-4">
                      <span className="min-w-0 truncate">
                        {r.qty} × {r.coffee.name} <span className="text-[#7A5A45]">· {sizes.find((s) => s.id === r.size)?.label}</span>
                      </span>
                      <span className="tabular-nums">{formatPrice(r.total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between text-[16px] font-medium">
                  <span>Total incl. shipping</span>
                  <span className="tabular-nums">{formatPrice(cart.total)}</span>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <EButton
                    autoFocus
                    onClick={() => {
                      cart.clear()
                      setCheckout(false)
                      go({ name: 'home' })
                    }}
                    className="flex-1"
                  >
                    Clear demo cart
                  </EButton>
                  <EButton variant="outline" onClick={() => setCheckout(false)} className="flex-1">
                    Keep shopping
                  </EButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoOverlay>
    </div>
  )
}
