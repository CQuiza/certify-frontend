export interface Branding {
  organization_name: string | null
  dashboard_message: string
  has_custom_logo: boolean
}

export interface OrganizationUpdate {
  organization_name?: string | null
  dashboard_message?: string | null
}

export interface EmailSettings {
  smtp_enabled: boolean
  smtp_host: string | null
  smtp_port: number | null
  smtp_user: string | null
  smtp_password_set: boolean
  smtp_tls: boolean
  email_from: string | null
  email_from_name: string | null
}

export interface EmailSettingsUpdate {
  smtp_enabled: boolean
  smtp_host?: string | null
  smtp_port?: number | null
  smtp_user?: string | null
  smtp_password?: string | null
  clear_smtp_password?: boolean
  smtp_tls?: boolean
  email_from?: string | null
  email_from_name?: string | null
}

export type EmailTemplateKind = 'credentials' | 'certificate_issued' | 'certificate_expired'

export interface EmailTemplate {
  kind: EmailTemplateKind
  subject: string
  body_html: string
  is_custom: boolean
}

export interface EmailTemplateUpdate {
  subject: string
  body_html: string
  is_enabled: boolean
}

export interface EmailTemplatesList {
  items: EmailTemplate[]
  placeholders: Record<string, string>
}

export const EMAIL_TEMPLATE_KINDS: EmailTemplateKind[] = [
  'credentials',
  'certificate_issued',
  'certificate_expired',
]

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKind, string> = {
  credentials: 'Credenciales de acceso',
  certificate_issued: 'Certificado emitido',
  certificate_expired: 'Certificado expirado',
}