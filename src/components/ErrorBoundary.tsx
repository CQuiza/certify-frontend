import { Component, type ErrorInfo, type ReactNode } from 'react'
import axios from 'axios'
import { config } from '../config'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** Captura errores de render de React y los reporta al backend (monitorización). */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void axios
      .post(
        `${config.apiUrl}/monitoring/logs`,
        {
          level: 'critical',
          source: 'frontend',
          event: `RenderError: ${error.message}`.slice(0, 255),
          detail: error.message,
          stacktrace: `${error.stack ?? ''}\n\n${info.componentStack ?? ''}`,
          path: typeof window !== 'undefined' ? window.location.pathname : null,
        },
        { withCredentials: true },
      )
      .catch(() => {})
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">Algo salió mal</h1>
            <p className="mt-2 text-sm text-slate-500">
              Ocurrió un error inesperado. El problema fue registrado. Intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}