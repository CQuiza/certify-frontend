import { useAuth } from '../context/AuthContext'
import { useOrder } from '../hooks/usePayments'
import Card from '../components/molecules/Card'
import Button from '../components/atoms/Button'
import Skeleton from '../components/atoms/Skeleton'
import { ShoppingCart, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'

export default function PaymentResultPage() {
  const orderId = Number(window.location.pathname.split('/').pop())
  const { isAuthenticated } = useAuth()
  const { data: order, isLoading } = useOrder(orderId, { enabled: orderId > 0 && !!isAuthenticated, refetchInterval: 5000 })

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md text-center">
          <p className="text-slate-600">Inicia sesión para consultar tu pedido.</p>
          <Button className="mt-4" onClick={() => window.location.assign('/login')}>Ir al login</Button>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Skeleton count={3} className="h-10 w-80" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md text-center">
          <p className="text-slate-600">Pedido no encontrado.</p>
        </Card>
      </div>
    )
  }

  const approved = order.status === 'approved'
  const pending = order.status === 'pending'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          {approved ? (
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          ) : pending ? (
            <Clock className="h-8 w-8 text-amber-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {approved ? 'Pago aprobado' : pending ? 'Pago pendiente' : 'Pago no completado'}
            </h1>
            <p className="text-sm text-slate-500">Pedido {order.order_no}</p>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          {approved
            ? 'Tu compra fue confirmada. Ya tienes acceso a los cursos y tu certificado quedó en proceso (se emitirá al completar el 100%).'
            : pending
              ? 'Estamos confirmando el pago. Esta página se actualiza sola; también puedes volver más tarde.'
              : 'El pago no se completó. Puedes intentarlo de nuevo desde el carrito.'}
        </p>

        <ul className="mb-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
          {order.items.map((it) => (
            <li key={it.course_id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-800">{it.course_title}</span>
              <span className="text-slate-500">{it.unit_price}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total ({order.currency})</span>
          <span className="font-semibold text-slate-900">{order.total}</span>
        </div>

        {approved && (
          <Button className="mt-6 w-full" onClick={() => (window.location.assign('/courses'))}>
            <ArrowRight className="h-4 w-4" />
            Ver mis cursos
          </Button>
        )}
        {!approved && !pending && (
          <Button className="mt-6 w-full" variant="secondary" onClick={() => (window.location.assign('/cart'))}>
            <ShoppingCart className="h-4 w-4" />
            Volver al carrito
          </Button>
        )}
      </Card>
    </div>
  )
}