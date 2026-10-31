import { lazy, Suspense } from 'react'

interface LazyPdfPreviewProps {
  source: string | null
  title?: string
  className?: string
  downloadUrl?: string
}

const PdfPreview = lazy(() => import('./PdfPreview'))

export default function LazyPdfPreview(props: LazyPdfPreviewProps) {
  return (
    <Suspense
      fallback={
        <div className={`flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 ${props.className ?? 'h-[70vh] min-h-[360px]'}`}>
          Cargando visor de PDF…
        </div>
      }
    >
      <PdfPreview {...props} />
    </Suspense>
  )
}
