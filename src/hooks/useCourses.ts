import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseService } from '../services/courseService'
import type { CourseCreate, CourseUpdate } from '../types'

const QUERY_KEY = ['courses']

export function useCourses(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => courseService.list(params),
    ...options,
  })
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CourseCreate) => courseService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCourse(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CourseUpdate) => courseService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => courseService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
