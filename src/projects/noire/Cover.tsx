import '@fontsource-variable/bodoni-moda/index.css'
import { useState } from 'react'
import { asset } from '@/lib/utils'

/** Home-page preview: frame from the real-time scene + wordmark. */
export default function NoireCover() {
  const [ok, setOk] = useState(true)
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070607] text-[#EEE6D8]">
      <div aria-hidden className="absolute left-1/2 top-[55%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(210,168,103,0.22),transparent)]" />
      {ok && (
        <img
          src={asset('/images/noire-poster-1600.webp')}
          srcSet={`${asset('/images/noire-poster-960.webp')} 960w, ${asset('/images/noire-poster-1600.webp')} 1600w`}
          sizes="100vw"
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          alt="Real-time 3D render of the Noiré perfume bottle"
          onError={() => setOk(false)}
          className="absolute inset-0 size-full object-cover transition-transform duration-[1.8s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.05]"
        />
      )}
      {/* light sweep */}
      <div aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#D2A867]/12 to-transparent transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover/cover:translate-x-[420%]" />
      <div className="absolute bottom-[10%] left-[6%]">
        <p className="font-['Bodoni_Moda_Variable'] text-[clamp(44px,9vw,150px)] font-medium italic leading-[0.8] tracking-[-0.02em] text-[#E8D2AE]">Noiré</p>
        <p className="mt-[1.2em] font-['IBM_Plex_Mono'] text-[clamp(7px,0.75vw,11px)] uppercase tracking-[0.35em] text-[#EEE6D8]/70">Eau de parfum — 50 ml</p>
      </div>
      <div className="absolute right-[5%] top-[8%] flex items-center gap-2 font-['IBM_Plex_Mono'] text-[clamp(7px,0.7vw,11px)] uppercase tracking-[0.2em] text-[#EEE6D8]/60">
        <span className="size-1.5 rounded-full bg-[#D2A867]" /> Real-time WebGL
      </div>
      <div className="absolute bottom-[10%] right-[5%] hidden text-right font-['IBM_Plex_Mono'] text-[clamp(7px,0.7vw,11px)] uppercase leading-[1.9] tracking-[0.2em] text-[#EEE6D8]/50 sm:block">
        Glass · Liquid · Light
        <br />
        24s sequence
      </div>
    </div>
  )
}
