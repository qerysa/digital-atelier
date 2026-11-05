import '@fontsource-variable/fraunces/index.css'
import { ShoppingBag } from 'lucide-react'
import { Img, photo } from '@/components/ui/Img'
import { coffees } from './data'
import { CoffeeBag } from './CoffeeBag'

const heroImg = photo('ember-hero', [1600, 960], 1067 / 1600, 'Ceramic cup of black coffee on a walnut table in warm light')

/** Home-page preview: storefront hero + floating product card. */
export default function EmberCover() {
  const featured = coffees[0]
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1E140F] font-['Inter_Variable']">
      <div className="absolute inset-[6%_30%_8%_5%] overflow-hidden rounded-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.015] max-sm:inset-[6%_6%_30%_6%]">
        <Img image={heroImg} sizes="(min-width:1024px) 60vw, 90vw" className="absolute inset-0 size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E140F]/85 via-[#1E140F]/30 to-transparent" />
        {/* mini nav */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[5%] py-[3.5%] text-[#F3E9DC]">
          <span className="font-['Fraunces_Variable'] text-[clamp(10px,1.3vw,18px)] font-semibold tracking-[0.25em]">EMBER</span>
          <span className="hidden gap-[2.2vw] text-[clamp(8px,0.8vw,12px)] uppercase tracking-[0.18em] text-[#F3E9DC]/75 sm:flex">
            <span>Shop</span>
            <span>Origins</span>
            <span>About</span>
          </span>
          <span className="flex items-center gap-1.5 text-[clamp(8px,0.85vw,12px)]">
            <ShoppingBag className="size-[1.1em]" strokeWidth={1.5} /> 2
          </span>
        </div>
        <div className="absolute bottom-[10%] left-[6%] max-w-[55%] text-[#F3E9DC]">
          <p className="mb-[0.6em] font-['IBM_Plex_Mono'] text-[clamp(7px,0.75vw,11px)] uppercase tracking-[0.2em] text-[#E39A4F]">Small-batch roastery</p>
          <p className="font-['Fraunces_Variable'] text-[clamp(20px,4.2vw,64px)] font-[450] leading-[0.95] tracking-[-0.02em]">
            Slow-roasted.
            <br />
            <em className="font-[350]">Brewed with care.</em>
          </p>
        </div>
      </div>

      {/* floating product card */}
      <div className="absolute bottom-[8%] right-[5%] w-[30%] rounded-[6px] bg-[#F3E9DC] p-[1.4%] text-[#2A160E] shadow-[0_30px_70px_rgba(0,0,0,0.45)] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:-translate-y-[3%] max-sm:bottom-[5%] max-sm:right-[6%] max-sm:w-[46%]">
        <div className="grid aspect-[4/3.6] place-items-center rounded-[4px] bg-[#E6D6C2]">
          <CoffeeBag coffee={featured} className="h-[88%] w-auto" />
        </div>
        <div className="flex items-end justify-between gap-2 px-[3%] pb-[2%] pt-[6%]">
          <div>
            <p className="font-['Fraunces_Variable'] text-[clamp(10px,1.35vw,20px)] leading-tight">{featured.name}</p>
            <p className="mt-1 font-['IBM_Plex_Mono'] text-[clamp(7px,0.7vw,10px)] uppercase tracking-[0.14em] text-[#7A5A45]">
              {featured.notes.slice(0, 2).join(' · ')}
            </p>
          </div>
          <span className="text-[clamp(9px,1.1vw,16px)] font-medium">${featured.price}</span>
        </div>
        <div className="mx-[3%] mb-[3%] rounded-[3px] bg-[#C4552D] py-[3.5%] text-center text-[clamp(7px,0.8vw,12px)] font-medium uppercase tracking-[0.16em] text-[#F7EEE2]">
          Add to cart
        </div>
      </div>

      {/* shelf of bags peeking */}
      <div className="absolute right-[6%] top-[7%] hidden w-[24%] items-end justify-between sm:flex">
        {coffees.slice(1, 4).map((c, i) => (
          <div key={c.id} className="w-[31%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/cover:-translate-y-[6%]" style={{ transitionDelay: `${i * 70}ms` }}>
            <CoffeeBag coffee={c} className="w-full" title={`${c.name} bag`} />
          </div>
        ))}
      </div>
    </div>
  )
}
