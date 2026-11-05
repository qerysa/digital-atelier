import './fonts'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCallback, useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { Img, photo } from '@/components/ui/Img'
import { cn, formatPrice } from '@/lib/utils'
import { DemoOverlay, useDemo } from '../DemoContext'
import type { DemoProps } from '../registry'
import { benefits, faqs, ingredients, products, sampleReviews, type AurelProduct } from './data'

const serif = "font-['Cormorant_Garamond',Georgia,serif]"
const mono = "font-['IBM_Plex_Mono',monospace] uppercase tracking-[0.2em]"
const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-[#9A7442] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEE6DA]'
const pad = 'px-[clamp(20px,6cqw,88px)]'
const ease = [0.16, 1, 0.3, 1] as const

const img = {
  hero: photo('aurel-hero', [1600, 960], 1067 / 1600, 'Frosted serum bottle with a gold dropper on a travertine plinth, leaf shadows on the wall'),
  texture: photo('aurel-texture', [960, 600], 1, 'Close-up of a soft cream texture swirl'),
  flatlay: photo('aurel-ingredients', [1600, 960], 1067 / 1600, 'Flat-lay of oats, dried chamomile, rosemary, a dish of oil and a halved apricot on linen'),
}

function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' }) {
  const { scrollRef } = useDemo()
  const reduce = useReducedMotion()
  const M = as === 'li' ? motion.li : motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root: scrollRef, once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </M>
  )
}

const nav = [
  { id: 'story', label: 'Story' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'collection', label: 'Collection' },
  { id: 'faq', label: 'FAQ' },
]

/** AUREL — a premium skincare launch page. */
export default function AurelDemo(_props: DemoProps) {
  const { scrollRef } = useDemo()
  const reduce = useReducedMotion()
  const uid = useId()
  const [bag, setBag] = useState<Record<string, number>>({})
  const [toast, setToast] = useState<{ id: number; product: AurelProduct } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const count = Object.values(bag).reduce((a, b) => a + b, 0)
  const total = products.reduce((s, p) => s + (bag[p.id] ?? 0) * p.price, 0)

  const { scrollY } = useScroll({ container: scrollRef })
  const heroY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 90])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const on = () => setScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [scrollRef])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const jump = useCallback(
    (id: string) => {
      const box = scrollRef.current
      const el = box?.querySelector<HTMLElement>(`[data-aurel="${id}"]`)
      if (!box || !el) return
      const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 64
      box.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    },
    [scrollRef, reduce],
  )

  const add = (p: AurelProduct) => {
    setBag((b) => ({ ...b, [p.id]: Math.min(9, (b[p.id] ?? 0) + 1) }))
    setToast({ id: Date.now(), product: p })
  }

  return (
    <div className="min-h-full bg-[#EEE6DA] font-['Inter_Variable',system-ui,sans-serif] text-[#2A2623] antialiased selection:bg-[#9A7442]/30">
      {/* Header */}
      <header className={cn('sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500', scrolled ? 'bg-[#EEE6DA]/88 shadow-[0_1px_0_rgba(42,38,35,0.08)] backdrop-blur-md' : 'bg-transparent')}>
        <div className={cn(pad, 'flex h-16 items-center justify-between gap-6')}>
          <button type="button" onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })} className={cn(serif, 'text-[24px] font-semibold tracking-[0.32em]', focus)} aria-label="Aurel — back to top">
            AUREL
          </button>
          <nav aria-label="Page sections" className="hidden gap-9 @3xl:flex">
            {nav.map((n) => (
              <button key={n.id} type="button" onClick={() => jump(n.id)} className={cn(mono, 'min-h-10 text-[10px] text-[#2A2623]/75 transition-colors hover:text-[#2A2623]', focus)}>
                {n.label}
              </button>
            ))}
          </nav>
          <span className={cn(mono, 'inline-flex min-h-10 items-center gap-2 text-[10px]')} aria-live="polite">
            <ShoppingBag size={15} strokeWidth={1.4} />
            Bag
            <motion.span key={count} initial={count ? { y: -8, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} className="tabular-nums">
              ({count})
            </motion.span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative -mt-16 overflow-hidden" aria-labelledby={`${uid}-hero`}>
        <motion.div className="absolute inset-0 @max-2xl:top-[40%]" style={{ y: heroY }}>
          <motion.div className="size-full" initial={{ scale: reduce ? 1 : 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.2, ease }}>
            <Img image={img.hero} priority sizes="100vw" className="size-full object-cover object-[72%_50%] @max-2xl:object-[78%_50%]" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#EEE6DA] via-[#EEE6DA]/55 to-transparent @max-2xl:bg-gradient-to-b @max-2xl:from-[#EEE6DA] @max-2xl:from-45% @max-2xl:via-[#EEE6DA]/50 @max-2xl:via-55% @max-2xl:to-transparent @max-2xl:to-70%" />
        <div className={cn(pad, 'relative flex min-h-[640px] flex-col justify-center pb-24 pt-32 @max-2xl:min-h-[880px] @max-2xl:justify-start @max-2xl:pt-28 @3xl:min-h-[720px]')}>
          <motion.p className={cn(mono, 'text-[10px] text-[#7A6147]')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
            The first collection · Four essentials
          </motion.p>
          <h1 id={`${uid}-hero`} className={cn(serif, 'mt-6 text-[clamp(54px,10cqw,148px)] font-medium leading-[0.86] tracking-[-0.015em]')}>
            {['Skin,', 'quietly', 'restored.'].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <motion.span className={cn('block', i === 1 && 'italic font-normal text-[#7A6147]')} initial={{ y: reduce ? 0 : '105%' }} animate={{ y: 0 }} transition={{ delay: 0.45 + i * 0.14, duration: 1.2, ease }}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: reduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 1, ease }}>
            <p className="mt-8 max-w-[36ch] text-[clamp(15px,1.5cqw,17px)] leading-relaxed text-[#2A2623]/75">
              Barrier-first skincare built around oat lipids, chamomile and cold-pressed oils — for skin that feels calm, soft and resilient.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button type="button" onClick={() => jump('collection')} className={cn('group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#2A2623] px-7 text-[12px] font-medium uppercase tracking-[0.18em] text-[#F7F2EA] transition-colors hover:bg-[#9A7442]', focus)}>
                Shop the collection <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button type="button" onClick={() => jump('ingredients')} className={cn(mono, 'min-h-12 border-b border-[#2A2623]/35 text-[10px] transition-colors hover:border-[#9A7442] hover:text-[#9A7442]', focus)}>
                Explore ingredients
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand story */}
      <section data-aurel="story" className={cn(pad, 'grid items-center gap-12 py-[clamp(72px,11cqw,160px)] @3xl:grid-cols-[1fr_1.1fr] @3xl:gap-20')}>
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2px] @3xl:aspect-[4/5]">
          <Img image={img.texture} sizes="(min-width: 1024px) 40vw, 100vw" className="size-full object-cover" />
          <span className={cn(mono, 'absolute bottom-4 left-4 bg-[#F7F2EA]/85 px-3 py-2 text-[9px] backdrop-blur')}>Velvet Barrier Cream · texture</span>
        </Reveal>
        <div>
          <Reveal>
            <p className={cn(mono, 'text-[10px] text-[#9A7442]')}>01 — Our story</p>
            <h2 className={cn(serif, 'mt-5 text-[clamp(40px,5.6cqw,76px)] font-medium leading-[0.95] tracking-[-0.01em]')}>
              Fewer steps. <em className="font-normal text-[#7A6147]">Better ones.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-[46ch] space-y-5 text-[16px] leading-relaxed text-[#2A2623]/75">
            <p>Aurel began with a simple frustration: routines with ten products and skin that still felt uncomfortable.</p>
            <p>So the collection starts from the skin barrier. Four essentials, each built around a handful of gentle, well-understood ingredients — layered in textures that feel like a quiet moment in your day.</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-[#2A2623]/10 bg-[#2A2623]/10">
            {['Fragrance-free', 'Barrier-first', 'Refillable glass', 'Four steps'].map((t) => (
              <span key={t} className="flex items-center gap-3 bg-[#EEE6DA] p-4 text-[14px]">
                <Check size={14} className="text-[#9A7442]" /> {t}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F7F2EA]">
        <div className={cn(pad, 'py-[clamp(64px,9cqw,130px)]')}>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={cn(mono, 'text-[10px] text-[#9A7442]')}>02 — Benefits</p>
              <h2 className={cn(serif, 'mt-5 max-w-[14ch] text-[clamp(40px,5.6cqw,76px)] font-medium leading-[0.95]')}>What your skin will feel</h2>
            </div>
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-[#2A2623]/70">Every formula is designed to be gentle enough to use daily, and simple enough to understand.</p>
          </Reveal>
          <ul className="mt-14 grid gap-px bg-[#2A2623]/10 @xl:grid-cols-2 @4xl:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.08} className="group bg-[#F7F2EA] p-7 transition-colors duration-500 hover:bg-[#EEE6DA]">
                <span className={cn(serif, 'text-[44px] italic leading-none text-[#9A7442]')}>0{i + 1}</span>
                <h3 className={cn(serif, 'mt-10 text-[28px] font-semibold leading-tight')}>{b.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#2A2623]/70">{b.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Ingredients */}
      <Ingredients />

      {/* Collection */}
      <section data-aurel="collection" className={cn(pad, 'py-[clamp(72px,10cqw,150px)]')}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={cn(mono, 'text-[10px] text-[#9A7442]')}>04 — The collection</p>
            <h2 className={cn(serif, 'mt-5 text-[clamp(40px,5.6cqw,76px)] font-medium leading-[0.95]')}>The four essentials</h2>
          </div>
          <p className={cn(mono, 'text-[10px] text-[#2A2623]/60')} aria-live="polite">
            {count ? `${count} in bag · ${formatPrice(total)}` : 'Your bag is empty'}
          </p>
        </Reveal>
        <div className="mt-14 grid gap-x-6 gap-y-14 @xl:grid-cols-2 @5xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} qty={bag[p.id] ?? 0} onAdd={() => add(p)} onRemove={() => setBag((b) => ({ ...b, [p.id]: Math.max(0, (b[p.id] ?? 0) - 1) }))} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      {/* FAQ */}
      <section data-aurel="faq" className={cn(pad, 'grid gap-12 py-[clamp(72px,10cqw,150px)] @4xl:grid-cols-[0.8fr_1.2fr]')}>
        <Reveal>
          <p className={cn(mono, 'text-[10px] text-[#9A7442]')}>06 — Questions</p>
          <h2 className={cn(serif, 'mt-5 text-[clamp(40px,5.6cqw,76px)] font-medium leading-[0.95]')}>
            Good to <em className="font-normal text-[#7A6147]">know.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Faq />
        </Reveal>
      </section>

      {/* Final CTA */}
      <FinalCta />

      <footer className={cn(pad, 'flex flex-wrap items-center justify-between gap-4 bg-[#2A2623] py-8 text-[#F7F2EA]/60')}>
        <span className={cn(serif, 'text-[20px] font-semibold tracking-[0.32em] text-[#F7F2EA]')}>AUREL</span>
        <span className={cn(mono, 'text-[9px]')}>A self-initiated concept · Not a real brand · No orders or data are processed</span>
      </footer>

      <DemoOverlay>
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              className="absolute right-4 top-20 flex w-[min(calc(100%-2rem),340px)] items-center gap-4 bg-[#F7F2EA] p-3 text-[#2A2623] shadow-[0_24px_60px_rgba(60,40,20,0.2)]"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }}
            >
              <span className="block h-16 w-12 shrink-0 overflow-hidden bg-[#E9DFD0]">
                <ProductImage product={toast.product} sizes="48px" />
              </span>
              <span className="min-w-0">
                <span className={cn(mono, 'block text-[9px] text-[#9A7442]')}>Added to bag</span>
                <span className={cn(serif, 'mt-1 block truncate text-[19px] font-semibold leading-tight')}>{toast.product.name}</span>
                <span className="block text-[12px] text-[#2A2623]/60">
                  {count} {count === 1 ? 'item' : 'items'} · {formatPrice(total)}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoOverlay>
    </div>
  )
}

function ProductImage({ product, sizes, className }: { product: AurelProduct; sizes: string; className?: string }) {
  const i = product.image
  return <Img image={photo(i.name, i.widths, i.ratio, i.alt)} sizes={sizes} className={cn('size-full object-cover', className)} style={{ objectPosition: i.position ?? '50% 50%' }} />
}

function ProductCard({ product, qty, onAdd, onRemove }: { product: AurelProduct; qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E9DFD0]">
        <ProductImage product={product} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw" className="transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]" />
        {/* Hover detail */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 bg-[#F7F2EA]/92 p-4 opacity-0 backdrop-blur transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <p className={cn(mono, 'text-[9px] text-[#9A7442]')}>Key ingredients</p>
          <p className="mt-1 text-[13px]">{product.keyIngredients.join(' · ')}</p>
          <p className="mt-3 text-[12px] leading-relaxed text-[#2A2623]/70">{product.use}</p>
        </div>
        <span className={cn(mono, 'absolute left-3 top-3 bg-[#F7F2EA]/85 px-2.5 py-1.5 text-[9px]')}>{product.kind}</span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className={cn(serif, 'text-[26px] font-semibold leading-[1.05]')}>{product.name}</h3>
          <p className={cn(mono, 'mt-2 text-[9px] text-[#2A2623]/55')}>{product.size}</p>
        </div>
        <p className="pt-1 text-[15px] tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onAdd}
          className={cn('inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#2A2623] text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-[#2A2623] hover:text-[#F7F2EA]', focus)}
        >
          <Plus size={13} /> Add to bag
        </button>
        <AnimatePresence initial={false}>
          {qty > 0 && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="inline-flex items-center overflow-hidden">
              <button type="button" onClick={onRemove} className={cn('grid size-11 place-items-center rounded-full border border-[#2A2623]/20 hover:border-[#2A2623]', focus)} aria-label={`Remove one ${product.name}`}>
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-[13px] tabular-nums" aria-label={`${qty} in bag`}>
                {qty}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}

function Ingredients() {
  const [active, setActive] = useState(ingredients[0].id)
  const current = ingredients.find((i) => i.id === active)!
  return (
    <section data-aurel="ingredients" className="bg-[#2A2623] text-[#F7F2EA]">
      <div className={cn(pad, 'py-[clamp(72px,10cqw,150px)]')}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={cn(mono, 'text-[10px] text-[#C9A877]')}>03 — Ingredients</p>
            <h2 className={cn(serif, 'mt-5 max-w-[16ch] text-[clamp(40px,5.6cqw,76px)] font-medium leading-[0.95]')}>
              Five ingredients, <em className="font-normal text-[#C9A877]">nothing hidden.</em>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-[#F7F2EA]/65">Tap a point on the image to see what each ingredient does.</p>
        </Reveal>

        <div className="mt-14 grid gap-8 @4xl:grid-cols-[1.6fr_1fr] @4xl:items-stretch">
          <Reveal className="relative overflow-hidden">
            <Img image={img.flatlay} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[3/2] w-full object-cover" />
            <div className="absolute inset-0 bg-[#2A2623]/10" />
            {ingredients.map((ing, i) => {
              const on = ing.id === active
              return (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => setActive(ing.id)}
                  aria-pressed={on}
                  aria-label={`${ing.name} — ${ing.role}`}
                  className={cn('group/hs absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none', focus)}
                  style={{ left: `${ing.x}%`, top: `${ing.y}%` }}
                >
                  <span className={cn('absolute inset-0 rounded-full border border-[#F7F2EA] transition-transform duration-700', on ? 'scale-100 opacity-100' : 'scale-50 opacity-0 group-hover/hs:scale-75 group-hover/hs:opacity-70')} />
                  <span className={cn('absolute inset-0 animate-ping rounded-full bg-[#F7F2EA]/40 motion-reduce:animate-none', on && 'hidden')} style={{ animationDuration: `${2.4 + i * 0.3}s` }} />
                  <span className={cn('relative grid size-6 place-items-center rounded-full text-[10px] font-medium tabular-nums transition-colors', on ? 'bg-[#C9A877] text-[#2A2623]' : 'bg-[#F7F2EA] text-[#2A2623]')}>{i + 1}</span>
                </button>
              )
            })}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-between gap-8 border border-[#F7F2EA]/12 p-7">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} aria-live="polite">
                <p className={cn(mono, 'text-[10px] text-[#C9A877]')}>
                  0{ingredients.indexOf(current) + 1} · {current.role}
                </p>
                <h3 className={cn(serif, 'mt-4 text-[44px] font-medium leading-none')}>{current.name}</h3>
                <p className={cn(serif, 'mt-2 text-[19px] italic text-[#F7F2EA]/55')}>{current.latin}</p>
                <p className="mt-6 text-[15px] leading-relaxed text-[#F7F2EA]/80">{current.text}</p>
                <p className={cn(mono, 'mt-6 text-[9px] text-[#F7F2EA]/45')}>
                  Found in: {products.filter((p) => p.keyIngredients.some((k) => current.name.startsWith(k.split(' ')[0]))).map((p) => p.name).join(', ') || 'The full collection'}
                </p>
              </motion.div>
            </AnimatePresence>
            <ul className="flex flex-wrap gap-2" aria-label="Ingredients">
              {ingredients.map((ing, i) => (
                <li key={ing.id}>
                  <button type="button" onClick={() => setActive(ing.id)} aria-pressed={ing.id === active} className={cn('min-h-9 rounded-full border px-3.5 text-[12px] transition-colors', focus, ing.id === active ? 'border-[#C9A877] bg-[#C9A877] text-[#2A2623]' : 'border-[#F7F2EA]/20 hover:border-[#F7F2EA]/60')}>
                    {i + 1}. {ing.name}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const [i, setI] = useState(0)
  const n = sampleReviews.length
  const r = sampleReviews[i]
  return (
    <section className="bg-[#F7F2EA]" aria-roledescription="carousel" aria-label="Customer reviews (sample content)">
      <div className={cn(pad, 'py-[clamp(72px,10cqw,150px)]')}>
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <p className={cn(mono, 'text-[10px] text-[#9A7442]')}>05 — Reviews</p>
          <span className={cn(mono, 'rounded-full border border-dashed border-[#9A7442]/60 px-3 py-1.5 text-[9px] text-[#7A6147]')}>Sample content · placeholder reviews</span>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.6, ease }} aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}>
              <blockquote className={cn(serif, 'max-w-[30ch] text-[clamp(26px,3.4cqw,46px)] font-medium leading-[1.1] text-[#2A2623]/85')}>“{r.quote}”</blockquote>
              <figcaption className={cn(mono, 'mt-8 text-[10px] text-[#2A2623]/55')}>
                {r.name} · {r.product}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </Reveal>
        <div className="mt-10 flex items-center gap-6">
          <div className="flex gap-2">
            <button type="button" onClick={() => setI((i - 1 + n) % n)} className={cn('grid size-12 place-items-center rounded-full border border-[#2A2623]/25 transition-colors hover:bg-[#2A2623] hover:text-[#F7F2EA]', focus)} aria-label="Previous review">
              <ArrowLeft size={16} />
            </button>
            <button type="button" onClick={() => setI((i + 1) % n)} className={cn('grid size-12 place-items-center rounded-full border border-[#2A2623]/25 transition-colors hover:bg-[#2A2623] hover:text-[#F7F2EA]', focus)} aria-label="Next review">
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {sampleReviews.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} aria-current={k === i} className={cn('grid h-8 place-items-center', focus)}>
                <span className={cn('block h-[2px] transition-all duration-500', k === i ? 'w-10 bg-[#2A2623]' : 'w-5 bg-[#2A2623]/25')} />
              </button>
            ))}
          </div>
          <span className={cn(mono, 'ml-auto text-[10px] tabular-nums text-[#2A2623]/50')}>
            0{i + 1} / 0{n}
          </span>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()
  return (
    <div className="border-t border-[#2A2623]/15">
      {faqs.map((f, i) => {
        const on = open === i
        return (
          <div key={f.q} className="border-b border-[#2A2623]/15">
            <h3>
              <button
                type="button"
                id={`${uid}-q${i}`}
                aria-expanded={on}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className={cn('flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left', focus)}
              >
                <span className={cn(serif, 'text-[clamp(21px,2.2cqw,27px)] font-semibold leading-tight')}>{f.q}</span>
                <span className={cn('relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500', on ? 'border-[#2A2623] bg-[#2A2623] text-[#F7F2EA]' : 'border-[#2A2623]/25')}>
                  <Plus size={14} className={cn('transition-transform duration-500', on && 'rotate-45')} />
                </span>
              </button>
            </h3>
            <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className={cn('grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')} inert={!on}>
              <div className="overflow-hidden">
                <p className="max-w-[58ch] pb-6 text-[15px] leading-relaxed text-[#2A2623]/70">{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FinalCta() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  const uid = useId()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setState(valid ? 'done' : 'error')
  }
  return (
    <section className="relative isolate overflow-hidden bg-[#2A2623] text-[#F7F2EA]">
      <Img image={img.hero} sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover object-[80%_50%] opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2A2623] via-[#2A2623]/90 to-[#2A2623]/50" />
      <div className={cn(pad, 'py-[clamp(80px,12cqw,170px)]')}>
        <Reveal>
          <p className={cn(mono, 'text-[10px] text-[#C9A877]')}>07 — Begin</p>
          <h2 className={cn(serif, 'mt-5 max-w-[14ch] text-[clamp(48px,8cqw,120px)] font-medium leading-[0.88] tracking-[-0.01em]')}>
            Begin your <em className="font-normal text-[#C9A877]">ritual.</em>
          </h2>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-[#F7F2EA]/70">Join the list to hear when the collection launches.</p>
        </Reveal>
        <Reveal delay={0.1}>
          {state === 'done' ? (
            <div className="mt-10 flex max-w-xl items-start gap-4 border border-[#C9A877]/50 p-5" role="status">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#C9A877] text-[#2A2623]">
                <Check size={16} />
              </span>
              <div>
                <p className={cn(serif, 'text-[24px] font-semibold')}>You’re on the list.</p>
                <p className="mt-1 text-[13px] text-[#F7F2EA]/60">This is a concept demo — your email was validated but not stored or sent anywhere.</p>
                <button type="button" onClick={() => (setEmail(''), setState('idle'))} className={cn(mono, 'mt-4 min-h-9 text-[9px] text-[#C9A877] hover:text-[#F7F2EA]', focus)}>
                  Reset demo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-10 max-w-xl">
              <label htmlFor={`${uid}-email`} className={cn(mono, 'text-[9px] text-[#F7F2EA]/60')}>
                Email address
              </label>
              <div className={cn('mt-3 flex flex-col gap-3 border-b pb-3 transition-colors @md:flex-row @md:items-center', state === 'error' ? 'border-[#E58C73]' : 'border-[#F7F2EA]/35 focus-within:border-[#F7F2EA]')}>
                <input
                  id={`${uid}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (state === 'error') setState('idle')
                  }}
                  placeholder="you@example.com"
                  aria-invalid={state === 'error'}
                  aria-describedby={state === 'error' ? `${uid}-err` : undefined}
                  className={cn(serif, 'min-h-12 flex-1 bg-transparent text-[26px] text-[#F7F2EA] outline-none placeholder:text-[#F7F2EA]/30')}
                />
                <button type="submit" className={cn('inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#F7F2EA] px-7 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2A2623] transition-colors hover:bg-[#C9A877]', focus)}>
                  Join the list <ArrowRight size={14} />
                </button>
              </div>
              <p id={`${uid}-err`} className={cn('mt-3 min-h-5 text-[13px]', state === 'error' ? 'text-[#F0A48F]' : 'text-[#F7F2EA]/45')} aria-live="polite">
                {state === 'error' ? (email.trim() ? 'That email doesn’t look right — please check it.' : 'Please enter your email address.') : 'Demo form: nothing is stored or sent.'}
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
