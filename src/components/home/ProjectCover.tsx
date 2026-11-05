import { Component, Suspense, type ReactNode } from 'react'
import type { Project } from '@/data/projects'
import { projectModules } from '@/projects/registry'
import { Img } from '@/components/ui/Img'

class CoverBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Renders a project's custom cover, falling back to its cover image. */
export function ProjectCover({ project }: { project: Project }) {
  const Cover = projectModules[project.slug]?.Cover
  const fallback = project.cover ? (
    <Img image={project.cover} className="absolute inset-0 size-full object-cover" />
  ) : (
    <div className="absolute inset-0" style={{ background: project.theme.bg }} />
  )
  if (!Cover) return fallback
  return (
    <CoverBoundary fallback={fallback}>
      <Suspense fallback={<div className="absolute inset-0 animate-pulse" style={{ background: project.theme.bg }} />}>
        <Cover />
      </Suspense>
    </CoverBoundary>
  )
}
