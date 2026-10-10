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
  admin_password?: string | null
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