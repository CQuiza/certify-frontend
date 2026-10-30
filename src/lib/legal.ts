export interface LegalHeading {
  id: string
  title: string
}

/** Convierte un título en un id estable para anchors. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Extrae los encabezados de segundo nivel del markdown. */
export function extractHeadings(markdown: string): LegalHeading[] {
  const seen = new Map<string, number>()
  return markdown
    .split('\n')
    .map((line) => line.match(/^##\s+(.+)$/)?.[1]?.replace(/\*\*/g, '').trim())
    .filter((title): title is string => Boolean(title))
    .map((title) => {
      const base = slugify(title)
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      return { id: count === 0 ? base : `${base}-${count + 1}`, title }
    })
}
