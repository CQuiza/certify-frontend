import type { CourseStatus } from './enums'

export interface CourseCreate {
  title: string
  description?: string | null
  certificate_type_id?: number | null
  teacher_id?: number | null
  status?: CourseStatus
  price?: number | null
  renewal_price?: number | null
  is_for_sale?: boolean
}

export interface CourseUpdate {
  title?: string
  description?: string | null
  certificate_type_id?: number | null
  teacher_id?: number | null
  status?: CourseStatus
  price?: number | null
  renewal_price?: number | null
  is_for_sale?: boolean
}

export interface Course {
  id: number
  title: string
  description: string | null
  certificate_type_id: number | null
  teacher_id: number | null
  created_at: string
  updated_at: string
  status: CourseStatus
  price: number | null
  renewal_price: number | null
  is_for_sale: boolean
}

export interface CoursePublic {
  id: number
  title: string
  description: string | null
  status: CourseStatus
  price: number | null
  is_for_sale: boolean
}

export function formatCurrency(value: number | null | undefined): string {
  const n = Number(value ?? 0)
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
