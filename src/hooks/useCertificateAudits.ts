import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { certificateAuditService } from '../services/certificateAuditService'
import type { CertificateAuditCreate, CertificateAuditUpdate } from '../types'

const QUERY_KEY = ['certificate-audit']

export function useCertificateAudits(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => certificateAuditService.list(params),
  })
}

export function useCertificateAudit(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => certificateAuditService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCertificateAudit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateAuditCreate) => certificateAuditService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCertificateAudit(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateAuditUpdate) => certificateAuditService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCertificateAudit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateAuditService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
