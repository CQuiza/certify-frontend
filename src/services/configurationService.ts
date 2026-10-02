import api from './api'
import { config } from '../config'

export interface CertificateTemplateInfo {
  is_custom: boolean
  filename: string | null
  size_bytes: number | null
  updated_at: string | null
}

export const configurationService = {
  getTemplateInfo: async (): Promise<CertificateTemplateInfo> => {
    const { data } = await api.get<CertificateTemplateInfo>('/configuration/certificate-template')
    return data
  },

  getPreviewUrl: (): string => `${config.apiUrl}/configuration/certificate-template/preview`,

  uploadTemplate: async (file: File): Promise<{ detail: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<{ detail: string }>('/configuration/certificate-template', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  restoreTemplate: async (): Promise<{ detail: string }> => {
    const { data } = await api.delete<{ detail: string }>('/configuration/certificate-template')
    return data
  },
}