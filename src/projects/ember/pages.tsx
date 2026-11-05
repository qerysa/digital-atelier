import { ArrowLeft, ArrowRight, Check, Droplets, Flame, Leaf, Plus, ShoppingBag, Thermometer, Timer, Trash2, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Img, photo } from '@/components/ui/Img'
import { cn, formatPrice } from '@/lib/utils'
import { coffees, FREE_SHIPPING, grinds, priceFor, sizes, type Coffee, type Grind, type Roast, type SizeId } from './data'
import type { Cart } from './store'
import { BagStage, C, EButton, focus, mono, QtyStepper, RoastMeter, serif } from './ui'
import type { Go } from './Demo'

const img = {
  hero: photo('ember-hero', [1600, 960], 1067 / 1600, 'Ceramic cup of black coffee on a walnut table in warm morning light'),
  pour: photo('ember-pourover', [1000, 640], 1.5, 'Hand pouring water over a pour-over coffee brewer'),
  beans: photo('ember-beans', [960, 600], 1, 'Freshly roasted coffee beans in close-up'),
  roastery: photo('ember-roastery', [1600, 960], 1067 / 1600, 'Small drum roaster in a warmly lit roastery'),
}

const section = 'px-[clamp(20px,5cqw,64px)]'

/* ───────────────────────────── Product card ───────────────────────────── */

export function ProductCard({ coffee, go, onQuickAdd }: { coffee: Coffee; go: Go; onQuickAdd: (c: Coffee) => void }) {
  return (
    <article className="group relative flex flex-col">
      <button type="button" onClick={() => go({ name: 'product', id: coffee.id })} className={cn('block text-left', focus)} aria-label={`View ${coffee.name}`}>
        <BagStage coffee={coffee} className="aspect-[4/4.4] rounded-[4px]" bagClassName="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:rotate-[-2deg]" />
      </button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn(mono, 'text-[10px] text-[#7A5A45]')}>
            {coffee.origin} · {coffee.process}
          </p>
          <h3 className={cn(serif, 'mt-1.5 text-[22px] leading-tight')}>
            <button type="button" onClick={() => go({ name: 'product', id: coffee.id })} className={cn('text-left hover:text-[#C4552D]', focus)}>
              {coffee.name}
            </button>
          </h3>
          <p className="mt-1 text-[13px] text-[#7A5A45]">{coffee.notes.join(' · ')}</p>
        </div>
        <p className="shrink-0 pt-5 text-[15px] tabular-nums">{formatPrice(coffee.price)}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <RoastMeter coffee={coffee} className="text-[#2A160E]" />
        <button
          type="button"
          onClick={() => onQuickAdd(coffee)}
          className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#2A160E]/20 px-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:border-[#C4552D] hover:bg-[#C4552D] hover:text-[#F7EEE2]', focus)}
          aria-label={`Quick add ${coffee.name}, 250 g whole bean`}
        >
          <Plus size={13} /> Add
        </button>
      </div>
    </article>
  )
}

/* ───────────────────────────── Home ───────────────────────────── */

export function HomePage({ go, onQuickAdd }: { go: Go; onQuickAdd: (c: Coffee) => void }) {
  const featured = [coffees[0], coffees[1], coffees[4]]
  return (
    <>
      <section className="relative isolate min-h-[600px] @3xl:min-h-[680px] overflow-hidden bg-[#1E140F] text-[#F3E9DC]">
        <Img image={img.hero} priority sizes="(min-width: 1024px) 80vw, 100vw" className="absolute inset-0 -z-10 size-full object-cover object-[70%_50%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1E140F] via-[#1E140F]/70 to-[#1E140F]/10 @max-2xl:bg-gradient-to-t @max-2xl:from-[#1E140F] @max-2xl:via-[#1E140F]/75 @max-2xl:to-[#1E140F]/20" />
        <div className={cn(section, 'flex min-h-[inherit] flex-col justify-end pb-[clamp(40px,8cqw,96px)] pt-40')}>
          <p className={cn(mono, 'text-[11px] text-[#E39A4F]')}>Small-batch specialty roastery</p>
          <h1 className={cn(serif, 'mt-5 max-w-[12ch] text-[clamp(44px,8.4cqw,104px)] font-[420] leading-[0.94] tracking-[-0.025em]')}>
            Slow-roasted. <em className="font-[320] text-[#F0C9A0]">Brewed with care.</em>
          </h1>
          <p className="mt-6 max-w-[38ch] text-[clamp(15px,1.6cqw,18px)] leading-relaxed text-[#F3E9DC]/80">
            Single-origin coffees roasted in small batches to bring out what makes every farm different.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <EButton onClick={() => go({ name: 'shop' })}>
              Shop coffee <ArrowRight size={15} />
            </EButton>
            <EButton variant="outline" onClick={() => go({ name: 'about' })} className="text-[#F3E9DC]">
              Our roastery
            </EButton>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2A160E]/10 bg-[#F3E9DC]">
        <ul className={cn(section, 'grid gap-5 py-7 @2xl:grid-cols-3')}>
          {[
            { icon: Flame, title: 'Roasted every week', text: 'Small batches, packed the day they are roasted.' },
            { icon: Leaf, title: 'Traceable origins', text: 'Every bag names its region, process and varietal.' },
            { icon: Truck, title: `Free shipping over $${FREE_SHIPPING}`, text: 'Flat-rate delivery on smaller orders.' },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E6D6C2] text-[#C4552D]">
                <Icon size={17} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[14px] font-medium">{title}</span>
                <span className="mt-0.5 block text-[13px] text-[#7A5A45]">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn(section, 'bg-[#F3E9DC] py-[clamp(56px,9cqw,120px)]')}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={cn(mono, 'text-[11px] text-[#C4552D]')}>This week’s roasts</p>
            <h2 className={cn(serif, 'mt-3 text-[clamp(32px,5cqw,60px)] font-[420] leading-[1] tracking-[-0.02em]')}>Fresh from the drum</h2>
          </div>
          <button type="button" onClick={() => go({ name: 'shop' })} className={cn('group inline-flex min-h-11 items-center gap-2 border-b border-[#2A160E]/30 text-[13px] font-medium uppercase tracking-[0.14em] hover:border-[#C4552D] hover:text-[#C4552D]', focus)}>
            View all coffees <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-12 @xl:grid-cols-2 @4xl:grid-cols-3">
          {featured.map((c) => (
            <ProductCard key={c.id} coffee={c} go={go} onQuickAdd={onQuickAdd} />
          ))}
        </div>
      </section>

      <section className="grid bg-[#2A1A12] text-[#F3E9DC] @3xl:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden @3xl:min-h-[640px]">
          <Img image={img.pour} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className={cn(section, 'flex flex-col justify-center py-[clamp(56px,8cqw,110px)]')}>
          <p className={cn(mono, 'text-[11px] text-[#E39A4F]')}>Brew guide · Pour-over</p>
          <h2 className={cn(serif, 'mt-4 text-[clamp(32px,4.6cqw,56px)] font-[420] leading-[1.02] tracking-[-0.02em]')}>
            Three numbers for <em className="font-[320]">a better cup.</em>
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] bg-[#F3E9DC]/10 @md:grid-cols-3">
            {[
              { icon: Droplets, k: '1 : 16', v: 'Coffee to water' },
              { icon: Thermometer, k: '94 °C', v: 'Water temperature' },
              { icon: Timer, k: '3:30', v: 'Total brew time' },
            ].map(({ icon: Icon, k, v }) => (
              <li key={v} className="bg-[#2A1A12] p-5">
                <Icon size={18} strokeWidth={1.5} className="text-[#E39A4F]" />
                <p className={cn(serif, 'mt-5 text-[30px] leading-none tabular-nums')}>{k}</p>
                <p className="mt-2 text-[13px] text-[#F3E9DC]/65">{v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[44ch] text-[15px] leading-relaxed text-[#F3E9DC]/70">
            Bloom for 40 seconds with twice the coffee’s weight in water, then pour slowly in circles. Lighter roasts love the higher end of the range.
          </p>
        </div>
      </section>

      <section className={cn(section, 'bg-[#F3E9DC] py-[clamp(56px,9cqw,120px)]')}>
        <p className={cn(mono, 'text-[11px] text-[#C4552D]')}>Find your roast</p>
        <h2 className={cn(serif, 'mt-3 max-w-[18ch] text-[clamp(32px,5cqw,60px)] font-[420] leading-[1] tracking-[-0.02em]')}>From bright and floral to deep and chocolatey</h2>
        <div className="mt-12 grid gap-4 @2xl:grid-cols-3">
          {(
            [
              { roast: 'Light', text: 'Floral, citrus, tea-like', tone: '#E8C6A2' },
              { roast: 'Medium', text: 'Caramel, red fruit, balanced', tone: '#C4552D' },
              { roast: 'Dark', text: 'Cacao, molasses, syrupy', tone: '#4A2E1F' },
            ] as { roast: Roast; text: string; tone: string }[]
          ).map((r, i) => (
            <button
              key={r.roast}
              type="button"
              onClick={() => go({ name: 'shop', roast: r.roast })}
              className={cn('group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[4px] p-6 text-left transition-transform duration-500 hover:-translate-y-1', focus)}
              style={{ background: r.tone, color: i === 0 ? C.ink : '#F7EEE2' }}
            >
              <span className={cn(mono, 'text-[10px] opacity-75')}>0{i + 1} / Roast</span>
              <span>
                <span className={cn(serif, 'block text-[40px] leading-none')}>{r.roast}</span>
                <span className="mt-2 flex items-center justify-between text-[14px] opacity-85">
                  {r.text} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#1E140F] text-[#F3E9DC]">
        <div className="grid @3xl:grid-cols-[1.1fr_1fr]">
          <div className={cn(section, 'flex flex-col justify-center py-[clamp(56px,8cqw,110px)]')}>
            <p className={cn(mono, 'text-[11px] text-[#E39A4F]')}>Roast day is Monday</p>
            <h2 className={cn(serif, 'mt-4 max-w-[16ch] text-[clamp(32px,4.6cqw,56px)] font-[420] leading-[1.02] tracking-[-0.02em]')}>
              Every bag is dated, so you know exactly how fresh it is.
            </h2>
            <div className="mt-9">
              <EButton variant="light" onClick={() => go({ name: 'shop' })}>
                Browse the shop <ArrowRight size={15} />
              </EButton>
            </div>
          </div>
          <div className="relative min-h-[320px]">
            <Img image={img.beans} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 size-full object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}

/* ───────────────────────────── Shop ───────────────────────────── */

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

export function ShopPage({ go, initialRoast, onQuickAdd }: { go: Go; initialRoast?: Roast; onQuickAdd: (c: Coffee) => void }) {
  const [roast, setRoast] = useState<Roast | 'All'>(initialRoast ?? 'All')
  const [sort, setSort] = useState<Sort>('featured')
  const list = useMemo(() => {
    const filtered = coffees.filter((c) => roast === 'All' || c.roast === roast)
    const sorted = [...filtered]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name))
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name))
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [roast, sort])
  const options: (Roast | 'All')[] = ['All', 'Light', 'Medium', 'Dark']

  return (
    <section className={cn(section, 'min-h-full bg-[#F3E9DC] pb-24 pt-[clamp(40px,6cqw,80px)]')}>
      <p className={cn(mono, 'text-[11px] text-[#C4552D]')}>Shop · {coffees.length} coffees</p>
      <h1 className={cn(serif, 'mt-3 text-[clamp(40px,7cqw,88px)] font-[420] leading-[0.95] tracking-[-0.025em]')}>{roast === 'All' ? 'All coffee' : `${roast} roasts`}</h1>

      <div className="sticky top-[64px] z-10 -mx-[clamp(20px,5cqw,64px)] mt-10 flex items-center justify-between gap-3 border-y border-[#2A160E]/10 bg-[#F3E9DC]/95 px-[clamp(20px,5cqw,64px)] py-3 backdrop-blur">
        <div className="no-scrollbar -my-1 flex min-w-0 flex-1 gap-2 overflow-x-auto py-1" role="radiogroup" aria-label="Filter by roast">
          {options.map((o) => {
            const count = o === 'All' ? coffees.length : coffees.filter((c) => c.roast === o).length
            const on = roast === o
            return (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setRoast(o)}
                className={cn(
                  'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors',
                  focus,
                  on ? 'border-[#2A160E] bg-[#2A160E] text-[#F3E9DC]' : 'border-[#2A160E]/20 hover:border-[#2A160E]/60',
                )}
              >
                {o}
                <span className={cn('text-[10px] tabular-nums', on ? 'text-[#F3E9DC]/60' : 'text-[#7A5A45]')}>{count}</span>
              </button>
            )
          })}
        </div>
        <label className="flex shrink-0 items-center gap-3 text-[12px] uppercase tracking-[0.12em] text-[#7A5A45]">
          <span className="sr-only @2xl:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={cn('min-h-9 max-w-[9.5rem] rounded-[3px] border border-[#2A160E]/20 bg-transparent px-2 text-[13px] normal-case tracking-normal text-[#2A160E] @2xl:max-w-none @2xl:px-3', focus)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} coffees
      </p>
      <div className="mt-10 grid gap-x-6 gap-y-14 @xl:grid-cols-2 @4xl:grid-cols-3">
        {list.map((c) => (
          <div key={c.id} className="animate-[ember-in_.6s_cubic-bezier(.16,1,.3,1)_both]">
            <ProductCard coffee={c} go={go} onQuickAdd={onQuickAdd} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────────── Product ───────────────────────────── */

export function ProductPage({ coffee, go, onAdd, onQuickAdd }: { coffee: Coffee; go: Go; onAdd: (c: Coffee, size: SizeId, grind: Grind, qty: number) => void; onQuickAdd: (c: Coffee) => void }) {
  const [size, setSize] = useState<SizeId>('250g')
  const [grind, setGrind] = useState<Grind>('Whole bean')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const unit = priceFor(coffee, size)
  const related = coffees.filter((c) => c.id !== coffee.id && (c.roast === coffee.roast || c.origin !== coffee.origin)).slice(0, 3)

  const add = () => {
    onAdd(coffee, size, grind, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="bg-[#F3E9DC]">
      <div className={cn(section, 'pt-6')}>
        <button type="button" onClick={() => go({ name: 'shop' })} className={cn('inline-flex min-h-10 items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-[#7A5A45] hover:text-[#2A160E]', focus)}>
          <ArrowLeft size={14} /> All coffee
        </button>
      </div>
      <section className={cn(section, 'grid gap-10 pb-20 pt-4 @3xl:grid-cols-[1.05fr_1fr] @3xl:gap-14')}>
        <div className="@3xl:sticky @3xl:top-[84px] @3xl:self-start">
          <BagStage coffee={coffee} className="aspect-square rounded-[4px]" bagClassName="animate-[ember-float_6s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>
        <div>
          <p className={cn(mono, 'text-[11px] text-[#C4552D]')}>
            {coffee.origin} · {coffee.region}
          </p>
          <h1 className={cn(serif, 'mt-3 text-[clamp(38px,5.4cqw,64px)] font-[420] leading-[0.98] tracking-[-0.02em]')}>{coffee.name}</h1>
          <p className="mt-3 text-[15px] italic text-[#7A5A45]">{coffee.notes.join(', ')}</p>
          <p className="mt-6 text-[28px] tabular-nums" aria-live="polite">
            {formatPrice(unit)}
            <span className="ml-2 text-[13px] text-[#7A5A45]">/ {sizes.find((s) => s.id === size)?.label}</span>
          </p>
          <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-[#2A160E]/80">{coffee.description}</p>

          <fieldset className="mt-8">
            <legend className={cn(mono, 'mb-3 text-[10px] text-[#7A5A45]')}>Bag size</legend>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <label key={s.id} className={cn('relative flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-[3px] border text-center transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#E39A4F]', size === s.id ? 'border-[#2A160E] bg-[#2A160E] text-[#F3E9DC]' : 'border-[#2A160E]/20 hover:border-[#2A160E]/60')}>
                  <input type="radio" name="ember-size" value={s.id} checked={size === s.id} onChange={() => setSize(s.id)} className="sr-only" />
                  <span className="text-[14px] font-medium">{s.label}</span>
                  <span className={cn('text-[11px] tabular-nums', size === s.id ? 'text-[#F3E9DC]/65' : 'text-[#7A5A45]')}>{formatPrice(priceFor(coffee, s.id))}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className={cn(mono, 'mb-3 text-[10px] text-[#7A5A45]')}>Grind</legend>
            <div className="flex flex-wrap gap-2">
              {grinds.map((g) => (
                <label key={g} className={cn('inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[13px] transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#E39A4F]', grind === g ? 'border-[#C4552D] bg-[#C4552D]/10 text-[#2A160E]' : 'border-[#2A160E]/20 hover:border-[#2A160E]/60')}>
                  <input type="radio" name="ember-grind" value={g} checked={grind === g} onChange={() => setGrind(g)} className="sr-only" />
                  {grind === g && <Check size={13} className="text-[#C4552D]" />}
                  {g}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(20, v)))} label="Quantity" />
            <EButton onClick={add} className="min-h-12 flex-1 px-6">
              {added ? (
                <>
                  <Check size={16} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.6} /> Add to cart — {formatPrice(unit * qty)}
                </>
              )}
            </EButton>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-[#2A160E]/10 bg-[#2A160E]/10">
            {[
              ['Region', coffee.region],
              ['Process', coffee.process],
              ['Varietal', coffee.varietal],
              ['Altitude', coffee.altitude],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#F3E9DC] p-4">
                <dt className={cn(mono, 'text-[10px] text-[#7A5A45]')}>{k}</dt>
                <dd className="mt-1.5 text-[14px]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-center justify-between rounded-[4px] border border-[#2A160E]/10 p-4">
            <span className={cn(mono, 'text-[10px] text-[#7A5A45]')}>Roast level</span>
            <RoastMeter coffee={coffee} />
          </div>
        </div>
      </section>

      <section className={cn(section, 'border-t border-[#2A160E]/10 py-16')}>
        <h2 className={cn(serif, 'text-[32px] font-[420] tracking-[-0.02em]')}>You may also like</h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 @xl:grid-cols-2 @4xl:grid-cols-3">
          {related.map((c) => (
            <ProductCard key={c.id} coffee={c} go={go} onQuickAdd={onQuickAdd} />
          ))}
        </div>
      </section>
    </div>
  )
}

/* ───────────────────────────── About ───────────────────────────── */

export function AboutPage({ go }: { go: Go }) {
  return (
    <div className="bg-[#F3E9DC]">
      <section className="relative isolate flex min-h-[520px] @3xl:min-h-[600px] items-end overflow-hidden bg-[#1E140F] text-[#F3E9DC]">
        <Img image={img.roastery} priority sizes="100vw" className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1E140F] via-[#1E140F]/50 to-transparent" />
        <div className={cn(section, 'pb-[clamp(40px,7cqw,90px)] pt-40')}>
          <p className={cn(mono, 'text-[11px] text-[#E39A4F]')}>About the roastery</p>
          <h1 className={cn(serif, 'mt-4 max-w-[14ch] text-[clamp(42px,7.4cqw,96px)] font-[420] leading-[0.95] tracking-[-0.025em]')}>
            Roasted by hand, <em className="font-[320]">one batch at a time.</em>
          </h1>
        </div>
      </section>
      <section className={cn(section, 'grid gap-10 py-[clamp(56px,9cqw,120px)] @3xl:grid-cols-[1fr_1.3fr]')}>
        <p className={cn(serif, 'text-[clamp(24px,3cqw,34px)] leading-[1.2] tracking-[-0.01em]')}>
          Ember started with a simple idea: coffee should taste like where it comes from.
        </p>
        <div className="space-y-5 text-[16px] leading-relaxed text-[#2A160E]/80">
          <p>
            We roast on a small drum roaster in short, attentive batches. Each coffee gets its own profile — lighter for delicate washed lots, longer and deeper for the chocolatey naturals that love milk.
          </p>
          <p>Every bag lists the region, process, varietal and altitude, so you can learn what you like and find it again.</p>
        </div>
      </section>
      <section className={cn(section, 'grid gap-px pb-[clamp(56px,9cqw,120px)] @2xl:grid-cols-3')}>
        {[
          ['01', 'Sourced with intent', 'Seasonal lots chosen for clarity and sweetness, bought from importers who share the details.'],
          ['02', 'Profiled per coffee', 'No one-size-fits-all roast. Each origin is developed to show its best side.'],
          ['03', 'Dated, never stale', 'Roast dates on every bag and small batches, so nothing sits on a shelf.'],
        ].map(([n, t, d]) => (
          <div key={n} className="border-t border-[#2A160E]/15 py-6 @2xl:pr-8">
            <span className={cn(mono, 'text-[10px] text-[#C4552D]')}>{n}</span>
            <h3 className={cn(serif, 'mt-3 text-[24px]')}>{t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#7A5A45]">{d}</p>
          </div>
        ))}
      </section>
      <section className="grid bg-[#2A1A12] text-[#F3E9DC] @3xl:grid-cols-2">
        <div className="relative min-h-[320px]">
          <Img image={img.beans} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className={cn(section, 'flex flex-col justify-center gap-6 py-16')}>
          <h2 className={cn(serif, 'max-w-[16ch] text-[clamp(30px,4cqw,48px)] font-[420] leading-[1.05]')}>Taste the difference a good roast makes.</h2>
          <div>
            <EButton variant="light" onClick={() => go({ name: 'shop' })}>
              Shop coffee <ArrowRight size={15} />
            </EButton>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────────────────────────── Cart ───────────────────────────── */

export function CartPage({ cart, go, onCheckout }: { cart: Cart; go: Go; onCheckout: () => void }) {
  const progress = Math.min(1, cart.subtotal / FREE_SHIPPING)
  return (
    <section className={cn(section, 'min-h-full bg-[#F3E9DC] pb-24 pt-[clamp(40px,6cqw,80px)]')}>
      <p className={cn(mono, 'text-[11px] text-[#C4552D]')}>Your cart · {cart.count} {cart.count === 1 ? 'item' : 'items'}</p>
      <h1 className={cn(serif, 'mt-3 text-[clamp(40px,7cqw,88px)] font-[420] leading-[0.95] tracking-[-0.025em]')}>Cart</h1>

      {cart.rows.length === 0 ? (
        <div className="mt-12 flex flex-col items-start gap-6 rounded-[4px] border border-dashed border-[#2A160E]/25 p-10">
          <ShoppingBag size={28} strokeWidth={1.3} className="text-[#C4552D]" />
          <div>
            <p className={cn(serif, 'text-[26px]')}>Your cart is empty.</p>
            <p className="mt-1 text-[14px] text-[#7A5A45]">Pick a roast and it will wait for you here — even after a reload.</p>
          </div>
          <EButton onClick={() => go({ name: 'shop' })}>
            Shop coffee <ArrowRight size={15} />
          </EButton>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 @4xl:grid-cols-[1.5fr_1fr]">
          <ul className="h-fit divide-y divide-[#2A160E]/10 border-y border-[#2A160E]/10">
            {cart.rows.map((r) => (
              <li key={r.key} className="grid grid-cols-[84px_1fr] gap-4 py-5 @md:grid-cols-[104px_1fr]">
                <button type="button" onClick={() => go({ name: 'product', id: r.id })} className={cn('block', focus)} aria-label={`View ${r.coffee.name}`}>
                  <BagStage coffee={r.coffee} className="aspect-square rounded-[3px]" />
                </button>
                <div className="flex min-w-0 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn(serif, 'text-[20px] leading-tight')}>{r.coffee.name}</p>
                      <p className="mt-1 text-[13px] text-[#7A5A45]">
                        {sizes.find((s) => s.id === r.size)?.label} · {r.grind} · {formatPrice(r.unit)} each
                      </p>
                    </div>
                    <p className="shrink-0 text-[16px] tabular-nums">{formatPrice(r.total)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QtyStepper size="sm" value={r.qty} onChange={(v) => cart.setQty(r.key, v)} max={cart.maxQty} label={`Quantity of ${r.coffee.name}`} />
                    <button type="button" onClick={() => cart.remove(r.key)} className={cn('inline-flex min-h-9 items-center gap-1.5 text-[12px] uppercase tracking-[0.12em] text-[#7A5A45] hover:text-[#C4552D]', focus)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-[4px] bg-[#2A1A12] p-6 text-[#F3E9DC] @4xl:sticky @4xl:top-[84px]">
            <h2 className={cn(serif, 'text-[24px]')}>Order summary</h2>
            <div className="mt-5">
              <p className="text-[13px] text-[#F3E9DC]/75" aria-live="polite">
                {cart.toFree > 0 ? (
                  <>
                    You’re <strong className="font-medium text-[#F0C9A0]">{formatPrice(cart.toFree)}</strong> away from free shipping.
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[#F0C9A0]">
                    <Check size={14} /> You’ve unlocked free shipping.
                  </span>
                )}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F3E9DC]/10" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <div className="h-full rounded-full bg-[#E39A4F] transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <dl className="mt-6 space-y-3 border-t border-[#F3E9DC]/10 pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[#F3E9DC]/70">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#F3E9DC]/70">Shipping</dt>
                <dd className="tabular-nums">{cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-[#F3E9DC]/10 pt-4 text-[18px]">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
              </div>
            </dl>
            <EButton onClick={onCheckout} className="mt-6 min-h-12 w-full">
              Checkout <ArrowRight size={15} />
            </EButton>
            <p className="mt-3 text-center text-[11px] text-[#F3E9DC]/50">Concept store — no payment is processed.</p>
          </aside>
        </div>
      )}
    </section>
  )
}
