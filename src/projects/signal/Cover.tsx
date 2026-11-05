import './fonts'
import { useEffect, useRef, useState } from 'react'

const css = `
.sg-cover * { animation-play-state: var(--sg-play, paused); }
@keyframes sg-stretch { 0%,100% { font-stretch: 62%; } 50% { font-stretch: 125%; } }
@keyframes sg-spin { to { transform: rotate(360deg); } }
@keyframes sg-pop { 0%,100% { transform: scale(1); } 50% { transform: scale(0.55); } }
@keyframes sg-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes sg-ring { 0% { transform: scale(0.4); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
@keyframes sg-swap { 0%,45% { border-radius: 50%; } 50%,95% { border-radius: 0%; } 100% { border-radius: 50%; } }
`

/** Home-page preview: a live, lightweight CSS loop in the festival's language. */
export default function SignalCover() {
  const ref = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.15 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className="sg-cover absolute inset-0 overflow-hidden bg-[#3D4BFF] font-['Archivo_Variable'] text-[#F4F1EA]"
      style={{ ['--sg-play' as string]: play ? 'running' : 'paused' }}
    >
      <style>{css}</style>
      {/* shapes */}
      <div className="absolute right-[7%] top-[10%] flex gap-[2.2vw]">
        <span className="block size-[clamp(36px,6vw,96px)] rounded-full bg-[#FFB8DA] [animation:sg-pop_2.4s_cubic-bezier(.76,0,.24,1)_infinite]" />
        <span className="block size-[clamp(36px,6vw,96px)] bg-[#0A0A14] [animation:sg-spin_4.8s_cubic-bezier(.76,0,.24,1)_infinite]" />
        <span className="block size-[clamp(36px,6vw,96px)] bg-[#FF6B3D] [animation:sg-swap_4.8s_cubic-bezier(.76,0,.24,1)_infinite]" />
      </div>
      {/* pulse mark */}
      <div className="absolute left-[7%] top-[11%] size-[clamp(40px,6.5vw,104px)]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute inset-0 rounded-full border-2 border-[#F4F1EA]" style={{ animation: `sg-ring 2.4s cubic-bezier(.16,1,.3,1) ${i * 0.8}s infinite` }} />
        ))}
        <span className="absolute inset-[38%] rounded-full bg-[#F4F1EA]" />
      </div>
      {/* wordmark */}
      <p
        className="absolute inset-x-0 top-[50%] -translate-y-1/2 text-center text-[clamp(64px,15vw,250px)] font-[850] uppercase leading-[0.8] tracking-[-0.04em] [animation:sg-stretch_4.8s_cubic-bezier(.76,0,.24,1)_infinite]"
        style={{ fontStretch: '100%' }}
      >
        Signal
      </p>
      {/* ticker */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t-2 border-[#0A0A14] bg-[#F4F1EA] py-[1.4%] text-[#0A0A14]">
        <div className="flex w-max [animation:sg-slide_14s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="whitespace-nowrap pr-8 font-['IBM_Plex_Mono'] text-[clamp(8px,0.9vw,13px)] uppercase tracking-[0.25em]">
              {Array.from({ length: 4 }).map((__, i) => (
                <span key={i} className="pr-8">
                  Digital culture festival <span className="text-[#3D4BFF]">●</span> Motion identity concept <span className="text-[#FF6B3D]">■</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <p className="absolute bottom-[14%] left-[7%] font-['IBM_Plex_Mono'] text-[clamp(7px,0.75vw,11px)] uppercase tracking-[0.22em] text-[#F4F1EA]/85">CH.01 — Logo reveal</p>
    </div>
  )
}
