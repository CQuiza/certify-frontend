export interface TenantRead {
  id: number
  name: string
  slug: string
  domain: string | null
  is_active: boolean
  created_at: string | null
  total_users: number
  total_courses: number
  total_certificates: number
  billing: TenantBilling | null
  admin_password?: string | null
}

export type TenantPlan = 'mensual' | 'semestral' | 'anual'

export type TenantBillingStatus =
  | 'al_dia'
  | 'por_vencer'
  | 'pendiente'
  | 'sin_registro'
  | 'interno'

export interface TenantBilling {
  status: TenantBillingStatus
  paid_until: string | null
  plan: string | null
  last_amount: number | null
}

export interface TenantPayment {
  id: number
  tenant_id: number
  plan: TenantPlan
  amount: number
  currency: string
  period_start: string
  period_end: string
  paid_at: string
  reference: string | null
  notes: string | null
  created_at: string
}

export interface TenantPaymentCreate {
  plan: TenantPlan
  amount: number
  currency?: string
  period_start: string
  paid_at: string
  reference?: string | null
  notes?: string | null
}

export interface TenantCreate {
  name: string
  slug: string
  admin_email: string
  admin_name?: string | null
  admin_password?: string | null
}

export interface TenantStatusUpdate {
  is_active: boolean
}

export interface ActingTenant {
  tenant_id: number | null
  slug: string | null
}

export interface ImpersonateResult {
  detail: string
  tenant_id: number
  slug: string
}