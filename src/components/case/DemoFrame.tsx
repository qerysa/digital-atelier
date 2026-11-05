import { Maximize2 } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { Project } from '@/data/projects'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import { projectModules } from '@/projects/registry'
import { DemoViewport } from '@/projects/DemoContext'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export function DemoLoading({ project, label = 'Loading demo' }: { project: Project; label?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: project.theme.bg, color: project.theme.muted }}>
      <div className="flex flex-col items-center gap-4">
        <span className="relative block h-px w-32 overflow-hidden" style={{ background: project.theme.line }}>
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[marquee_1.2s_ease-in-out_infinite]" style={{ background: project.theme.accent }} />
        </span>
        <span className="label-mono">{label}…</span>
      </div>
    </div>
  )
}

export function DemoError({ project, message }: { project: Project; message?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-8 text-center" style={{ background: project.theme.bg, color: project.theme.fg }}>
      <div className="max-w-md">
        <p className="label-mono" style={{ color: project.theme.accent }}>Demo unavailable</p>
        <p className="mt-3 text-lg">{message ?? 'This interactive demo could not start in your browser.'}</p>
        <p className="mt-2 text-sm" style={{ color: project.theme.muted }}>
          Try reloading the page or opening it in an up-to-date desktop browser.
        </p>
      </div>
    </div>
  )
}

/** Live demo embedded in the case study. Code is fetched only when the frame approaches the viewport. */
export function DemoFrame({ project }: { project: Project }) {
  const Demo = projectModules[project.slug]?.Demo
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '700px 0px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  if (!Demo) return null
  const isStage = project.demo.frame === 'stage'
  const t = project.theme

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-[8px] border shadow-[0_40px_120px_rgba(0,0,0,0.35)]" style={{ borderColor: t.line, background: t.surface }}>
        <div className="flex h-11 items-center justify-between gap-4 border-b px-4" style={{ borderColor: t.line }}>
          <div className="flex items-center gap-2" aria-hidden>
            {isStage ? (
              <span className="label-mono !text-[11px]" style={{ color: t.muted }}>● Live</span>
            ) : (
              <>
                <span className="size-2.5 rounded-full" style={{ background: t.line }} />
                <span className="size-2.5 rounded-full" style={{ background: t.line }} />
                <span className="size-2.5 rounded-full" style={{ background: t.line }} />
              </>
            )}
          </div>
          <span className="label-mono hidden truncate !text-[11px] sm:block" style={{ color: t.muted }}>
            {project.title} — {project.demo.label}
          </span>
          <Link
            to={`/work/${project.slug}/live`}
            className="inline-flex min-h-9 items-center gap-2 rounded-[3px] px-2 label-mono !text-[11px] transition-opacity hover:opacity-70"
            style={{ color: t.fg }}
          >
            <Maximize2 size={13} /> Full screen
          </Link>
        </div>
        <DemoViewport
          embedded
          scroll={!isStage}
          className={cn(isStage ? (project.demo.aspect ?? 'aspect-[4/5] sm:aspect-video') : 'h-[min(80svh,860px)] min-h-[560px]')}
        >
          {near ? (
            <ErrorBoundary fallback={<DemoError project={project} />}>
              <Suspense fallback={<DemoLoading project={project} />}>
                <Demo embedded />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <DemoLoading project={project} label="Preparing demo" />
          )}
        </DemoViewport>
      </div>
      <p className="label-mono mt-4 !text-[11px]" style={{ color: t.muted }}>
        {project.demo.hint}
      </p>
    </div>
  )
}
