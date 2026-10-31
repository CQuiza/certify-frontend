const BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost'

/**
 * Devuelve una URL segura para usar en href/src.
 * Solo acepta http/https absolutas o rutas relativas al mismo origen.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith('//')) return ''

  try {
    const parsed = new URL(trimmed, BASE_URL)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return ''
    return parsed.href
  } catch {
    return ''
  }
}

/** Valida que un enlace sea de Google Drive. */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      ['drive.google.com', 'docs.google.com'].includes(parsed.hostname) &&
      /^\/(?:file|document)\/d\/[A-Za-z0-9_-]+/.test(parsed.pathname)
    )
  } catch {
    return false
  }
}
