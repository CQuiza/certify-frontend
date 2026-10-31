import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, Download, Minus, Plus } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.${pdfjs.version}.min.js`

interface PdfPreviewProps {
  source: string | null
  title?: string
  className?: string
  downloadUrl?: string
}

export default function PdfPreview({
  source,
  title = 'Vista previa del PDF',
  className = 'h-[70vh] min-h-[360px]',
  downloadUrl,
}: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [baseWidth, setBaseWidth] = useState(720)
  const [error, setError] = useState('')

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setBaseWidth(Math.max(260, Math.min(900, entry.contentRect.width - 24)))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const pageWidth = Math.round(baseWidth * zoom)
  const target = downloadUrl ?? source ?? undefined

  if (!source) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 ${className}`}>
        No hay un PDF para mostrar.
      </div>
    )
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            aria-label="Página anterior"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[92px] text-center text-xs font-medium text-slate-600">
            Página {page} de {pages || '—'}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pages || 1, current + 1))}
            disabled={!pages || page >= pages}
            aria-label="Página siguiente"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(0.75, current - 0.25))}
            disabled={zoom <= 0.75}
            aria-label="Reducir zoom"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(2, current + 0.25))}
            disabled={zoom >= 2}
            aria-label="Aumentar zoom"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
          {target && (
            <a
              href={target}
              download
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Descargar PDF"
              className="ml-1 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-700"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3">
        {error ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-slate-600">No se pudo mostrar el PDF.</p>
            {target && (
              <a
                href={target}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-emerald-700 underline underline-offset-2"
              >
                Abrir o descargar archivo
              </a>
            )}
          </div>
        ) : (
          <Document
            file={source}
            onLoadSuccess={({ numPages }) => {
              setPages(numPages)
              setError('')
            }}
            onLoadError={(loadError) => setError(loadError.message)}
            loading={
              <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-slate-500">
                Cargando PDF…
              </div>
            }
          >
            <Page
              pageNumber={Math.min(page, pages || 1)}
              width={pageWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="mx-auto shadow-sm"
              loading={
                <div className="flex h-[240px] items-center justify-center text-sm text-slate-500">
                  Cargando página…
                </div>
              }
            />
          </Document>
        )}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  )
}
