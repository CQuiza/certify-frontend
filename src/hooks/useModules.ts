import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleService } from '../services/moduleService'
import type { ModuleCreate, ModuleUpdate } from '../types'

const QUERY_KEY = ['modules']

export function useModules(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => moduleService.list(params),
    ...options,
  })
}

export function useModule(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => moduleService.getById(id),
    enabled: !!id,
  })
}

export function useCreateModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ModuleCreate) => moduleService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateModule(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ModuleUpdate) => moduleService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => moduleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
