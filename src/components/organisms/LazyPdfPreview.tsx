import { lazy, Suspense } from 'react'
import PdfErrorBoundary from './PdfErrorBoundary'

interface LazyPdfPreviewProps {
  source: string | null
  title?: string
  className?: string
  downloadUrl?: string
}

const PdfPreview = lazy(() => import('./PdfPreview'))

export default function LazyPdfPreview(props: LazyPdfPreviewProps) {
  const fallbackClass = props.className ?? 'h-[70vh] min-h-[360px]'

  return (
    <PdfErrorBoundary
      key={props.source ?? 'empty'}
      downloadUrl={props.downloadUrl ?? props.source}
      className={props.className}
    >
      <Suspense
        fallback={
          <div
            className={`flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 ${fallbackClass}`}
          >
            Cargando visor de PDF…
          </div>
        }
      >
        <PdfPreview {...props} />
      </Suspense>
    </PdfErrorBoundary>
  )
}
