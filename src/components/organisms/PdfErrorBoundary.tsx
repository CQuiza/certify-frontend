import { Component, type ReactNode } from 'react'

interface PdfErrorBoundaryProps {
  children: ReactNode
  downloadUrl?: string | null
  className?: string
}

interface PdfErrorBoundaryState {
  hasError: boolean
}

export default class PdfErrorBoundary extends Component<
  PdfErrorBoundaryProps,
  PdfErrorBoundaryState
> {
  state: PdfErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PdfErrorBoundaryState {
    return { hasError: true }
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center ${
          this.props.className ?? 'h-[70vh] min-h-[360px]'
        }`}
      >
        <p className="text-sm font-medium text-amber-800">
          No se pudo mostrar el PDF en este navegador.
        </p>
        {this.props.downloadUrl && (
          <a
            href={this.props.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-emerald-700 underline underline-offset-2"
          >
            Abrir o descargar archivo
          </a>
        )}
      </div>
    )
  }
}
