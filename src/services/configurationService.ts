import api from './api'
import { config } from '../config'
import type {
  Branding,
  EmailSettings,
  EmailSettingsUpdate,
  EmailTemplate,
  EmailTemplateKind,
  EmailTemplateUpdate,
  EmailTemplatesList,
  OrganizationUpdate,
} from '../types/configuration'

export interface CertificateTemplateInfo {
  is_custom: boolean
  filename: string | null
  size_bytes: number | null
  updated_at: string | null
}

export const configurationService = {
  // ── Plantilla de certificado (existente) ──────────────────
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

  // ── Marca / organización ──────────────────────────────────
  getBranding: async (): Promise<Branding> => {
    const { data } = await api.get<Branding>('/configuration/branding')
    return data
  },

  getLogoUrl: (): string => `${config.apiUrl}/configuration/branding/logo`,

  updateOrganization: async (payload: OrganizationUpdate): Promise<Branding> => {
    const { data } = await api.put<Branding>('/configuration/organization', payload)
    return data
  },

  // ── Correo saliente (SMTP) ────────────────────────────────
  getEmailSettings: async (): Promise<EmailSettings> => {
    const { data } = await api.get<EmailSettings>('/configuration/email')
    return data
  },

  updateEmailSettings: async (payload: EmailSettingsUpdate): Promise<EmailSettings> => {
    const { data } = await api.put<EmailSettings>('/configuration/email', payload)
    return data
  },

  sendTestEmail: async (emailTo: string): Promise<{ detail: string }> => {
    const { data } = await api.post<{ detail: string }>('/configuration/email/test', {
      email_to: emailTo,
    })
    return data
  },

  getEmailTemplates: async (): Promise<EmailTemplatesList> => {
    const { data } = await api.get<EmailTemplatesList>('/configuration/email/templates')
    return data
  },

  getEmailTemplate: async (kind: EmailTemplateKind): Promise<EmailTemplate> => {
    const { data } = await api.get<EmailTemplate>(`/configuration/email/templates/${kind}`)
    return data
  },

  updateEmailTemplate: async (
    kind: EmailTemplateKind,
    payload: EmailTemplateUpdate,
  ): Promise<EmailTemplate> => {
    const { data } = await api.put<EmailTemplate>(`/configuration/email/templates/${kind}`, payload)
    return data
  },

  restoreEmailTemplate: async (kind: EmailTemplateKind): Promise<EmailTemplate> => {
    const { data } = await api.delete<EmailTemplate>(`/configuration/email/templates/${kind}`)
    return data
  },

  // ── Logo ──────────────────────────────────────────────────
  uploadLogo: async (file: File): Promise<{ detail: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<{ detail: string }>('/configuration/email/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  restoreLogo: async (): Promise<{ detail: string }> => {
    const { data } = await api.delete<{ detail: string }>('/configuration/email/logo')
    return data
  },
}