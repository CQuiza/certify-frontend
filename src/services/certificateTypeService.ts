import api from './api'
import type { CertificateType, CertificateTypeCreate, CertificateTypeUpdate } from '../types'

export const certificateTypeService = {
  list: async (params?: Record<string, unknown>): Promise<CertificateType[]> => {
    const { data } = await api.get<CertificateType[]>('/certificate-types', { params })
    return data
  },

  getById: async (id: number): Promise<CertificateType> => {
    const { data } = await api.get<CertificateType>(`/certificate-types/${id}`)
    return data
  },

  create: async (payload: CertificateTypeCreate): Promise<CertificateType> => {
    const { data } = await api.post<CertificateType>('/certificate-types', payload)
    return data
  },

  update: async (id: number, payload: CertificateTypeUpdate): Promise<CertificateType> => {
    const { data } = await api.patch<CertificateType>(`/certificate-types/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/certificate-types/${id}`)
  },
}
