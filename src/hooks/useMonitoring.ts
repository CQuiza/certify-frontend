import { useQuery } from '@tanstack/react-query'
import { monitoringService } from '../services/monitoringService'

export function useSystemLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['system-logs', params],
    queryFn: () => monitoringService.list(params),
  })
}