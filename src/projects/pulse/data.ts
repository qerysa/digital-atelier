export const STATUSES = ['To do', 'In progress', 'In review', 'Blocked', 'Done'] as const
export type Status = (typeof STATUSES)[number]
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export const statusColor: Record<Status, string> = {
  'To do': '#959AAB',
  'In progress': '#F5B544',
  'In review': '#8B8BFF',
  Blocked: '#FF7A6B',
  Done: '#3DD6A5',
}
export const priorityRank: Record<Priority, number> = { Low: 0, Medium: 1, High: 2, Urgent: 3 }

export interface Member {
  id: string
  name: string
  role: string
  color: string
}
export interface Project {
  id: string
  name: string
  area: string
  color: string
  /** due date as day offset from today */
  due: number
  lead: string
}
export interface Task {
  id: string
  title: string
  project: string
  assignee: string
  status: Status
  priority: Priority
  /** due date as day offset from today (negative = past) */
  due: number
  /** day offset the task was completed on (only when Done) */
  doneOn?: number
  /** day offset the task was created on */
  createdOn: number
}

/** Demo workspace — every person, project and number below is fictional sample data. */
export const members: Member[] = [
  { id: 'ava', name: 'Ava Chen', role: 'Product designer', color: '#8B8BFF' },
  { id: 'leo', name: 'Leo Martins', role: 'Frontend engineer', color: '#3DD6A5' },
  { id: 'maya', name: 'Maya Brooks', role: 'Product manager', color: '#F5B544' },
  { id: 'noah', name: 'Noah Patel', role: 'Backend engineer', color: '#FF7A6B' },
  { id: 'iris', name: 'Iris Novak', role: 'QA engineer', color: '#5CC8FF' },
  { id: 'sam', name: 'Sam Rivera', role: 'Brand designer', color: '#E58BFF' },
]

export const projects: Project[] = [
  { id: 'onb', name: 'Onboarding 2.0', area: 'Growth', color: '#8B8BFF', due: 12, lead: 'maya' },
  { id: 'bill', name: 'Billing revamp', area: 'Platform', color: '#F5B544', due: 26, lead: 'noah' },
  { id: 'mob', name: 'Mobile web', area: 'Product', color: '#3DD6A5', due: 40, lead: 'leo' },
  { id: 'ds', name: 'Design system', area: 'Design', color: '#E58BFF', due: 18, lead: 'ava' },
  { id: 'ana', name: 'Analytics export', area: 'Data', color: '#5CC8FF', due: -2, lead: 'iris' },
  { id: 'brand', name: 'Brand refresh', area: 'Marketing', color: '#FF7A6B', due: 55, lead: 'sam' },
]

const t = (id: number, title: string, project: string, assignee: string, status: Status, priority: Priority, due: number, createdOn: number, doneOn?: number): Task => ({
  id: `TSK-${1000 + id}`,
  title,
  project,
  assignee,
  status,
  priority,
  due,
  createdOn,
  doneOn: status === 'Done' ? (doneOn ?? Math.min(0, due)) : undefined,
})

export const initialTasks: Task[] = [
  t(42, 'Onboarding flow — final review', 'onb', 'ava', 'In review', 'High', 2, -18),
  t(41, 'Welcome email sequence copy', 'onb', 'maya', 'In progress', 'Medium', 5, -12),
  t(40, 'Progress checklist component', 'onb', 'leo', 'Done', 'High', -3, -20, -4),
  t(39, 'Billing page empty states', 'bill', 'ava', 'In progress', 'Medium', 6, -9),
  t(38, 'Proration logic for plan changes', 'bill', 'noah', 'Blocked', 'Urgent', 1, -14),
  t(37, 'Invoice PDF template', 'bill', 'sam', 'To do', 'Low', 15, -6),
  t(36, 'Payment method settings UI', 'bill', 'leo', 'In review', 'High', 3, -11),
  t(35, 'Export analytics as CSV', 'ana', 'noah', 'Done', 'Medium', -6, -25, -7),
  t(34, 'Scheduled report emails', 'ana', 'iris', 'In progress', 'High', -1, -15),
  t(33, 'Date-range picker accessibility', 'ana', 'iris', 'Done', 'Medium', -9, -22, -10),
  t(32, 'Mobile navigation drawer', 'mob', 'leo', 'In progress', 'High', 8, -10),
  t(31, 'Team permissions matrix', 'mob', 'maya', 'Blocked', 'High', 4, -16),
  t(30, 'Touch targets audit', 'mob', 'iris', 'To do', 'Medium', 12, -5),
  t(29, 'Offline state illustrations', 'mob', 'sam', 'To do', 'Low', 20, -3),
  t(28, 'Button & input tokens', 'ds', 'ava', 'Done', 'High', -12, -30, -13),
  t(27, 'Data table component', 'ds', 'leo', 'In review', 'Medium', 1, -13),
  t(26, 'Dark theme contrast pass', 'ds', 'ava', 'In progress', 'Urgent', 0, -8),
  t(25, 'Icon set cleanup', 'ds', 'sam', 'Done', 'Low', -15, -28, -16),
  t(24, 'Chart colour palette', 'ds', 'ava', 'To do', 'Medium', 9, -4),
  t(23, 'Logo usage guidelines', 'brand', 'sam', 'In progress', 'Medium', 14, -7),
  t(22, 'Website hero animation', 'brand', 'sam', 'To do', 'High', 25, -2),
  t(21, 'Rate-limit dashboard API', 'ana', 'noah', 'Done', 'Urgent', -4, -19, -5),
  t(20, 'Session replay privacy review', 'onb', 'iris', 'To do', 'High', 7, -6),
  t(19, 'Checkout success screen', 'bill', 'ava', 'Done', 'Medium', -2, -17, -2),
  t(18, 'Webhook retry queue', 'bill', 'noah', 'In progress', 'High', 10, -9),
  t(17, 'Signup A/B test setup', 'onb', 'maya', 'Done', 'Medium', -8, -21, -9),
  t(16, 'Performance budget for mobile', 'mob', 'leo', 'To do', 'Medium', 16, -1),
  t(15, 'Release notes template', 'brand', 'maya', 'Done', 'Low', -1, -10, -1),
]

/** Deterministic pseudo-random generator so the demo history is identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Background history (tasks from earlier, archived sprints) for the last 90 days: [created, completed] per day. */
export const history: { created: number; completed: number }[] = (() => {
  const rnd = mulberry32(7)
  return Array.from({ length: 90 }, (_, i) => {
    const weekday = (i + 3) % 7
    const weekend = weekday >= 5
    const trend = 1 + i / 160
    const base = weekend ? 0.6 : 3.2 * trend
    return { created: Math.round(base * (0.7 + rnd() * 0.8)), completed: Math.round(base * (0.6 + rnd() * 0.9)) }
  })
})()

export const RANGES = [
  { id: '7d', label: '7D', days: 7 },
  { id: '30d', label: '30D', days: 30 },
  { id: '90d', label: '90D', days: 90 },
] as const
export type RangeId = (typeof RANGES)[number]['id']

export const today = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

export function dayToDate(offset: number) {
  const d = new Date(today)
  d.setDate(d.getDate() + offset)
  return d
}
export const fmtDay = (offset: number, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) => dayToDate(offset).toLocaleDateString('en-US', opts)

export function relDue(offset: number) {
  if (offset === 0) return 'Today'
  if (offset === 1) return 'Tomorrow'
  if (offset === -1) return 'Yesterday'
  if (offset < 0) return `${-offset}d overdue`
  if (offset < 7) return `In ${offset}d`
  return fmtDay(offset)
}

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
