import { AlertTriangle, ArrowDownRight, ArrowUpDown, ArrowUpRight, CalendarClock, CheckCircle2, CircleDot, ListTodo, RotateCcw, Search, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { members, PRIORITIES, priorityRank, projects, RANGES, relDue, STATUSES, fmtDay, type Priority, type RangeId, type Status, type Task } from './data'
import type { Metrics, PulseData } from './model'
import { PriorityBars, StatusDonut, ThroughputChart, WeeklyBars } from './charts'
import { Avatar, Card, focus, pct, PriorityTag, Progress, Segmented, StatusPill, StatusSelect, Toggle, type PulseTheme } from './ui'

export type View = 'overview' | 'projects' | 'tasks' | 'analytics' | 'team' | 'settings'
export interface TaskFilters {
  q: string
  status: Status | 'all'
  priority: Priority | 'all'
  assignee: string
  project: string
}
export const emptyFilters: TaskFilters = { q: '', status: 'all', priority: 'all', assignee: 'all', project: 'all' }

export interface Settings {
  workspace: string
  compact: boolean
  emailDigest: boolean
  mentions: boolean
  weekStartsMonday: boolean
}

export interface Ctx {
  data: PulseData
  metrics: Metrics
  theme: PulseTheme
  range: RangeId
  setRange: (r: RangeId) => void
  go: (v: View, filters?: Partial<TaskFilters>) => void
  filters: TaskFilters
  setFilters: (f: TaskFilters) => void
  settings: Settings
  setSettings: (s: Settings) => void
  setThemeName: (n: 'dark' | 'light') => void
}

const rangeOptions = RANGES.map((r) => ({ id: r.id, label: r.label }))
const rangeDays = (r: RangeId) => RANGES.find((x) => x.id === r)!.days
const projectOf = (id: string) => projects.find((p) => p.id === id)!
const memberOf = (id: string) => members.find((m) => m.id === id)!

function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.01em]">{title}</h1>
        {sub && <p className="mt-1 text-[13px] text-(--p-muted)">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function Kpi({ label, value, icon, foot, tone }: { label: string; value: ReactNode; icon: ReactNode; foot?: ReactNode; tone?: string }) {
  return (
    <div className="min-w-0 rounded-[10px] border border-(--p-line) bg-(--p-panel) p-4">
      <div className="flex items-center justify-between gap-2 text-(--p-muted)">
        <span className="truncate text-[12px] font-medium">{label}</span>
        <span style={{ color: tone }}>{icon}</span>
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{value}</p>
      {foot && <p className="mt-2 truncate text-[12px] text-(--p-muted)">{foot}</p>}
    </div>
  )
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span>No previous period</span>
  const up = value >= 0
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn('inline-flex items-center font-medium', up ? 'text-(--p-good)' : 'text-(--p-bad)')}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(Math.round(value * 100))}%
      </span>
      <span className="@xl:hidden">vs prev.</span>
      <span className="hidden @xl:inline">vs previous period</span>
    </span>
  )
}

/* ─────────────────────────── Overview ─────────────────────────── */

export function Overview({ c }: { c: Ctx }) {
  const { metrics: m, data } = c
  const attention = useMemo(
    () =>
      data.tasks
        .filter((t) => t.status !== 'Done' && (t.due < 0 || t.status === 'Blocked' || t.priority === 'Urgent' || t.due <= 1))
        .sort((a, b) => a.due - b.due || priorityRank[b.priority] - priorityRank[a.priority])
        .slice(0, 5),
    [data.tasks],
  )
  return (
    <div className="space-y-5">
      <PageHead title="Overview" sub={`${c.settings.workspace} · ${fmtDay(0, { weekday: 'long', month: 'long', day: 'numeric' })}`}>
        <Segmented label="Time range" value={c.range} options={rangeOptions} onChange={c.setRange} />
      </PageHead>

      <div className="grid grid-cols-2 gap-3 @4xl:grid-cols-4">
        <Kpi label="Open tasks" value={m.open} icon={<ListTodo size={16} />} foot={`${m.dueSoon} due in the next 3 days`} />
        <Kpi label={`Completed · ${c.range}`} value={m.completed} icon={<CheckCircle2 size={16} />} tone="#3DD6A5" foot={<Delta value={m.completedDelta} />} />
        <Kpi label="Sprint completion" value={pct(m.completionRate)} icon={<CircleDot size={16} />} tone={c.theme.accent} foot={`${m.doneCount} of ${data.tasks.length} sprint tasks`} />
        <Kpi label="Overdue" value={m.overdue} icon={<AlertTriangle size={16} />} tone={m.overdue ? '#FF7A6B' : undefined} foot={`${m.blocked} blocked`} />
      </div>

      <div className="grid gap-3 @5xl:grid-cols-[1.7fr_1fr]">
        <Card
          title="Throughput"
          action={
            <span className="flex items-center gap-3 text-[11px] text-(--p-muted)">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 rounded bg-(--p-accent)" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0 w-3 border-t border-dashed border-(--p-muted)" /> Created
              </span>
            </span>
          }
        >
          <ThroughputChart metrics={m} theme={c.theme} />
        </Card>
        <Card title="Sprint status">
          <StatusDonut metrics={m} theme={c.theme} />
        </Card>
      </div>

      <div className="grid gap-3 @5xl:grid-cols-[1.7fr_1fr]">
        <Card
          title="Needs attention"
          action={
            <button type="button" onClick={() => c.go('tasks')} className={cn('min-h-8 rounded-[6px] px-2 text-[12px] font-medium text-(--p-accent) hover:bg-(--p-soft)', focus)}>
              All tasks →
            </button>
          }
          bodyClassName="px-0 pb-2 pt-1"
        >
          {attention.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-(--p-muted)">Nothing urgent. Nice work.</p>
          ) : (
            <ul className="divide-y divide-(--p-line)">
              {attention.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
                  <div className="min-w-0 flex-1 basis-[200px]">
                    <p className="truncate text-[13px] font-medium">{t.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-(--p-muted)">
                      <span className="size-1.5 rounded-full" style={{ background: projectOf(t.project).color }} />
                      {projectOf(t.project).name} · <span className={cn(t.due < 0 && 'text-(--p-bad)')}>{relDue(t.due)}</span>
                    </p>
                  </div>
                  <Avatar id={t.assignee} size={24} />
                  <StatusSelect value={t.status} onChange={(s) => data.setStatus(t.id, s)} label={`Status of ${t.title}`} />
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Projects" action={<button type="button" onClick={() => c.go('projects')} className={cn('min-h-8 rounded-[6px] px-2 text-[12px] font-medium text-(--p-accent) hover:bg-(--p-soft)', focus)}>View all →</button>}>
          <ul className="space-y-4">
            {m.byProject.slice(0, 5).map((p) => (
              <li key={p.project.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[12px]">
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <span className="size-2 shrink-0 rounded-[3px]" style={{ background: p.project.color }} />
                    <span className="truncate">{p.project.name}</span>
                  </span>
                  <span className="tabular-nums text-(--p-muted)">
                    {p.done}/{p.total}
                  </span>
                </div>
                <Progress value={p.progress} color={p.project.color} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ─────────────────────────── Projects ─────────────────────────── */

type Health = 'all' | 'On track' | 'At risk' | 'Completed'
const healthColor = { 'On track': '#3DD6A5', 'At risk': '#FF7A6B', Completed: '#8B8BFF' }

export function ProjectsView({ c }: { c: Ctx }) {
  const [health, setHealth] = useState<Health>('all')
  const list = c.metrics.byProject.filter((p) => health === 'all' || p.health === health)
  const opts: { id: Health; label: string }[] = [
    { id: 'all', label: `All ${c.metrics.byProject.length}` },
    ...(['On track', 'At risk', 'Completed'] as const).map((h) => ({ id: h, label: `${h} ${c.metrics.byProject.filter((p) => p.health === h).length}` })),
  ]
  return (
    <div className="space-y-5">
      <PageHead title="Projects" sub="Health is calculated from overdue and blocked tasks.">
        <Segmented label="Filter by health" value={health} options={opts} onChange={setHealth} />
      </PageHead>
      {list.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-(--p-line) p-10 text-center text-[13px] text-(--p-muted)">No projects match this filter.</p>
      ) : (
        <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {list.map((p) => {
            const people = Array.from(new Set(c.data.tasks.filter((t) => t.project === p.project.id).map((t) => t.assignee)))
            return (
              <button
                key={p.project.id}
                type="button"
                onClick={() => c.go('tasks', { ...emptyFilters, project: p.project.id })}
                className={cn('group flex flex-col rounded-[10px] border border-(--p-line) bg-(--p-panel) p-5 text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-(--p-muted)', focus)}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-[8px] text-[13px] font-bold text-[#0E1015]" style={{ background: p.project.color }}>
                    {p.project.name[0]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-(--p-line) px-2 py-0.5 text-[11px] font-medium">
                    <span className="size-1.5 rounded-full" style={{ background: healthColor[p.health] }} />
                    {p.health}
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-semibold">{p.project.name}</p>
                <p className="mt-0.5 text-[12px] text-(--p-muted)">
                  {p.project.area} · Lead {memberOf(p.project.lead).name.split(' ')[0]}
                </p>
                <div className="mt-5 flex items-center justify-between text-[12px]">
                  <span className="text-(--p-muted)">Progress</span>
                  <span className="font-medium tabular-nums">{pct(p.progress)}</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={p.progress} color={p.project.color} />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex -space-x-1.5">
                    {people.slice(0, 4).map((id) => (
                      <Avatar key={id} id={id} size={24} ring />
                    ))}
                  </span>
                  <span className={cn('inline-flex items-center gap-1.5 text-[12px]', p.project.due < 0 && p.health !== 'Completed' ? 'text-(--p-bad)' : 'text-(--p-muted)')}>
                    <CalendarClock size={13} /> {p.project.due < 0 ? `Due ${-p.project.due}d ago` : `Due ${fmtDay(p.project.due)}`}
                  </span>
                </div>
                <p className="mt-4 border-t border-(--p-line) pt-3 text-[12px] text-(--p-muted) transition-colors group-hover:text-(--p-accent)">
                  {p.done} of {p.total} tasks done · Open tasks →
                </p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────── Tasks ─────────────────────────── */

type SortKey = 'due' | 'priority' | 'none'

export function TasksView({ c }: { c: Ctx }) {
  const f = c.filters
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'due', dir: 1 })
  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const out = c.data.tasks.filter(
      (t) =>
        (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (f.status === 'all' || t.status === f.status) &&
        (f.priority === 'all' || t.priority === f.priority) &&
        (f.assignee === 'all' || t.assignee === f.assignee) &&
        (f.project === 'all' || t.project === f.project),
    )
    // Completed work always sinks to the bottom so open tasks stay in focus
    const doneLast = (a: Task, b: Task) => Number(a.status === 'Done') - Number(b.status === 'Done')
    if (sort.key === 'due') out.sort((a, b) => doneLast(a, b) || (a.due - b.due) * sort.dir)
    if (sort.key === 'priority') out.sort((a, b) => doneLast(a, b) || (priorityRank[b.priority] - priorityRank[a.priority]) * sort.dir || a.due - b.due)
    return out
  }, [c.data.tasks, f, sort])
  const active = f.q || f.status !== 'all' || f.priority !== 'all' || f.assignee !== 'all' || f.project !== 'all'
  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))
  const rowPad = c.settings.compact ? 'py-1.5' : 'py-3'
  const select = cn('min-h-9 rounded-[7px] border border-(--p-line) bg-(--p-panel) px-2.5 text-[12px] text-(--p-fg)', focus)

  return (
    <div className="space-y-5">
      <PageHead title="Tasks" sub={`${list.length} of ${c.data.tasks.length} tasks${f.project !== 'all' ? ` · ${projectOf(f.project).name}` : ''}`} />

      <div className="grid grid-cols-2 items-center gap-2 @3xl:flex @3xl:flex-wrap">
        <label className="relative col-span-2 min-w-[200px] flex-1 @3xl:max-w-[300px]">
          <span className="sr-only">Search tasks</span>
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--p-muted)" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => c.setFilters({ ...f, q: e.target.value })}
            placeholder="Search by title or ID"
            className={cn('min-h-9 w-full rounded-[7px] border border-(--p-line) bg-(--p-panel) pl-8 pr-3 text-[13px] placeholder:text-(--p-muted)', focus)}
          />
        </label>
        <select aria-label="Filter by status" value={f.status} onChange={(e) => c.setFilters({ ...f, status: e.target.value as TaskFilters['status'] })} className={select}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Filter by priority" value={f.priority} onChange={(e) => c.setFilters({ ...f, priority: e.target.value as TaskFilters['priority'] })} className={select}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select aria-label="Filter by assignee" value={f.assignee} onChange={(e) => c.setFilters({ ...f, assignee: e.target.value })} className={select}>
          <option value="all">Everyone</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select aria-label="Filter by project" value={f.project} onChange={(e) => c.setFilters({ ...f, project: e.target.value })} className={select}>
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {active && (
          <button type="button" onClick={() => c.setFilters(emptyFilters)} className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-[7px] px-2.5 text-[12px] font-medium text-(--p-muted) hover:text-(--p-fg)', focus)}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Quick status filters */}
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {(['all', ...STATUSES] as const).map((s) => {
          const n = s === 'all' ? c.data.tasks.length : c.data.tasks.filter((t) => t.status === s).length
          const on = f.status === s
          return (
            <button key={s} type="button" onClick={() => c.setFilters({ ...f, status: s })} aria-pressed={on} className={cn('inline-flex min-h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors', focus, on ? 'border-(--p-accent) bg-(--p-soft)' : 'border-(--p-line) text-(--p-muted) hover:text-(--p-fg)')}>
              {s === 'all' ? 'All' : s}
              <span className="tabular-nums opacity-70">{n}</span>
            </button>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-(--p-line) bg-(--p-panel)">
        {list.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[14px] font-medium">No tasks match these filters</p>
            <button type="button" onClick={() => c.setFilters(emptyFilters)} className={cn('mt-3 min-h-9 rounded-[7px] px-3 text-[12px] font-medium text-(--p-accent) hover:bg-(--p-soft)', focus)}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Table for wider containers */}
            <table className="hidden w-full table-fixed text-left text-[13px] @3xl:table">
              <colgroup>
                <col />
                <col className="w-[130px]" />
                <col className="w-[110px]" />
                <col className="w-[130px]" />
                <col className="w-[170px]" />
              </colgroup>
              <thead className="border-b border-(--p-line) text-[11px] font-medium uppercase tracking-[0.06em] text-(--p-muted)">
                <tr>
                  <th className="py-2.5 pl-4 pr-3 font-medium">Task</th>
                  <th className="px-3 font-medium">Assignee</th>
                  <th className="px-3 font-medium">
                    <SortButton label="Priority" on={sort.key === 'priority'} onClick={() => toggleSort('priority')} />
                  </th>
                  <th className="px-3 font-medium">
                    <SortButton label="Due" on={sort.key === 'due'} onClick={() => toggleSort('due')} />
                  </th>
                  <th className="py-2.5 pl-3 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--p-line)">
                {list.map((t) => (
                  <TaskRow key={t.id} t={t} c={c} pad={rowPad} />
                ))}
              </tbody>
            </table>
            {/* Cards for narrow containers */}
            <ul className="divide-y divide-(--p-line) @3xl:hidden">
              {list.map((t) => (
                <li key={t.id} className="space-y-2.5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn('text-[13px] font-medium', t.status === 'Done' && 'text-(--p-muted) line-through decoration-(--p-muted)/50')}>{t.title}</p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] text-(--p-muted)">
                        <span className="size-1.5 rounded-full" style={{ background: projectOf(t.project).color }} />
                        {t.id} · {projectOf(t.project).name}
                      </p>
                    </div>
                    <Avatar id={t.assignee} size={24} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusSelect value={t.status} onChange={(s) => c.data.setStatus(t.id, s)} label={`Status of ${t.title}`} />
                    <span className="flex items-center gap-3">
                      <PriorityTag priority={t.priority} />
                      <span className={cn('text-[12px]', t.due < 0 && t.status !== 'Done' ? 'text-(--p-bad)' : 'text-(--p-muted)')}>{t.status === 'Done' ? 'Done' : relDue(t.due)}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function SortButton({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn('inline-flex min-h-8 items-center gap-1 uppercase', focus, on && 'text-(--p-fg)')} aria-label={`Sort by ${label.toLowerCase()}`}>
      {label} <ArrowUpDown size={11} />
    </button>
  )
}

function TaskRow({ t, c, pad }: { t: Task; c: Ctx; pad: string }) {
  const p = projectOf(t.project)
  const m = memberOf(t.assignee)
  return (
    <tr className="transition-colors hover:bg-(--p-panel2)">
      <td className={cn('max-w-0 pl-4 pr-3', pad)}>
        <p className={cn('truncate font-medium', t.status === 'Done' && 'text-(--p-muted) line-through decoration-(--p-muted)/50')}>{t.title}</p>
        <p className="mt-0.5 flex items-center gap-2 truncate whitespace-nowrap text-[11px] text-(--p-muted)">
          <span className="font-mono">{t.id}</span>
          <span className="size-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}
        </p>
      </td>
      <td className={cn('px-3', pad)}>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Avatar id={m.id} size={22} />
          <span className="text-[12px]">{m.name.split(' ')[0]}</span>
        </span>
      </td>
      <td className={cn('px-3', pad)}>
        <PriorityTag priority={t.priority} />
      </td>
      <td className={cn('whitespace-nowrap px-3 text-[12px]', pad, t.due < 0 && t.status !== 'Done' ? 'text-(--p-bad)' : 'text-(--p-muted)')}>{t.status === 'Done' ? `Done ${t.doneOn === 0 ? 'today' : fmtDay(t.doneOn ?? 0)}` : relDue(t.due)}</td>
      <td className={cn('pl-3 pr-4', pad)}>
        <StatusSelect value={t.status} onChange={(s) => c.data.setStatus(t.id, s)} label={`Status of ${t.title}`} />
      </td>
    </tr>
  )
}

/* ─────────────────────────── Analytics ─────────────────────────── */

export function AnalyticsView({ c }: { c: Ctx }) {
  const m = c.metrics
  const days = rangeDays(c.range)
  return (
    <div className="space-y-5">
      <PageHead title="Analytics" sub="Includes archived tasks from earlier sprints (demo data).">
        <Segmented label="Time range" value={c.range} options={rangeOptions} onChange={c.setRange} />
      </PageHead>
      <div className="grid grid-cols-2 gap-3 @4xl:grid-cols-4">
        <Kpi label="Created" value={m.created} icon={<ListTodo size={16} />} foot={`Last ${days} days`} />
        <Kpi label="Completed" value={m.completed} icon={<CheckCircle2 size={16} />} tone="#3DD6A5" foot={<Delta value={m.completedDelta} />} />
        <Kpi label="Net change" value={`${m.created - m.completed > 0 ? '+' : ''}${m.created - m.completed}`} icon={<ArrowUpDown size={16} />} foot={m.created > m.completed ? 'Backlog is growing' : 'Backlog is shrinking'} />
        <Kpi label="Avg. completed / day" value={(m.completed / days).toFixed(1)} icon={<CircleDot size={16} />} tone={c.theme.accent} foot="Across all projects" />
      </div>
      <Card title="Created vs completed">
        <ThroughputChart metrics={m} theme={c.theme} height={280} />
      </Card>
      <div className="grid gap-3 @4xl:grid-cols-2">
        <Card title={days <= 7 ? 'Per day' : 'Per week'}>
          <WeeklyBars metrics={m} theme={c.theme} />
        </Card>
        <Card title="Current sprint by priority">
          <PriorityBars tasks={c.data.tasks} theme={c.theme} />
        </Card>
      </div>
      <Card title="Project progress" bodyClassName="px-0 pb-1 pt-0">
        <ul className="divide-y divide-(--p-line)">
          {m.byProject.map((p) => (
            <li key={p.project.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 @2xl:grid-cols-[200px_1fr_80px]">
              <span className="flex items-center gap-2 text-[13px] font-medium">
                <span className="size-2 rounded-[3px]" style={{ background: p.project.color }} />
                {p.project.name}
              </span>
              <span className="col-span-2 row-start-2 @2xl:col-span-1 @2xl:row-start-auto">
                <Progress value={p.progress} color={p.project.color} />
              </span>
              <span className="text-right text-[12px] tabular-nums text-(--p-muted)">
                {p.done}/{p.total} · {pct(p.progress)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/* ─────────────────────────── Team ─────────────────────────── */

export function TeamView({ c }: { c: Ctx }) {
  const max = Math.max(1, ...c.metrics.byMember.map((m) => m.open))
  return (
    <div className="space-y-5">
      <PageHead title="Team" sub={`${members.length} people · workload updates as tasks move`} />
      <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {c.metrics.byMember.map(({ member, open, done, urgent }) => {
          const next = c.data.tasks.filter((t) => t.assignee === member.id && t.status !== 'Done').sort((a, b) => a.due - b.due).slice(0, 3)
          const load = open / max
          return (
            <div key={member.id} className="flex flex-col rounded-[10px] border border-(--p-line) bg-(--p-panel) p-5">
              <div className="flex items-center gap-3">
                <Avatar id={member.id} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold">{member.name}</p>
                  <p className="truncate text-[12px] text-(--p-muted)">{member.role}</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  ['Open', open],
                  ['Done', done],
                  ['High+', urgent],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[8px] bg-(--p-panel2) py-2.5">
                    <dt className="text-[11px] text-(--p-muted)">{k}</dt>
                    <dd className="mt-0.5 text-[17px] font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex items-center justify-between text-[12px]">
                <span className="text-(--p-muted)">Workload</span>
                <span className={cn('font-medium', load > 0.8 ? 'text-(--p-bad)' : load > 0.5 ? 'text-(--p-warn)' : 'text-(--p-good)')}>{load > 0.8 ? 'Heavy' : load > 0.5 ? 'Balanced' : 'Light'}</span>
              </div>
              <div className="mt-1.5">
                <Progress value={load} color={load > 0.8 ? '#FF7A6B' : load > 0.5 ? '#F5B544' : '#3DD6A5'} />
              </div>
              <ul className="mt-4 space-y-1.5 border-t border-(--p-line) pt-3">
                {next.length === 0 && <li className="text-[12px] text-(--p-muted)">No open tasks</li>}
                {next.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="truncate">{t.title}</span>
                    <StatusPill status={t.status} />
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => c.go('tasks', { ...emptyFilters, assignee: member.id })} className={cn('mt-4 min-h-9 rounded-[7px] border border-(--p-line) text-[12px] font-medium hover:border-(--p-muted)', focus)}>
                View {member.name.split(' ')[0]}’s tasks
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Settings ─────────────────────────── */

export function SettingsView({ c }: { c: Ctx }) {
  const s = c.settings
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="max-w-[720px] space-y-5">
      <PageHead title="Settings" sub="Preferences apply instantly. Nothing is saved to a server." />
      <Card title="Workspace">
        <label className="block">
          <span className="text-[12px] font-medium text-(--p-muted)">Workspace name</span>
          <input
            value={s.workspace}
            maxLength={40}
            onChange={(e) => c.setSettings({ ...s, workspace: e.target.value || 'Untitled workspace' })}
            className={cn('mt-1.5 min-h-10 w-full rounded-[7px] border border-(--p-line) bg-(--p-panel2) px-3 text-[13px]', focus)}
          />
        </label>
      </Card>
      <Card title="Appearance">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <span>
            <span className="block text-[13px] font-medium">Theme</span>
            <span className="mt-0.5 block text-[12px] text-(--p-muted)">Both palettes are contrast-checked.</span>
          </span>
          <Segmented
            label="Theme"
            value={c.theme.name}
            options={[
              { id: 'dark', label: 'Dark' },
              { id: 'light', label: 'Light' },
            ]}
            onChange={c.setThemeName}
          />
        </div>
        <div className="border-t border-(--p-line)">
          <Toggle checked={s.compact} onChange={(v) => c.setSettings({ ...s, compact: v })} label="Compact tables" description="Tighter rows in the task list." />
        </div>
      </Card>
      <Card title="Notifications" bodyClassName="px-4 py-0 divide-y divide-(--p-line)">
        <Toggle checked={s.mentions} onChange={(v) => c.setSettings({ ...s, mentions: v })} label="Mentions & assignments" description="Notify me when someone assigns me a task." />
        <Toggle checked={s.emailDigest} onChange={(v) => c.setSettings({ ...s, emailDigest: v })} label="Weekly email digest" description="A Monday summary of progress and blockers." />
        <Toggle checked={s.weekStartsMonday} onChange={(v) => c.setSettings({ ...s, weekStartsMonday: v })} label="Week starts on Monday" />
      </Card>
      <Card title="Demo data">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[44ch] text-[12px] text-(--p-muted)">Restore every task to its original status. Useful after exploring.</p>
          {confirm ? (
            <span className="flex gap-2">
              <button type="button" onClick={() => setConfirm(false)} className={cn('min-h-9 rounded-[7px] border border-(--p-line) px-3 text-[12px] font-medium', focus)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  c.data.reset()
                  setConfirm(false)
                }}
                className={cn('min-h-9 rounded-[7px] bg-[#FF7A6B] px-3 text-[12px] font-semibold text-[#0E1015]', focus)}
              >
                Reset tasks
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} className={cn('inline-flex min-h-9 items-center gap-2 rounded-[7px] border border-(--p-line) px-3 text-[12px] font-medium hover:border-(--p-muted)', focus)}>
              <RotateCcw size={13} /> Reset demo data
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}
