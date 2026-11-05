/** Tiny className joiner */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/** Resolves a public asset path against the configured base URL. */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`)
}

/** Same as asset() for every URL inside a srcset string. */
export function assetSrcSet(srcSet?: string) {
  if (!srcSet) return undefined
  return srcSet
    .split(',')
    .map((part) => {
      const [url, size] = part.trim().split(/\s+/)
      return `${asset(url)} ${size ?? ''}`.trim()
    })
    .join(', ')
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

/** True when the device can comfortably run heavier WebGL scenes. */
export function canRunHeavy3D() {
  if (typeof window === 'undefined') return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 900
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  return !reduce && !coarse && !narrow && !saveData && hasWebGL()
}

let webglCache: boolean | null = null
export function hasWebGL() {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}
