import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configurationService } from '../services/configurationService'
import type {
  EmailSettings,
  EmailSettingsUpdate,
  EmailTemplate,
  EmailTemplateKind,
  EmailTemplateUpdate,
  OrganizationUpdate,
  PaymentsSettings,
  PaymentsSettingsUpdate,
} from '../types/configuration'

const QUERY_KEY = ['configuration', 'certificate-template']

export function useCertificateTemplateInfo() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => configurationService.getTemplateInfo(),
  })
}

export function useUploadCertificateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => configurationService.uploadTemplate(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useRestoreCertificateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => configurationService.restoreTemplate(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

// ── Marca / organización ────────────────────────────────────────────────────

const BRANDING_KEY = ['configuration', 'branding']

export function useBranding(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: BRANDING_KEY,
    queryFn: () => configurationService.getBranding(),
    ...options,
  })
}

const PUBLIC_BRANDING_KEY = ['configuration', 'public-branding']

export function usePublicBranding() {
  return useQuery({
    queryKey: PUBLIC_BRANDING_KEY,
    queryFn: () => configurationService.getPublicBranding(),
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: OrganizationUpdate) => configurationService.updateOrganization(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANDING_KEY }),
  })
}

export function useUploadBrandingLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => configurationService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDING_KEY })
      queryClient.invalidateQueries({ queryKey: PUBLIC_BRANDING_KEY })
    },
  })
}

export function useRestoreBrandingLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => configurationService.restoreLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDING_KEY })
      queryClient.invalidateQueries({ queryKey: PUBLIC_BRANDING_KEY })
    },
  })
}

export function useUploadDarkLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => configurationService.uploadDarkLogo(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANDING_KEY }),
  })
}

export function useRestoreDarkLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => configurationService.restoreDarkLogo(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANDING_KEY }),
  })
}

// ── Correo / SMTP ───────────────────────────────────────────────────────────

const EMAIL_KEY = ['configuration', 'email']
const TEMPLATES_KEY = ['configuration', 'email', 'templates']

export function useEmailSettings() {
  return useQuery({
    queryKey: EMAIL_KEY,
    queryFn: () => configurationService.getEmailSettings(),
  })
}

export function useUpdateEmailSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: EmailSettingsUpdate) => configurationService.updateEmailSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMAIL_KEY }),
  })
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: (emailTo: string) => configurationService.sendTestEmail(emailTo),
  })
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: TEMPLATES_KEY,
    queryFn: () => configurationService.getEmailTemplates(),
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation<EmailTemplate, Error, { kind: EmailTemplateKind; payload: EmailTemplateUpdate }>({
    mutationFn: ({ kind, payload }) => configurationService.updateEmailTemplate(kind, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_KEY })
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY })
    },
  })
}

export function useRestoreEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (kind: EmailTemplateKind) => configurationService.restoreEmailTemplate(kind),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_KEY })
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY })
    },
  })
}

// ── Pagos / Mercado Pago ────────────────────────────────────────────────────

const PAYMENTS_KEY = ['configuration', 'payments']

export function usePaymentsSettings() {
  return useQuery({
    queryKey: PAYMENTS_KEY,
    queryFn: () => configurationService.getPaymentsSettings(),
  })
}

export function useUpdatePaymentsSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PaymentsSettingsUpdate) => configurationService.updatePaymentsSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY }),
  })
}

export type { EmailSettings, PaymentsSettings }