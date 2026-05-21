import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentService } from '../services/enrollmentService'
import type { CourseEnrollmentCreate } from '../types'

const QUERY_KEY = ['enrollments']

export function useEnrollments(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => enrollmentService.list(params),
    ...options,
  })
}

export function useEnrollment(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => enrollmentService.getById(id),
    enabled: !!id,
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CourseEnrollmentCreate) => enrollmentService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => enrollmentService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
