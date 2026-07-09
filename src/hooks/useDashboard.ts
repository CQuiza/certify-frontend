import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

const QUERY_KEY = ['dashboard-stats']

export function useDashboardStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => dashboardService.getStats(),
    ...options,
  })
}
