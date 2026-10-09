import api from './api'
import type { TenantCreate, TenantRead, TenantStatusUpdate } from '../types/tenant'

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
}