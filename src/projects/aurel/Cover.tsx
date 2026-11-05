import './fonts'
import { Img, photo } from '@/components/ui/Img'

const hero = photo('aurel-hero', [1600, 960], 1067 / 1600, 'Frosted serum bottle with gold dropper on travertine')
const cream = photo('aurel-cream', [800, 520], 1.5, 'Frosted cream jar with gold lid')

/** Home-page preview: editorial landing composition with a phone view. */
export default function AurelCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#E9DFD0] text-[#2B2826]">
      <Img image={hero} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 size-full object-cover object-[70%_50%] transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#EDE4D6] via-[#EDE4D6]/70 to-transparent" />

      <div className="absolute left-[7%] top-[9%] max-w-[50%]">
        <p className="font-['IBM_Plex_Mono'] text-[clamp(7px,0.72vw,11px)] uppercase tracking-[0.22em] text-[#7A6147]">The first collection</p>
        <p className="mt-[0.4em] font-['Cormorant_Garamond'] text-[clamp(44px,8vw,128px)] font-medium leading-[0.85] tracking-[-0.01em]">Aurel</p>
        <p className="mt-[0.5em] font-['Cormorant_Garamond'] text-[clamp(14px,1.9vw,30px)] italic leading-tight text-[#4A4038]">
          Skin, quietly restored.
        </p>
        <span className="mt-[1.6em] inline-block border-b border-[#2B2826]/40 pb-1 font-['IBM_Plex_Mono'] text-[clamp(7px,0.72vw,11px)] uppercase tracking-[0.2em]">
          Discover the serum
        </span>
      </div>

      {/* phone mock */}
      <div className="absolute bottom-[-14%] left-[46%] hidden aspect-[9/18.5] w-[19%] rounded-[clamp(14px,2vw,30px)] border-[clamp(3px,0.45vw,7px)] border-[#2B2826] bg-[#F7F3EC] shadow-[0_40px_80px_rgba(60,40,20,0.35)] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:-translate-y-[5%] sm:block">
        <div className="absolute inset-0 overflow-hidden rounded-[clamp(10px,1.5vw,23px)]">
          <div className="flex items-center justify-between px-[9%] pt-[10%] font-['Cormorant_Garamond'] text-[clamp(8px,0.9vw,14px)] font-semibold tracking-[0.2em]">
            AUREL <span className="font-['IBM_Plex_Mono'] text-[0.7em] font-normal tracking-normal">BAG (1)</span>
          </div>
          <div className="mx-[8%] mt-[8%] aspect-[4/5] overflow-hidden rounded-[4px] bg-[#E9DFD0]">
            <Img image={cream} sizes="12vw" className="size-full object-cover" />
          </div>
          <p className="mx-[9%] mt-[8%] font-['Cormorant_Garamond'] text-[clamp(10px,1.25vw,19px)] leading-tight">Velvet Barrier Cream</p>
          <p className="mx-[9%] mt-[3%] font-['IBM_Plex_Mono'] text-[clamp(5px,0.5vw,8px)] uppercase tracking-[0.16em] text-[#7A6147]">Oat lipids · Squalane</p>
          <div className="mx-[8%] mt-[8%] rounded-full bg-[#2B2826] py-[5%] text-center font-['IBM_Plex_Mono'] text-[clamp(5px,0.55vw,8px)] uppercase tracking-[0.18em] text-[#F7F3EC]">
            Add to bag — $58
          </div>
        </div>
      </div>

      <div className="absolute bottom-[7%] left-[7%] flex gap-[3vw] font-['IBM_Plex_Mono'] text-[clamp(6px,0.65vw,10px)] uppercase tracking-[0.18em] text-[#5B4A3A]">
        <span>01 Story</span>
        <span>02 Ingredients</span>
        <span className="hidden sm:inline">03 Ritual</span>
      </div>
    </div>
  )
}
