import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { progressService } from '../services/progressService'
import type { UserProgressCreate, UserProgressUpdate } from '../types'

const QUERY_KEY = ['progress']

export function useUserProgresses(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => progressService.list(params),
  })
}

export function useUserProgress(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => progressService.getById(id),
    enabled: !!id,
  })
}

export function useCreateProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProgressCreate) => progressService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateProgress(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProgressUpdate) => progressService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => progressService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
