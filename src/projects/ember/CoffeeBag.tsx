import { useId } from 'react'
import type { Coffee } from './data'
import { roastLevel } from './data'

/**
 * Parametric stand-up pouch. One component renders every product's packaging
 * from data — colour, label, origin and roast level.
 */
export function CoffeeBag({ coffee, className, title }: { coffee: Coffee; className?: string; title?: string }) {
  const id = useId().replace(/:/g, '')
  const level = roastLevel[coffee.roast]
  const ink = coffee.label === '#F7EEE2' ? coffee.ink : '#F3E9DC'
  return (
    <svg viewBox="0 0 200 270" className={className} role="img" aria-label={title ?? `${coffee.name} coffee bag`}>
      <defs>
        <linearGradient id={`shade-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0.04" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`bottom-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <filter id={`soft-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* ground shadow */}
      <ellipse cx="100" cy="258" rx="74" ry="7" fill="#000" opacity="0.28" filter={`url(#soft-${id})`} />
      {/* body */}
      <path d="M30 34 H170 L176 236 Q176 252 160 253 H40 Q24 252 24 236 Z" fill={coffee.bag} />
      <path d="M30 34 H170 L176 236 Q176 252 160 253 H40 Q24 252 24 236 Z" fill={`url(#shade-${id})`} />
      <path d="M24 200 H176 V236 Q176 252 160 253 H40 Q24 252 24 236 Z" fill={`url(#bottom-${id})`} />
      {/* crimped top */}
      <rect x="28" y="16" width="144" height="22" rx="2" fill={coffee.bag} />
      <rect x="28" y="16" width="144" height="22" rx="2" fill={`url(#shade-${id})`} />
      {Array.from({ length: 23 }).map((_, i) => (
        <line key={i} x1={33 + i * 6} y1="19" x2={33 + i * 6} y2="35" stroke="#000" strokeOpacity="0.16" strokeWidth="1" />
      ))}
      <rect x="28" y="37" width="144" height="2" fill="#000" opacity="0.18" />
      {/* tear notch + valve */}
      <circle cx="100" cy="60" r="6" fill="#000" opacity="0.12" />
      <circle cx="100" cy="60" r="2.4" fill="#000" opacity="0.18" />

      {/* label */}
      <rect x="46" y="84" width="108" height="132" rx="2" fill={coffee.label} />
      <g fill={ink}>
        {/* ember mark */}
        <circle cx="100" cy="104" r="7.5" fill="none" stroke={ink} strokeWidth="1.4" />
        <path d="M100 98.5 C103 102 103.8 104 100 110 C96.2 104 97 102 100 98.5 Z" fill="#C4552D" />
        <text x="100" y="131" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="15" fontWeight="600" letterSpacing="3.5">
          EMBER
        </text>
        <rect x="62" y="139" width="76" height="0.8" opacity="0.4" />
        <text x="100" y="158" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="11.5" fontStyle="italic">
          {coffee.name}
        </text>
        <text x="100" y="174" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="6.4" letterSpacing="1.4" opacity="0.75">
          {coffee.origin.toUpperCase()} · {coffee.process.toUpperCase().split(' ')[0]}
        </text>
        {/* roast meter */}
        <g transform="translate(79 188)">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={i * 15} y="0" width="12" height="3" rx="1.5" opacity={i < level ? 0.9 : 0.2} fill={i < level ? '#C4552D' : ink} />
          ))}
        </g>
        <text x="100" y="206" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="5.6" letterSpacing="1.2" opacity="0.6">
          {coffee.roast.toUpperCase()} ROAST · 250 G
        </text>
      </g>
      {/* highlight streak */}
      <path d="M66 40 L72 250" stroke="#fff" strokeOpacity="0.07" strokeWidth="10" />
    </svg>
  )
}
