import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'

const QUERY_KEY = ['reports-catalog']

export function useReportsCatalog(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => reportService.listReports(),
    ...options,
  })
}