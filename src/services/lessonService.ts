import api from './api'
import type { Lesson, LessonCreate, LessonUpdate } from '../types'

export const lessonService = {
  list: async (params?: Record<string, unknown>): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>('/lessons', { params })
    return data
  },

  getById: async (id: number): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/lessons/${id}`)
    return data
  },

  create: async (payload: LessonCreate): Promise<Lesson> => {
    const { data } = await api.post<Lesson>('/lessons', payload)
    return data
  },

  update: async (id: number, payload: LessonUpdate): Promise<Lesson> => {
    const { data } = await api.patch<Lesson>(`/lessons/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/lessons/${id}`)
  },
}
