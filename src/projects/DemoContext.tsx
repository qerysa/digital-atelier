import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface DemoContextValue {
  /** The demo's own scroll container (demos never scroll the window) */
  scrollRef: RefObject<HTMLDivElement | null>
  /** Non-scrolling layer for drawers, modals and toasts */
  overlay: HTMLDivElement | null
  embedded: boolean
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoViewport>')
  return ctx
}

/** Renders children into the demo's overlay layer. */
export function DemoOverlay({ children }: { children: ReactNode }) {
  const { overlay } = useDemo()
  return overlay ? createPortal(children, overlay) : null
}

/**
 * Self-contained viewport for a demo: its own scroll container, overlay layer
 * and container-query context, so a demo behaves the same inside a case-study
 * frame and full screen.
 */
export function DemoViewport({ children, embedded, className, scroll = true }: { children: ReactNode; embedded: boolean; className?: string; scroll?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  useEffect(() => setOverlay(overlayRef.current), [])
  return (
    <DemoContext.Provider value={{ scrollRef, overlay, embedded }}>
      <div className={cn('relative isolate overflow-hidden', className)}>
        <div ref={scrollRef} className={cn('@container absolute inset-0', scroll ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden')}>
          {children}
        </div>
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-50 *:pointer-events-auto" />
      </div>
    </DemoContext.Provider>
  )
}
