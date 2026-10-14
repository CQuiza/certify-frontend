import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/cart'
import { useCheckout } from '../hooks/usePayments'
import { usePublicBranding } from '../hooks/useConfiguration'
import Card from '../components/molecules/Card'
import Button from '../components/atoms/Button'
import { ShoppingCart, Trash2, CreditCard, LogIn, ArrowRight } from 'lucide-react'
import { formatCurrency, waLink } from '../types/course'
import { config } from '../config'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../lib/error'

export default function CartPage() {
  const { user, isAuthenticated } = useAuth()
  const { items, total, remove, clear, removeMany } = useCart()
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const checkout = useCheckout()

  async function handleCheckout() {
    if (!user) {
      window.location.assign('/login')
      return
    }
    if (items.length === 0) return
    try {
      const res = await checkout.mutateAsync(items.map((i) => i.id))
      removeMany(items.map((i) => i.id)) // bloqueado en el pedido
      window.location.assign(res.init_point)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/catalog" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            ← Seguir comprando
          </Link>
          <span className="text-sm font-medium text-slate-600">Mi carrito</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {items.length === 0 ? (
          <Card className="text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-600">Tu carrito está vacío</p>
            <Link to="/catalog" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Explorar catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <Card key={it.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{it.title}</p>
                    <p className="text-sm text-slate-500">{formatCurrency(it.price)}</p>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Quitar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Total</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
              </div>
              {!isAuthenticated && (
                <p className="mb-3 text-xs text-amber-700">
                  Necesitas una cuenta de estudiante para pagar. <Link to="/login" className="underline">Inicia sesión</Link> o{' '}
                  <Link to="/register" className="underline">crea una cuenta</Link>.
                </p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={handleCheckout} loading={checkout.isPending} className="flex-1">
                  {isAuthenticated ? (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pagar con Mercado Pago
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Iniciar sesión para pagar
                    </>
                  )}
                </Button>
                <Button variant="secondary" onClick={clear}>
                  Vaciar carrito
                </Button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                ¿Dudas? <a className="text-green-600 hover:underline" href={waLink(contactPhone, 'Hola, tengo dudas sobre el pago de cursos.')} target="_blank" rel="noopener noreferrer">Habla con un asesor por WhatsApp</a>
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}