const UNSAFE_PATTERN = /^(javascript|data|vbscript|blob|file|ftp):/i

export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (UNSAFE_PATTERN.test(trimmed)) return ''
  return trimmed
}