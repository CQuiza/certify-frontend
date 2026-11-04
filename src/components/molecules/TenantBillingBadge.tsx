import Badge from '../atoms/Badge'
import type { TenantBilling, TenantBillingStatus } from '../../types/tenant'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

const META: Record<TenantBillingStatus, { label: string; variant: Variant }> = {
  al_dia: { label: 'Al día', variant: 'success' },
  por_vencer: { label: 'Por vencer', variant: 'warning' },
  pendiente: { label: 'Pendiente', variant: 'danger' },
  sin_registro: { label: 'Sin registros', variant: 'default' },
  interno: { label: 'Interno', variant: 'info' },
}

export default function TenantBillingBadge({
  billing,
}: {
  billing?: TenantBilling | null
}) {
  if (!billing) return <Badge>—</Badge>
  const meta = META[billing.status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
