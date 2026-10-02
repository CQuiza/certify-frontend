import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { certificateService } from '../services/certificateService'
import type { CertificateBatchIssueRequest, CertificateIssueRequest, CertificateRenewRequest, CertificateUpdate, PendingCertificateCreate } from '../types'

const QUERY_KEY = ['certificates']

export function useCertificates(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => certificateService.list(params),
    ...options,
  })
}

export function useCertificate(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => certificateService.getById(id),
    enabled: id > 0,
  })
}

export function useIssueCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateIssueRequest) => certificateService.issue(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCertificate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateUpdate) => certificateService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useRenewCertificate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateRenewRequest) => certificateService.renew(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useBatchIssueCertificates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateBatchIssueRequest) => certificateService.issueBatch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useCertificateByUuid(uuid: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'uuid', uuid],
    queryFn: () => certificateService.viewByUuid(uuid),
    enabled: !!uuid,
  })
}

export function usePendingCertificates(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['pending-certificates', params],
    queryFn: () => certificateService.listPending(params),
    ...options,
  })
}

export function useCreatePendingCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PendingCertificateCreate) => certificateService.createPending(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-certificates'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeletePendingCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateService.deletePending(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-certificates'] }),
  })
}

export function useForceIssuePendingCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateService.forceIssuePending(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-certificates'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
