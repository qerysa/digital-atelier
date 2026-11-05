import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface DemoProps {
  /** true when rendered inside the case-study frame, false on the full-screen route */
  embedded?: boolean
}

interface ProjectModule {
  /** Art-directed preview used on the home page and case-study hero */
  Cover?: LazyExoticComponent<ComponentType>
  /** Interactive demo — rendered in the case study and at /work/:slug/live */
  Demo?: LazyExoticComponent<ComponentType<DemoProps>>
}

/**
 * Maps project slugs (from src/data/projects.ts) to their visual modules.
 * Everything is code-split: a project's code loads only when it is needed.
 */
export const projectModules: Record<string, ProjectModule> = {
  ember: { Cover: lazy(() => import('./ember/Cover')), Demo: lazy(() => import('./ember/Demo')) },
  aurel: { Cover: lazy(() => import('./aurel/Cover')), Demo: lazy(() => import('./aurel/Demo')) },
  pulse: { Cover: lazy(() => import('./pulse/Cover')), Demo: lazy(() => import('./pulse/Demo')) },
  noire: { Cover: lazy(() => import('./noire/Cover')), Demo: lazy(() => import('./noire/Demo')) },
  signal: { Cover: lazy(() => import('./signal/Cover')), Demo: lazy(() => import('./signal/Demo')) },
}
