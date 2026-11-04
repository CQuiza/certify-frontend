import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import Modal from '../molecules/Modal'
import Input from '../atoms/Input'
import Button from '../atoms/Button'
import TenantBillingBadge from '../molecules/TenantBillingBadge'
import {
  useCreateTenantPayment,
  useDeleteTenantPayment,
  useTenantPayments,
} from '../../hooks/useTenants'
import {
  addDaysISO,
  formatMoney,
  periodEndFor,
  PLAN_LABELS,
  todayISO,
} from '../../lib/billing'
import { formatDate } from '../../lib/dates'
import type { TenantPlan, TenantRead } from '../../types/tenant'

interface TenantPaymentsModalProps {
  tenant: TenantRead | null
  open: boolean
  onClose: () => void
}

interface PaymentForm {
  plan: TenantPlan
  amount: string
  periodStart: string
  paidAt: string
  reference: string
  notes: string
}

function initialForm(tenant: TenantRead): PaymentForm {
  const start = tenant.billing?.paid_until
    ? addDaysISO(tenant.billing.paid_until, 1)
    : todayISO()
  return {
    plan: 'mensual',
    amount: '',
    periodStart: start,
    paidAt: todayISO(),
    reference: '',
    notes: '',
  }
}

const selectClass =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'

function TenantPaymentsPanel({ tenant }: { tenant: TenantRead }) {
  const { data: payments, isLoading } = useTenantPayments(tenant.id)
  const createPayment = useCreateTenantPayment(tenant.id)
  const deletePayment = useDeleteTenantPayment(tenant.id)

  const [form, setForm] = useState<PaymentForm>(() => initialForm(tenant))

  const previewEnd = periodEndFor(form.plan, form.periodStart)
  const total =
    payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) ?? 0

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }
    try {
      await createPayment.mutateAsync({
        plan: form.plan,
        amount,
        period_start: form.periodStart,
        paid_at: form.paidAt,
        reference: form.reference.trim() || null,
        notes: form.notes.trim() || null,
      })
      toast.success('Pago registrado')
      setForm({
        ...form,
        amount: '',
        reference: '',
        notes: '',
        periodStart: addDaysISO(previewEnd, 1),
        paidAt: todayISO(),
      })
    } catch {
      toast.error('No se pudo registrar el pago')
    }
  }

  async function handleDelete(paymentId: number) {
    if (!window.confirm('¿Eliminar este pago? La acción queda auditada.')) return
    try {
      await deletePayment.mutateAsync(paymentId)
      toast.success('Pago eliminado')
    } catch {
      toast.error('No se pudo eliminar el pago')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <TenantBillingBadge billing={tenant.billing} />
        <span className="text-sm text-slate-600">
          {tenant.billing?.plan ? `Plan ${tenant.billing.plan}` : 'Sin plan registrado'}
        </span>
        <span className="text-sm text-slate-500">
          {tenant.billing?.paid_until
            ? `Cubierto hasta ${formatDate(tenant.billing.paid_until)}`
            : 'Sin cobertura registrada'}
        </span>
        <span className="ml-auto text-sm font-medium text-slate-700">
          Total cobrado: {formatMoney(total)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Plan</label>
            <select
              className={selectClass}
              value={form.plan}
              onChange={(e) =>
                setForm({ ...form, plan: e.target.value as TenantPlan })
              }
            >
              {(Object.keys(PLAN_LABELS) as TenantPlan[]).map((plan) => (
                <option key={plan} value={plan}>
                  {PLAN_LABELS[plan]}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Monto (COP)"
            type="number"
            min={1}
            step={1}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Inicio de cobertura"
            type="date"
            value={form.periodStart}
            onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
            required
          />
          <Input
            label="Fecha de pago"
            type="date"
            value={form.paidAt}
            onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
            required
          />
          <Input
            label="Referencia (opcional)"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="Nro. factura o transferencia"
          />
          <Input
            label="Notas (opcional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Cubrirá del {formatDate(form.periodStart)} al {formatDate(previewEnd)}{' '}
          (inclusive).
        </p>

        <div className="flex justify-end">
          <Button type="submit" loading={createPayment.isPending}>
            Registrar pago
          </Button>
        </div>
      </form>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Historial</h3>
        {isLoading ? (
          <p className="text-sm text-slate-500">Cargando pagos…</p>
        ) : !payments || payments.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay pagos registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Pago</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Período</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Plan</th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase text-slate-500">Monto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Referencia</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-2 text-slate-700">{formatDate(payment.paid_at)}</td>
                    <td className="px-4 py-2 text-slate-600">
                      {formatDate(payment.period_start)} — {formatDate(payment.period_end)}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{PLAN_LABELS[payment.plan]}</td>
                    <td className="px-4 py-2 text-right font-medium text-slate-800">
                      {formatMoney(payment.amount)}
                    </td>
                    <td className="px-4 py-2 text-slate-500">{payment.reference || '—'}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(payment.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Eliminar pago"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TenantPaymentsModal({
  tenant,
  open,
  onClose,
}: TenantPaymentsModalProps) {
  if (!tenant) return null

  return (
    <Modal open={open} onClose={onClose} title={`Pagos · ${tenant.name}`} size="xl">
      <TenantPaymentsPanel key={tenant.id} tenant={tenant} />
    </Modal>
  )
}
