import { config } from '../config'

/** True en el dominio raíz (o en modo single-tenant / desarrollo local). */
export function isRootDomain(): boolean {
  if (!config.rootDomain) return true
  if (typeof window === 'undefined') return true

  const host = window.location.hostname.toLowerCase().replace(/^www\./, '')
  const root = config.rootDomain.toLowerCase().replace(/^www\./, '')
  return host === root
}

/** Dominio público para el copy de subdominios. */
export function publicDomain(): string {
  return config.rootDomain.replace(/^www\./, '') || 'formativa.com.co'
}

/**
 * Ruta del pricing. En el dominio raíz navega internamente; en un subdominio
 * apunta al pricing del dominio principal, donde está habilitada la página.
 */
export function pricingHref(): string {
  if (isRootDomain()) return '/pricing'

  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
  return `${protocol}//${config.rootDomain.replace(/^www\./, '')}/pricing`
}
