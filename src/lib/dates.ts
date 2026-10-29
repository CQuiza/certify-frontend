export function formatDate(
  value: string | null | undefined,
  options?: { fallback?: string; withTime?: boolean }
): string {
  if (!value) return options?.fallback ?? '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value.slice(0, 10)
  if (options?.withTime) return d.toLocaleString('es-CO')
  return d.toLocaleDateString('es-CO')
}

/** Calcula la edad en años a partir de una fecha ISO `YYYY-MM-DD`. */
export function calculateAge(value: string): number | null {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const birth = new Date(year, month - 1, day)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

/** Fecha máxima permitida para que una persona tenga al menos 18 años. */
export function maxBirthDateForAdults(): string {
  const today = new Date()
  const limit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const month = String(limit.getMonth() + 1).padStart(2, '0')
  const day = String(limit.getDate()).padStart(2, '0')
  return `${limit.getFullYear()}-${month}-${day}`
}
