import * as Sentry from '@sentry/react'
import type { ErrorEvent, Event } from '@sentry/react'

let initialized = false

function scrub(event: Event): Event {
  if (event.request) {
    delete event.request.data
    delete event.request.cookies
    delete event.request.query_string
    if (event.request.headers) {
      for (const key of Object.keys(event.request.headers)) {
        if (/authorization|cookie|csrf|token/i.test(key)) {
          delete event.request.headers[key]
        }
      }
    }
  }

  if (event.user) {
    event.user = { id: event.user.id }
  }

  if (event.extra) {
    for (const key of Object.keys(event.extra)) {
      if (/email|identity|token|password|secret|cookie/i.test(key)) {
        event.extra[key] = '[redacted]'
      }
    }
  }

  return event
}

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn || initialized) return

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1),
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend: (event) => scrub(event) as ErrorEvent,
    beforeSendTransaction: (event) => scrub(event) as unknown as typeof event,
  })
  initialized = true
}

export function setSentryUser(user: { id: number; role: string } | null): void {
  if (!initialized) return
  if (user) {
    Sentry.setUser({ id: String(user.id) })
    Sentry.setTag('role', user.role)
  } else {
    Sentry.setUser(null)
    Sentry.setTag('role', undefined)
  }
}

export { Sentry }
