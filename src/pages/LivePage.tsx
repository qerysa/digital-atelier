import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import type { Project } from '@/data/projects'
import { useDocumentMeta } from '@/lib/hooks'
import { Link } from '@/lib/router'
import { projectModules } from '@/projects/registry'
import { DemoViewport } from '@/projects/DemoContext'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { DemoError, DemoLoading } from '@/components/case/DemoFrame'

/** Full-screen demo route: /work/:slug/live */
export function LivePage({ project }: { project: Project }) {
  const Demo = projectModules[project.slug]?.Demo
  useDocumentMeta(`${project.title} — ${project.demo.label}`, project.description, `/work/${project.slug}/live`)
  return (
    <div className="flex h-[100svh] flex-col bg-graphite">
      <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-ivory/10 px-4">
        <Link to={`/work/${project.slug}`} className="group inline-flex min-h-10 items-center gap-2 label-mono text-ivory/80 hover:text-ivory">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Case study
        </Link>
        <span className="label-mono hidden text-muted sm:block">
          {project.title} — {project.demo.label}
        </span>
        <span className="label-mono text-muted">Concept demo</span>
      </div>
      <DemoViewport embedded={false} scroll={project.demo.frame !== 'stage'} className="flex-1">
        {Demo ? (
          <ErrorBoundary fallback={<DemoError project={project} />}>
            <Suspense fallback={<DemoLoading project={project} />}>
              <Demo embedded={false} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <DemoError project={project} message="This project does not have a live demo yet." />
        )}
      </DemoViewport>
    </div>
  )
}
