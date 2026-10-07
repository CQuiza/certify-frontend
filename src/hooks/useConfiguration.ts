import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configurationService } from '../services/configurationService'
import type {
  EmailSettings,
  EmailSettingsUpdate,
  EmailTemplate,
  EmailTemplateKind,
  EmailTemplateUpdate,
  OrganizationUpdate,
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRANDING_KEY }),
  })
}

export function useRestoreBrandingLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => configurationService.restoreLogo(),
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

export type { EmailSettings }