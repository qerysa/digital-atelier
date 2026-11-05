import { services } from '@/data/content'

/** Slow service ticker between hero and work. Pauses on hover; static for reduced motion. */
export function Marquee() {
  const items = services.map((s) => s.title)
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="display whitespace-nowrap px-8 text-[clamp(1.75rem,3.6vw,3.25rem)] text-transparent [-webkit-text-stroke:1px_rgb(241_239_232/0.55)]">
            {t}
          </span>
          <span className="size-2.5 rotate-45 bg-signal" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="group relative overflow-hidden border-y border-ivory/10 py-6">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row()}
        {row(true)}
      </div>
    </div>
  )
}
