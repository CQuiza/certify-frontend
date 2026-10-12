export interface ReportColumn {
  key: string
  label: string
}

export interface ReportChartConfig {
  kind: 'bar' | 'line' | 'pie'
  x: string | null
  count?: boolean
  numericKeys: string[]
}

export interface ReportMeta {
  key: string
  title: string
  description: string
  columns: ReportColumn[]
  chart: ReportChartConfig
}

export interface ReportResult {
  key: string
  title: string
  columns: ReportColumn[]
  rows: Record<string, unknown>[]
  chart: ReportChartConfig
}

export interface RunReportParams {
  key: string
  startDate?: string
  endDate?: string
  limit?: number
}