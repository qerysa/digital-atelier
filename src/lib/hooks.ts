import { useEffect, useState } from 'react'
import { site } from '@/config/site'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

/** Sets document title / meta description / canonical for the current view. */
export function useDocumentMeta(title?: string, description?: string, path = '/') {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.brand.name}` : site.seo.title
    document.title = fullTitle
    const desc = description ?? site.seo.description
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    if (site.url) {
      const url = site.url.replace(/\/$/, '') + path
      setMeta('property', 'og:url', url)
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = url
    }
  }, [title, description, path])
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Copies text and reports success; falls back to a hidden textarea. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

/** Runs a callback on every animation frame while `active`. */
export function useRaf(cb: (dt: number, t: number) => void, active = true) {
  useEffect(() => {
    if (!active) return
    let id = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      cb(dt, now / 1000)
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
