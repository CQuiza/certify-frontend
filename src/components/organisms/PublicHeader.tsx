import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { config } from '../../config'
import { usePublicBranding } from '../../hooks/useConfiguration'
import { configurationService } from '../../services/configurationService'
import { useCart } from '../../context/cart'

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
  const [open, setOpen] = useState(false)

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
          {NAV.map((n) => {
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

          <Link
            to="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="hidden rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 md:inline-flex"
          >
            Probar {config.appName}
          </Link>

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
            {NAV.map((n) => (
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
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Probar {config.appName}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
