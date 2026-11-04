import api from './api'
import type {
  ActingTenant,
  ImpersonateResult,
  TenantCreate,
  TenantPayment,
  TenantPaymentCreate,
  TenantRead,
  TenantStatusUpdate,
} from '../types/tenant'

export const tenantService = {
  list: async (): Promise<TenantRead[]> => {
    const { data } = await api.get<TenantRead[]>('/admin/tenants')
    return data
  },

  create: async (payload: TenantCreate): Promise<TenantRead> => {
    const { data } = await api.post<TenantRead>('/admin/tenants', payload)
    return data
  },

  updateStatus: async (id: number, payload: TenantStatusUpdate): Promise<TenantRead> => {
    const { data } = await api.patch<TenantRead>(`/admin/tenants/${id}`, payload)
    return data
  },

  impersonate: async (id: number): Promise<ImpersonateResult> => {
    const { data } = await api.post<ImpersonateResult>(`/admin/tenants/${id}/impersonate`)
    return data
  },

  stop: async (): Promise<{ detail: string }> => {
    const { data } = await api.post<{ detail: string }>('/admin/tenants/stop')
    return data
  },

  acting: async (): Promise<ActingTenant> => {
    const { data } = await api.get<ActingTenant>('/admin/tenants/acting')
    return data
  },

  payments: async (tenantId: number): Promise<TenantPayment[]> => {
    const { data } = await api.get<TenantPayment[]>(`/admin/tenants/${tenantId}/payments`)
    return data
  },

  createPayment: async (
    tenantId: number,
    payload: TenantPaymentCreate,
  ): Promise<TenantPayment> => {
    const { data } = await api.post<TenantPayment>(
      `/admin/tenants/${tenantId}/payments`,
      payload,
    )
    return data
  },

  updatePayment: async (
    tenantId: number,
    paymentId: number,
    payload: Partial<TenantPaymentCreate>,
  ): Promise<TenantPayment> => {
    const { data } = await api.patch<TenantPayment>(
      `/admin/tenants/${tenantId}/payments/${paymentId}`,
      payload,
    )
    return data
  },

  deletePayment: async (tenantId: number, paymentId: number): Promise<void> => {
    await api.delete(`/admin/tenants/${tenantId}/payments/${paymentId}`)
  },
}