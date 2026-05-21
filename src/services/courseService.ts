import api from './api'
import type { Course, CourseCreate, CourseUpdate } from '../types'

export const courseService = {
  list: async (params?: Record<string, unknown>): Promise<Course[]> => {
    const { data } = await api.get<Course[]>('/courses', { params })
    return data
  },

  getById: async (id: number): Promise<Course> => {
    const { data } = await api.get<Course>(`/courses/${id}`)
    return data
  },

  create: async (payload: CourseCreate): Promise<Course> => {
    const { data } = await api.post<Course>('/courses', payload)
    return data
  },

  update: async (id: number, payload: CourseUpdate): Promise<Course> => {
    const { data } = await api.patch<Course>(`/courses/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`)
  },
}
