import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configurationService } from '../services/configurationService'

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