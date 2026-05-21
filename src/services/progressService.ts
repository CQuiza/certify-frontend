import api from './api'
import type { UserProgress, UserProgressCreate, UserProgressUpdate } from '../types'

export const progressService = {
  list: async (params?: Record<string, unknown>): Promise<UserProgress[]> => {
    const { data } = await api.get<UserProgress[]>('/user-progress', { params })
    return data
  },

  getById: async (id: number): Promise<UserProgress> => {
    const { data } = await api.get<UserProgress>(`/user-progress/${id}`)
    return data
  },

  create: async (payload: UserProgressCreate): Promise<UserProgress> => {
    const { data } = await api.post<UserProgress>('/user-progress', payload)
    return data
  },

  update: async (id: number, payload: UserProgressUpdate): Promise<UserProgress> => {
    const { data } = await api.patch<UserProgress>(`/user-progress/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/user-progress/${id}`)
  },
}
