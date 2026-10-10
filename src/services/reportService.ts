import api from './api'
import type { ReportMeta, ReportResult, RunReportParams } from '../types/report'

function toDateParams(params: RunReportParams): Record<string, unknown> {
  const q: Record<string, unknown> = {}
  if (params.startDate) q.start_date = params.startDate
  if (params.endDate) q.end_date = params.endDate
  if (params.limit) q.limit = params.limit
  return q
}

export const reportService = {
  listReports: async (): Promise<ReportMeta[]> => {
    const { data } = await api.get<ReportMeta[]>('/reports')
    return data
  },

  runReport: async (params: RunReportParams): Promise<ReportResult> => {
    const { data } = await api.get<ReportResult>(`/reports/${params.key}`, {
      params: toDateParams(params),
    })
    return data
  },

  downloadCsv: async (params: RunReportParams): Promise<void> => {
    const res = await api.get(`/reports/${params.key}`, {
      params: { ...toDateParams(params), format: 'csv' },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(res.data as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${params.key}.csv`
    a.click()
    URL.revokeObjectURL(url)
  },
}