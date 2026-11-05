import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, CheckCircle2, FolderKanban, LayoutDashboard, Menu, Moon, Search, Settings as SettingsIcon, Sun, Users, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { DemoOverlay, useDemo } from '../DemoContext'
import type { DemoProps } from '../registry'
import { RANGES, type RangeId } from './data'
import { useMetrics, usePulseData } from './model'
import { focus, themes, themeVars } from './ui'
import { AnalyticsView, emptyFilters, Overview, ProjectsView, SettingsView, TasksView, TeamView, type Ctx, type Settings, type TaskFilters, type View } from './views'

const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

/** PULSE — project management dashboard prototype with live, derived data. */
export default function PulseDemo(_props: DemoProps) {
  useDemo()
  const mainRef = useRef<HTMLDivElement>(null)
  const data = usePulseData()
  const [view, setView] = useState<View>('overview')
  const [range, setRange] = useState<RangeId>('30d')
  const [themeName, setThemeName] = useState<'dark' | 'light'>('dark')
  const [filters, setFilters] = useState<TaskFilters>(emptyFilters)
  const [settings, setSettings] = useState<Settings>({ workspace: 'Northwind Studio', compact: false, emailDigest: true, mentions: true, weekStartsMonday: true })
  const [drawer, setDrawer] = useState(false)
  const [query, setQuery] = useState('')
  const theme = themes[themeName]
  const metrics = useMetrics(data.tasks, RANGES.find((r) => r.id === range)!.days)

  const go = useCallback(
    (v: View, f?: Partial<TaskFilters>) => {
      setView(v)
      if (f) setFilters({ ...emptyFilters, ...f })
      setDrawer(false)
      mainRef.current?.scrollTo({ top: 0 })
    },
    [],
  )

  useEffect(() => {
    if (!drawer) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [drawer])

  const ctx: Ctx = { data, metrics, theme, range, setRange, go, filters, setFilters, settings, setSettings, setThemeName }
  const counts = useMemo(() => ({ tasks: data.tasks.filter((t) => t.status !== 'Done').length, projects: metrics.byProject.length }), [data.tasks, metrics.byProject.length])

  const search = (e: FormEvent) => {
    e.preventDefault()
    go('tasks', { q: query })
  }

  const renderSidebar = (close?: React.ReactNode) => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <span className="grid size-7 place-items-center rounded-[7px] bg-(--p-accent) text-(--p-accent-fg)">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M1.5 8.5h3l1.6-4 3 8 1.9-4.5h3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em]">Pulse</span>
        {close ?? <span className="ml-auto rounded-[5px] border border-(--p-line) px-1.5 py-0.5 text-[10px] font-medium text-(--p-muted)">Demo</span>}
      </div>
      <p className="px-4 pb-2 pt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-(--p-muted)">Workspace</p>
      <nav aria-label="Dashboard" className="space-y-0.5 px-2">
        {nav.map(({ id, label, icon: Icon }) => {
          const on = view === id
          const count = id === 'tasks' ? counts.tasks : id === 'projects' ? counts.projects : null
          return (
            <button
              key={id}
              type="button"
              onClick={() => go(id, id === 'tasks' ? emptyFilters : undefined)}
              aria-current={on ? 'page' : undefined}
              className={cn('relative flex min-h-9 w-full items-center gap-3 rounded-[7px] px-2.5 text-[13px] font-medium transition-colors', focus, on ? 'bg-(--p-soft) text-(--p-fg)' : 'text-(--p-muted) hover:bg-(--p-panel2) hover:text-(--p-fg)')}
            >
              {on && <motion.span layoutId="pulse-nav" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-(--p-accent)" />}
              <Icon size={16} strokeWidth={1.75} />
              {label}
              {count !== null && <span className="ml-auto text-[11px] tabular-nums text-(--p-muted)">{count}</span>}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto space-y-3 p-3">
        <div className="rounded-[9px] border border-(--p-line) bg-(--p-panel2) p-3">
          <p className="text-[12px] font-medium">Sprint 14</p>
          <p className="mt-0.5 text-[11px] text-(--p-muted)">{Math.round(metrics.completionRate * 100)}% complete</p>
          <span className="mt-2 block h-1 overflow-hidden rounded-full bg-(--p-line)">
            <span className="block h-full rounded-full bg-(--p-accent) transition-[width] duration-700" style={{ width: `${metrics.completionRate * 100}%` }} />
          </span>
        </div>
        <button type="button" onClick={() => setThemeName(themeName === 'dark' ? 'light' : 'dark')} className={cn('flex min-h-9 w-full items-center gap-3 rounded-[7px] px-2.5 text-[13px] font-medium text-(--p-muted) hover:bg-(--p-panel2) hover:text-(--p-fg)', focus)}>
          {themeName === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {themeName === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={themeVars(theme)} className="h-full bg-(--p-bg) font-['Inter_Variable',system-ui,sans-serif] text-(--p-fg) antialiased transition-colors duration-300">
      <div className="flex h-full">
        <aside className="hidden h-full w-[232px] shrink-0 overflow-y-auto border-r border-(--p-line) bg-(--p-panel) @4xl:block">{renderSidebar()}</aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="z-30 flex h-14 shrink-0 items-center gap-3 border-b border-(--p-line) bg-(--p-bg) px-4 @3xl:px-6">
            <button type="button" onClick={() => setDrawer(true)} className={cn('grid size-9 place-items-center rounded-[7px] border border-(--p-line) @4xl:hidden', focus)} aria-label="Open navigation">
              <Menu size={16} />
            </button>
            <p className="text-[13px] font-medium text-(--p-muted)">
              <span className="hidden @md:inline">{settings.workspace} / </span>
              <span className="text-(--p-fg)">{nav.find((n) => n.id === view)!.label}</span>
            </p>
            <form onSubmit={search} role="search" className="relative ml-auto hidden @2xl:block">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--p-muted)" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                aria-label="Search tasks"
                className={cn('min-h-9 w-[220px] rounded-[7px] border border-(--p-line) bg-(--p-panel) pl-8 pr-3 text-[13px] placeholder:text-(--p-muted)', focus)}
              />
            </form>
            <button type="button" onClick={() => setThemeName(themeName === 'dark' ? 'light' : 'dark')} className={cn('ml-auto grid size-9 place-items-center rounded-[7px] border border-(--p-line) text-(--p-muted) hover:text-(--p-fg) @2xl:ml-0', focus)} aria-label={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}>
              {themeName === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <span className="grid size-8 place-items-center rounded-full bg-[#F5B544] text-[11px] font-semibold text-[#0E1015]" aria-hidden>
              MB
            </span>
          </header>

          <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 @3xl:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                {view === 'overview' && <Overview c={ctx} />}
                {view === 'projects' && <ProjectsView c={ctx} />}
                {view === 'tasks' && <TasksView c={ctx} />}
                {view === 'analytics' && <AnalyticsView c={ctx} />}
                {view === 'team' && <TeamView c={ctx} />}
                {view === 'settings' && <SettingsView c={ctx} />}
              </motion.div>
            </AnimatePresence>
            <p className="mt-10 text-center text-[11px] text-(--p-muted)">Pulse is a UI/UX concept. People, projects and numbers are sample data.</p>
          </main>
        </div>
      </div>

      <DemoOverlay>
        <AnimatePresence>
          {drawer && (
            <motion.div key="drawer" style={themeVars(theme)} className="absolute inset-0 text-(--p-fg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
              <motion.aside
                className="absolute inset-y-0 left-0 w-[min(82%,272px)] border-r border-(--p-line) bg-(--p-panel) font-['Inter_Variable',system-ui,sans-serif]"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Navigation"
              >
                {renderSidebar(
                  <button type="button" autoFocus onClick={() => setDrawer(false)} className={cn('ml-auto grid size-8 place-items-center rounded-[7px] text-(--p-muted) hover:text-(--p-fg)', focus)} aria-label="Close navigation">
                    <X size={16} />
                  </button>,
                )}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoOverlay>
    </div>
  )
}
