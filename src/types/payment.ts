export interface CheckoutResponse {
  order_id: number
  init_point: string
}

export interface OrderItemRead {
  course_id: number
  course_title: string
  unit_price: string
}

export interface OrderRead {
  id: number
  order_no: string
  total: string
  currency: string
  status: 'pending' | 'approved' | 'failed' | 'cancelled' | string
  created_at: string | null
  paid_at: string | null
  items: OrderItemRead[]
}