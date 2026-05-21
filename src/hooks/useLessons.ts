import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonService } from '../services/lessonService'
import type { LessonCreate, LessonUpdate } from '../types'

const QUERY_KEY = ['lessons']

export function useLessons(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => lessonService.list(params),
    ...options,
  })
}

export function useLesson(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => lessonService.getById(id),
    enabled: !!id,
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LessonCreate) => lessonService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateLesson(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LessonUpdate) => lessonService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => lessonService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
