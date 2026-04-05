import type { Priority, Severity, TestCaseKind } from '../../engine/types'

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  normal: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

const SEVERITY_COLORS: Record<Severity, string> = {
  trivial: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  minor: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  major: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  critical: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  blocker: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

const KIND_COLORS: Record<TestCaseKind, string> = {
  positive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  negative: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  bva: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'state-transition': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  critical: 'Crítica',
}

const SEVERITY_LABELS: Record<Severity, string> = {
  trivial: 'Trivial',
  minor: 'Minor',
  major: 'Major',
  critical: 'Critical',
  blocker: 'Blocker',
}

const KIND_LABELS: Record<TestCaseKind, string> = {
  positive: 'Positivo',
  negative: 'Negativo',
  bva: 'BVA',
  'state-transition': 'Estado',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${SEVERITY_COLORS[severity]}`}>
      {SEVERITY_LABELS[severity]}
    </span>
  )
}

export function KindBadge({ kind }: { kind: TestCaseKind }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${KIND_COLORS[kind]}`}>
      {kind === 'positive' ? '✓' : kind === 'negative' ? '✗' : kind === 'bva' ? '↔' : '⇄'} {KIND_LABELS[kind]}
    </span>
  )
}
