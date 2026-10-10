import api from './api'
import type { AdminRead, DashboardStats } from '../types'

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },
  getAdmins: async (): Promise<AdminRead[]> => {
    const { data } = await api.get<AdminRead[]>('/dashboard/admins')
    return data
  },
}
