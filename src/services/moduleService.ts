import api from './api'
import type { Module, ModuleCreate, ModuleUpdate } from '../types'

export const moduleService = {
  list: async (params?: Record<string, unknown>): Promise<Module[]> => {
    const { data } = await api.get<Module[]>('/modules', { params })
    return data
  },

  getById: async (id: number): Promise<Module> => {
    const { data } = await api.get<Module>(`/modules/${id}`)
    return data
  },

  create: async (payload: ModuleCreate): Promise<Module> => {
    const { data } = await api.post<Module>('/modules', payload)
    return data
  },

  update: async (id: number, payload: ModuleUpdate): Promise<Module> => {
    const { data } = await api.patch<Module>(`/modules/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/modules/${id}`)
  },
}
