import { useCallback, useMemo, useState } from 'react'
import { history, initialTasks, members, projects, STATUSES, type Status, type Task } from './data'

export function usePulseData() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const setStatus = useCallback((id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, doneOn: status === 'Done' ? (t.status === 'Done' ? t.doneOn : 0) : undefined } : t)),
    )
  }, [])
  const reset = useCallback(() => setTasks(initialTasks), [])

  return { tasks, setStatus, reset }
}

export type PulseData = ReturnType<typeof usePulseData>

/** Every number in the UI is derived from the task list + archived history — nothing is hard-coded. */
export function useMetrics(tasks: Task[], days: number) {
  return useMemo(() => {
    const series = Array.from({ length: days }, (_, i) => {
      const offset = i - (days - 1)
      const h = history[history.length - days + i]
      const created = h.created + tasks.filter((t) => t.createdOn === offset).length
      const completed = h.completed + tasks.filter((t) => t.doneOn === offset).length
      return { offset, created, completed }
    })
    const prev = history.slice(Math.max(0, history.length - days * 2), history.length - days)
    const completed = series.reduce((s, d) => s + d.completed, 0)
    const created = series.reduce((s, d) => s + d.created, 0)
    const prevCompleted = prev.length === days ? prev.reduce((s, d) => s + d.completed, 0) : null

    const open = tasks.filter((t) => t.status !== 'Done')
    const done = tasks.filter((t) => t.status === 'Done')
    const overdue = open.filter((t) => t.due < 0)
    const blocked = open.filter((t) => t.status === 'Blocked')
    const dueSoon = open.filter((t) => t.due >= 0 && t.due <= 3)

    const byStatus = STATUSES.map((s) => ({ status: s, count: tasks.filter((t) => t.status === s).length }))
    const byMember = members.map((m) => {
      const mine = tasks.filter((t) => t.assignee === m.id)
      return {
        member: m,
        open: mine.filter((t) => t.status !== 'Done').length,
        done: mine.filter((t) => t.status === 'Done').length,
        urgent: mine.filter((t) => t.status !== 'Done' && (t.priority === 'Urgent' || t.priority === 'High')).length,
        total: mine.length,
      }
    })
    const byProject = projects.map((p) => {
      const mine = tasks.filter((t) => t.project === p.id)
      const d = mine.filter((t) => t.status === 'Done').length
      const late = mine.some((t) => t.status !== 'Done' && t.due < 0) || mine.some((t) => t.status === 'Blocked')
      const progress = mine.length ? d / mine.length : 0
      const health: 'Completed' | 'At risk' | 'On track' = progress === 1 ? 'Completed' : late || (p.due < 0 && progress < 1) ? 'At risk' : 'On track'
      return { project: p, total: mine.length, done: d, progress, health }
    })

    return {
      series,
      completed,
      created,
      prevCompleted,
      completedDelta: prevCompleted ? (completed - prevCompleted) / prevCompleted : null,
      open: open.length,
      doneCount: done.length,
      completionRate: tasks.length ? done.length / tasks.length : 0,
      overdue: overdue.length,
      blocked: blocked.length,
      dueSoon: dueSoon.length,
      byStatus,
      byMember,
      byProject,
    }
  }, [tasks, days])
}

export type Metrics = ReturnType<typeof useMetrics>
