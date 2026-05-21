import api from './api'
import type { CertificateAudit, CertificateAuditCreate, CertificateAuditUpdate } from '../types'

export const certificateAuditService = {
  list: async (params?: Record<string, unknown>): Promise<CertificateAudit[]> => {
    const { data } = await api.get<CertificateAudit[]>('/certificate-audit', { params })
    return data
  },

  getById: async (id: number): Promise<CertificateAudit> => {
    const { data } = await api.get<CertificateAudit>(`/certificate-audit/${id}`)
    return data
  },

  create: async (payload: CertificateAuditCreate): Promise<CertificateAudit> => {
    const { data } = await api.post<CertificateAudit>('/certificate-audit', payload)
    return data
  },

  update: async (id: number, payload: CertificateAuditUpdate): Promise<CertificateAudit> => {
    const { data } = await api.patch<CertificateAudit>(`/certificate-audit/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/certificate-audit/${id}`)
  },
}
