import api from './api'
import type { SystemLogListResponse } from '../types'

export const monitoringService = {
  list: async (params?: Record<string, unknown>): Promise<SystemLogListResponse> => {
    const { data } = await api.get<SystemLogListResponse>('/monitoring/logs', { params })
    return data
  },
}