import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { config } from '../config'
import { broadcastLogout, withRefreshLock } from '../lib/authChannel'
import { Sentry, setSentryUser } from '../lib/sentry'
import { authService } from './authService'

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
})

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

api.interceptors.request.use((request) => {
  const method = (request.method ?? 'get').toUpperCase()
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = getCsrfToken()
    if (token) request.headers.set('X-CSRF-Token', token)
  }
  return request
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string | null) => void
  reject: (err: unknown) => void
}> = []

function processQueue(token: string | null, err: unknown = null) {
  pendingQueue.forEach((p) => {
    if (err) p.reject(err)
    else p.resolve(token)
  })
  pendingQueue = []
}

function clearStoredSession(): void {
  localStorage.removeItem('user')
  localStorage.removeItem('_uid')
  localStorage.removeItem('_role')
}

function redirectToLogin(message: string): void {
  clearStoredSession()
  setSentryUser(null)
  broadcastLogout()
  toast.error(message, { id: 'session-expired' })
  window.location.href = '/login'
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes('/auth/token') ||
    url.includes('/auth/login') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/register') ||
    url.includes('/auth/accept-eula') ||
    url.includes('/auth/logout')
  )
}

/** Envía a Sentry errores de servidor (5xx) o de red, sin datos sensibles. */
function captureClientError(error: AxiosError): void {
  const status = error.response?.status
  if (status && status < 500) return
  const cfg = error.config as InternalAxiosRequestConfig | undefined
  const method = (cfg?.method ?? 'GET').toUpperCase()
  const url = cfg?.url ?? ''
  Sentry.captureException(error, {
    tags: {
      method,
      url,
      status: String(status ?? 'network'),
    },
  })
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    captureClientError(error)
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    const detail = error.response?.data as
      | { detail?: { code?: string } }
      | undefined
    if (
      error.response?.status === 403 &&
      detail?.detail?.code === 'consent_required'
    ) {
      window.dispatchEvent(new Event('consent-required'))
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then(() => {
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const token = await withRefreshLock(() => authService.refresh())
      processQueue(token.access_token)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(null, refreshError)
      redirectToLogin('Tu sesión ha expirado. Inicia sesión de nuevo.')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
