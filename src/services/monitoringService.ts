import api from './api'
import type { SystemLogCreate, SystemLogListResponse } from '../types'

export const monitoringService = {
  list: async (params?: Record<string, unknown>): Promise<SystemLogListResponse> => {
    const { data } = await api.get<SystemLogListResponse>('/monitoring/logs', { params })
    return data
  },

  report: async (payload: SystemLogCreate): Promise<void> => {
    await api.post('/monitoring/logs', payload)
  },
}