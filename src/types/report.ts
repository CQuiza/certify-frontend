export interface ReportColumn {
  key: string
  label: string
}

export interface ReportMeta {
  key: string
  title: string
  description: string
  columns: ReportColumn[]
}

export interface ReportResult {
  key: string
  title: string
  columns: ReportColumn[]
  rows: Record<string, unknown>[]
}

export interface RunReportParams {
  key: string
  startDate?: string
  endDate?: string
  limit?: number
}