import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'

/**
 * A tiny, dependency-free router.
 *  • history mode (default): clean URLs like /work/ember — needs an SPA fallback on the host
 *    (vercel.json, public/_redirects and dist/404.html are generated for you).
 *  • hash mode (VITE_ROUTER_MODE=hash): /#/work/ember — works on any static host.
 * Section anchors use the form "/#contact" in both modes.
 */
const MODE: 'history' | 'hash' = import.meta.env.VITE_ROUTER_MODE === 'hash' ? 'hash' : 'history'
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

function readPath(): string {
  if (MODE === 'hash') {
    const h = window.location.hash.replace(/^#/, '')
    return h.startsWith('/') ? h.split('?')[0] || '/' : '/'
  }
  let p = window.location.pathname
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length)
  return p.replace(/\/+$/, '') || '/'
}

function readSection(): string | null {
  if (MODE === 'hash') return null
  const h = window.location.hash.replace(/^#/, '')
  return h || null
}

export function toHref(to: string) {
  const [path, section] = to.split('#')
  const p = path || '/'
  if (MODE === 'hash') return `#${p}`
  return `${BASE}${p}${section ? `#${section}` : ''}`
}

interface RouterValue {
  path: string
  navigate: (to: string, opts?: { replace?: boolean }) => void
  /** Section requested by the last navigation (consumed by the home page) */
  pendingSection: React.RefObject<string | null>
}

const RouterContext = createContext<RouterValue | null>(null)

export function scrollToSection(id: string, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' })
  return true
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readPath)
  const pendingSection = useRef<string | null>(readSection())

  useEffect(() => {
    const onChange = () => setPath(readPath())
    window.addEventListener('popstate', onChange)
    if (MODE === 'hash') window.addEventListener('hashchange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  const navigate = useCallback(
    (to: string, opts?: { replace?: boolean }) => {
      const [rawPath, section] = to.split('#')
      const target = rawPath || '/'
      if (target === readPath()) {
        if (section) {
          scrollToSection(section)
          if (MODE === 'history') window.history.replaceState(null, '', toHref(to))
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      }
      pendingSection.current = section ?? null
      const href = toHref(section && MODE === 'history' ? to : target)
      if (opts?.replace) window.history.replaceState(null, '', href)
      else window.history.pushState(null, '', href)
      setPath(target)
    },
    [],
  )

  const value = useMemo(() => ({ path, navigate, pendingSection }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>')
  return ctx
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; ref?: Ref<HTMLAnchorElement> }

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={toHref(to)} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

/** Matches "/work/:slug" style patterns. */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split('/').filter(Boolean)
  const b = path.split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}
