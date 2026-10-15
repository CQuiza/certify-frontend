import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { usePublicBranding } from '../../hooks/useConfiguration'
import { useCart } from '../../context/cart'

export default function PublicHeader() {
  const { data: pub } = usePublicBranding()
  const brand = pub?.organization_name || 'Acreditapp'
  const { items } = useCart()
  const count = items.length

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label={brand}>
          <img src="/certify_logo.png" alt={brand} className="h-9 w-auto sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/catalog" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Catálogo
          </Link>
          <Link to="/search" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Verificar certificado
          </Link>
          <Link to="/faq" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Preguntas frecuentes
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Probar Acreditapp
          </Link>
        </div>
      </div>
    </header>
  )
}

