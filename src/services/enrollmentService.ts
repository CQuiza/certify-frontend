import api from './api'
import type { CourseEnrollment, CourseEnrollmentCreate } from '../types'

export const enrollmentService = {
  list: async (params?: Record<string, unknown>): Promise<CourseEnrollment[]> => {
    const { data } = await api.get<CourseEnrollment[]>('/course-enrollments', { params })
    return data
  },

  getById: async (id: number): Promise<CourseEnrollment> => {
    const { data } = await api.get<CourseEnrollment>(`/course-enrollments/${id}`)
    return data
  },

  create: async (payload: CourseEnrollmentCreate): Promise<CourseEnrollment> => {
    const { data } = await api.post<CourseEnrollment>('/course-enrollments', payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/course-enrollments/${id}`)
  },
}
