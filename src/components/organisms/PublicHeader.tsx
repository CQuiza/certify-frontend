import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react'
import { config } from '../../config'
import { usePublicBranding } from '../../hooks/useConfiguration'
import { configurationService } from '../../services/configurationService'
import { useCart } from '../../context/cart'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, panelPathFor } from '../../lib/roles'
import { isRootDomain } from '../../lib/domain'
import PricingLink from '../atoms/PricingLink'

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/search', label: 'Verificar certificado' },
  { to: '/faq', label: 'Preguntas frecuentes' },
]

interface PublicHeaderProps {
  useTenantLogo?: boolean
}

export default function PublicHeader({ useTenantLogo = false }: PublicHeaderProps) {
  const { data: pub } = usePublicBranding()
  const { pathname } = useLocation()
  const brand = pub?.organization_name || config.appName
  const { items } = useCart()
  const count = items.length
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const displayName = user?.name?.trim() || 'Usuario'
  const initial = displayName.charAt(0).toUpperCase()
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : ''
  const panelPath = panelPathFor(user?.role)
  const navItems = isRootDomain()
    ? [...NAV, { to: '/pricing', label: 'Planes' }]
    : NAV

  const logoSrc =
    useTenantLogo && pub?.has_custom_logo
      ? configurationService.getPublicLogoUrl()
      : '/app_logo.png'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label={brand} onClick={() => setOpen(false)}>
          <img src={logoSrc} alt={brand} className="h-10 w-auto max-w-full object-contain sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((n) => {
            const active = pathname === n.to
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-100 text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to={panelPath}
                className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-slate-100"
                aria-label="Ir a mi panel"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {initial}
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block max-w-[140px] truncate text-sm font-medium text-slate-900">{displayName}</span>
                  <span className="block text-[11px] text-slate-500">{roleLabel}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex"
              >
                Iniciar sesión
              </Link>
              <PricingLink className="hidden rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 md:inline-flex">
                Probar {config.appName}
              </PricingLink>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === n.to ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={panelPath}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-medium text-white">
                      {initial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{displayName}</span>
                      <span className="block truncate text-xs text-slate-500">{roleLabel}</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Iniciar sesión
                  </Link>
                  <PricingLink
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Probar {config.appName}
                  </PricingLink>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
