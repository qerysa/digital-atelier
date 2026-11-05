import { useReducedMotion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtDay, PRIORITIES, statusColor, type Task } from './data'
import type { Metrics } from './model'
import type { PulseTheme } from './ui'

const tooltipStyle = (t: PulseTheme) => ({
  contentStyle: { background: t.panel, border: `1px solid ${t.line}`, borderRadius: 8, fontSize: 12, color: t.fg, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' },
  labelStyle: { color: t.muted, marginBottom: 4 },
  itemStyle: { color: t.fg, padding: 0 },
  cursor: { stroke: t.line, strokeWidth: 1, fill: t.grid },
})

export function ThroughputChart({ metrics, theme, height = 240 }: { metrics: Metrics; theme: PulseTheme; height?: number }) {
  const reduce = useReducedMotion()
  const data = metrics.series.map((d) => ({ ...d, label: fmtDay(d.offset) }))
  const id = `grad-${theme.name}`
  return (
    <div style={{ height }} role="img" aria-label={`Tasks created and completed per day over the last ${data.length} days. ${metrics.completed} completed, ${metrics.created} created.`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip {...tooltipStyle(theme)} />
          <Area type="monotone" dataKey="created" name="Created" stroke={theme.muted} strokeDasharray="4 4" strokeWidth={1.5} fill="none" isAnimationActive={!reduce} />
          <Area type="monotone" dataKey="completed" name="Completed" stroke={theme.accent} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={!reduce} activeDot={{ r: 4, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatusDonut({ metrics, theme, size = 168 }: { metrics: Metrics; theme: PulseTheme; size?: number }) {
  const reduce = useReducedMotion()
  const total = metrics.byStatus.reduce((s, d) => s + d.count, 0)
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Task status: ${metrics.byStatus.map((s) => `${s.count} ${s.status}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={metrics.byStatus} dataKey="count" nameKey="status" innerRadius="70%" outerRadius="100%" paddingAngle={2} stroke="none" isAnimationActive={!reduce} startAngle={90} endAngle={-270}>
              {metrics.byStatus.map((s) => (
                <Cell key={s.status} fill={statusColor[s.status]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle(theme)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[26px] font-semibold leading-none tabular-nums">{total}</p>
            <p className="mt-1 text-[11px] text-(--p-muted)">tasks</p>
          </div>
        </div>
      </div>
      <ul className="min-w-[140px] flex-1 space-y-2 text-[12px]">
        {metrics.byStatus.map((s) => (
          <li key={s.status} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: statusColor[s.status] }} />
              {s.status}
            </span>
            <span className="tabular-nums text-(--p-muted)">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PriorityBars({ tasks, theme, height = 220 }: { tasks: Task[]; theme: PulseTheme; height?: number }) {
  const reduce = useReducedMotion()
  const data = PRIORITIES.map((p) => ({
    priority: p,
    Open: tasks.filter((t) => t.priority === p && t.status !== 'Done').length,
    Done: tasks.filter((t) => t.priority === p && t.status === 'Done').length,
  }))
  return (
    <div style={{ height }} role="img" aria-label={`Tasks by priority: ${data.map((d) => `${d.priority} ${d.Open} open, ${d.Done} done`).join('; ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barGap={4}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="priority" tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip {...tooltipStyle(theme)} />
          <Bar dataKey="Open" fill={theme.accent} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={!reduce} />
          <Bar dataKey="Done" fill={statusColor.Done} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={!reduce} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WeeklyBars({ metrics, theme, height = 220 }: { metrics: Metrics; theme: PulseTheme; height?: number }) {
  const reduce = useReducedMotion()
  // Group the selected range into weeks (or days for the 7-day range)
  const s = metrics.series
  const bucket = s.length <= 7 ? 1 : 7
  const data: { label: string; Completed: number; Created: number }[] = []
  for (let i = s.length; i > 0; i -= bucket) {
    const chunk = s.slice(Math.max(0, i - bucket), i)
    data.unshift({
      label: bucket === 1 ? fmtDay(chunk[0].offset, { weekday: 'short' }) : `Wk ${fmtDay(chunk[0].offset)}`,
      Completed: chunk.reduce((a, d) => a + d.completed, 0),
      Created: chunk.reduce((a, d) => a + d.created, 0),
    })
  }
  return (
    <div style={{ height }} role="img" aria-label="Created versus completed tasks per period">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barGap={3}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={8} />
          <YAxis tick={{ fill: theme.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip {...tooltipStyle(theme)} />
          <Bar dataKey="Created" fill={theme.muted} fillOpacity={0.45} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={!reduce} />
          <Bar dataKey="Completed" fill={theme.accent} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={!reduce} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
