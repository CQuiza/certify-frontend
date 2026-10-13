import { useState } from 'react'
import { toast } from 'sonner'
import { usePaymentsSettings, useUpdatePaymentsSettings } from '../../../hooks/useConfiguration'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Skeleton from '../../atoms/Skeleton'
import ErrorState from '../../atoms/ErrorState'
import { CreditCard, Info } from 'lucide-react'
import { getErrorMessage } from '../../../lib/error'
import type { PaymentsSettings } from '../../../types/configuration'

export default function PaymentsConfiguration() {
  const { data, isLoading, isError } = usePaymentsSettings()

  if (isLoading) {
    return (
      <Card>
        <Skeleton count={3} className="h-16 w-full" />
      </Card>
    )
  }

  if (isError || !data) {
    return <ErrorState message="No se pudo cargar la configuración de ventas." />
  }

  return (
    <PaymentsForm
      key={`${data.mercadopago_enabled}|${data.mercadopago_marketplace_user_id ?? ''}`}
      initial={data}
    />
  )
}

function PaymentsForm({ initial }: { initial: PaymentsSettings }) {
  const update = useUpdatePaymentsSettings()
  const [enabled, setEnabled] = useState(initial.mercadopago_enabled)
  const [marketplaceUser, setMarketplaceUser] = useState(initial.mercadopago_marketplace_user_id ?? '')

  async function handleSave() {
    try {
      await update.mutateAsync({
        mercadopago_enabled: enabled,
        mercadopago_marketplace_user_id: marketplaceUser || null,
      })
      toast.success('Configuración de pagos guardada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Ventas — Mercado Pago</h2>
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700">Vender cursos con Mercado Pago</span>
        </label>

        <Input
          label="ID de vendedor (Marketplace User ID del tenant)"
          value={marketplaceUser}
          onChange={(e) => setMarketplaceUser(e.target.value)}
          placeholder="Ej. 123456789"
        />

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>
              Comisión de la plataforma: <strong>{initial.commission_percent}%</strong> +{' '}
              <strong>{initial.commission_fixed}</strong> {initial.currency} por venta
              (split automático de Mercado Pago; se retiene en cada pago del tenant).
            </span>
          </p>
        </div>
        <p className="text-xs text-slate-500">
          <strong>Modo split (SaaS):</strong> con ID de vendedor, el dinero llega a la cuenta de MP de esta
          organización y la plataforma retiene su comisión. <strong>Modo directo (single):</strong> si dejas el ID
          vacío, todo el dinero llega a la cuenta de la plataforma (la del&nbsp;
          <code className="rounded bg-slate-100 px-1">MERCADOPAGO_ACCESS_TOKEN</code>), sin split.
        </p>

        <Button onClick={handleSave} loading={update.isPending}>
          Guardar configuración de pagos
        </Button>
      </div>
    </Card>
  )
}