import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useMemo } from 'react'
import { getProject } from '@/data/projects'
import { matchRoute, useRouter } from '@/lib/router'
import { HomePage } from '@/pages/HomePage'
import { CaseStudyPage } from '@/pages/CaseStudyPage'
import { LivePage } from '@/pages/LivePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Nav } from '@/components/layout/Nav'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { CursorLabel } from '@/components/layout/CursorLabel'
import { PageCurtain } from '@/components/layout/PageCurtain'
import { ToastHost } from '@/components/ui/Toast'

function useResolvedRoute() {
  const { path } = useRouter()
  return useMemo(() => {
    if (path === '/') return { key: 'home', label: 'Index', chrome: true, element: <HomePage /> }
    const live = matchRoute('/work/:slug/live', path)
    if (live) {
      const p = getProject(live.slug)
      if (p) return { key: `live-${p.slug}`, label: p.title, chrome: false, element: <LivePage project={p} /> }
    }
    const cs = matchRoute('/work/:slug', path)
    if (cs) {
      const p = getProject(cs.slug)
      if (p) return { key: `case-${p.slug}`, label: p.title, chrome: true, element: <CaseStudyPage project={p} /> }
    }
    return { key: '404', label: '404', chrome: true, element: <NotFoundPage /> }
  }, [path])
}

export default function App() {
  const route = useResolvedRoute()
  const { pendingSection } = useRouter()

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only z-[100] rounded-[3px] bg-signal px-4 py-3 text-graphite focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {route.chrome && <Nav />}
      {route.chrome && <ScrollProgress />}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (!pendingSection.current) window.scrollTo({ top: 0, behavior: 'auto' })
        }}
      >
        <motion.main
          id="main"
          key={route.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.1 } }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
        >
          {route.element}
        </motion.main>
      </AnimatePresence>
      <PageCurtain routeKey={route.key} label={route.label} />
      <CursorLabel />
      <ToastHost />
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}
