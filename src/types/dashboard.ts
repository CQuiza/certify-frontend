export interface DashboardStats {
  total_users: number
  total_certificates: number
  active_certificates: number
  expired_certificates: number
  revoked_certificates: number
  published_courses: number
  certificate_types: number
}

export interface AdminRead {
  id: number
  name: string
  first_last_name: string | null
  second_last_name: string | null
  email: string
  identity_type: string
  identity_number: string
  phone_number: string
  role: string
}
