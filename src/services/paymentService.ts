import api from './api'
import type { CheckoutResponse, OrderRead } from '../types/payment'

export const paymentService = {
  checkout: async (courseIds: number[]): Promise<CheckoutResponse> => {
    const { data } = await api.post<CheckoutResponse>('/payments/checkout', { course_ids: courseIds })
    return data
  },

  getOrder: async (orderId: number): Promise<OrderRead> => {
    const { data } = await api.get<OrderRead>(`/payments/orders/${orderId}`)
    return data
  },

  renewCheckout: async (certificateId: number): Promise<CheckoutResponse> => {
    const { data } = await api.post<CheckoutResponse>(`/payments/renew/${certificateId}`)
    return data
  },
}