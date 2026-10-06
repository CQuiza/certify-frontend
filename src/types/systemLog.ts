export type SystemLogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical'
export type SystemLogSource = 'api' | 'worker' | 'frontend'

export interface SystemLog {
  id: number
  level: SystemLogLevel
  source: SystemLogSource
  event: string
  detail: string | null
  stacktrace: string | null
  request_id: string | null
  path: string | null
  method: string | null
  status_code: number | null
  user_id: number | null
  created_at: string
}

export interface SystemLogListResponse {
  items: SystemLog[]
  total: number
}

export interface SystemLogCreate {
  level?: SystemLogLevel
  source?: SystemLogSource
  event: string
  detail?: string | null
  stacktrace?: string | null
  path?: string | null
}