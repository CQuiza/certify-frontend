import type { TenantPlan } from '../types/tenant'

export const PLAN_LABELS: Record<TenantPlan, string> = {
  mensual: 'Mensual',
  semestral: 'Semestral',
  anual: 'Anual',
}

export const PLAN_MONTHS: Record<TenantPlan, number> = {
  mensual: 1,
  semestral: 6,
  anual: 12,
}

function isoOf(year: number, monthIndex: number, day: number): string {
  const month = String(monthIndex + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${month}-${dd}`
}

/** Suma meses de calendario con clamp al último día del mes destino. */
export function addMonthsISO(dateISO: string, months: number): string {
  const [year, month, day] = dateISO.split('-').map(Number)
  if (!year || !month || !day) return dateISO
  const target = new Date(Date.UTC(year, month - 1 + months, 1))
  const targetYear = target.getUTCFullYear()
  const targetMonth = target.getUTCMonth()
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate()
  return isoOf(targetYear, targetMonth, Math.min(day, lastDay))
}

export function periodEndFor(plan: TenantPlan, periodStart: string): string {
  return addMonthsISO(periodStart, PLAN_MONTHS[plan])
}

export function todayISO(): string {
  const now = new Date()
  return isoOf(now.getFullYear(), now.getMonth(), now.getDate())
}

export function addDaysISO(dateISO: string, days: number): string {
  const [year, month, day] = dateISO.split('-').map(Number)
  if (!year || !month || !day) return dateISO
  const result = new Date(Date.UTC(year, month - 1, day + days))
  return isoOf(result.getUTCFullYear(), result.getUTCMonth(), result.getUTCDate())
}

export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const amount = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}
