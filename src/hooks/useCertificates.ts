import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { certificateService } from '../services/certificateService'
import type { CertificateBatchIssueRequest, CertificateIssueRequest, CertificateRenewRequest, CertificateUpdate, PendingCertificateCreate } from '../types'

const QUERY_KEY = ['certificates']

function invalidateCertificates(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  // La vista admin agrupa por estudiante (useCertifiedUsers) y el dashboard muestra conteos.
  queryClient.invalidateQueries({ queryKey: ['users'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
}

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
    onSuccess: () => invalidateCertificates(queryClient),
  })
}

export function useUpdateCertificate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateUpdate) => certificateService.update(id, data),
    onSuccess: () => invalidateCertificates(queryClient),
  })
}

export function useRenewCertificate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateRenewRequest) => certificateService.renew(id, data),
    onSuccess: () => invalidateCertificates(queryClient),
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateService.remove(id),
    onSuccess: () => invalidateCertificates(queryClient),
  })
}

export function useBatchIssueCertificates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateBatchIssueRequest) => certificateService.issueBatch(data),
    onSuccess: () => invalidateCertificates(queryClient),
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
      invalidateCertificates(queryClient)
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
      invalidateCertificates(queryClient)
    },
  })
}
