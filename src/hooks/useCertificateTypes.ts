import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { certificateTypeService } from '../services/certificateTypeService'
import type { CertificateTypeCreate, CertificateTypeUpdate } from '../types'

const QUERY_KEY = ['certificate-types']

export function useCertificateTypes(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => certificateTypeService.list(params),
    ...options,
  })
}

export function useCertificateType(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => certificateTypeService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCertificateType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateTypeCreate) => certificateTypeService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCertificateType(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificateTypeUpdate) => certificateTypeService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCertificateType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateTypeService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
