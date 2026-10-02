import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  useCertificateTemplateInfo,
  useUploadCertificateTemplate,
  useRestoreCertificateTemplate,
} from '../../../hooks/useConfiguration'
import { configurationService } from '../../../services/configurationService'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'
import Skeleton from '../../atoms/Skeleton'
import ErrorState from '../../atoms/ErrorState'
import { FileText, Download, Upload, RotateCcw, AlertTriangle } from 'lucide-react'
import { getErrorMessage } from '../../../lib/error'

export default function CertificateConfiguration() {
  const { data: info, isLoading, isError } = useCertificateTemplateInfo()
  const uploadTemplate = useUploadCertificateTemplate()
  const restoreTemplate = useRestoreCertificateTemplate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(true)

  async function loadPreview() {
    try {
      const res = await fetch(configurationService.getPreviewUrl(), { credentials: 'include' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const blob = await res.blob()
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(blob)
      })
    } catch {
      setPreviewUrl(null)
      toast.error('No se pudo cargar la vista previa de la plantilla.')
    } finally {
      setPreviewLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetch(configurationService.getPreviewUrl(), { credentials: 'include', signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.blob()
      })
      .then((blob) => {
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return URL.createObjectURL(blob)
        })
      })
      .catch(() => {
        setPreviewUrl(null)
      })
      .finally(() => setPreviewLoading(false))
    return () => {
      controller.abort()
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [])

  async function handleUpload() {
    if (!selectedFile) return
    try {
      await uploadTemplate.mutateAsync(selectedFile)
      toast.success('Plantilla de certificado actualizada correctamente')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setPreviewLoading(true)
      await loadPreview()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleRestore() {
    if (!confirm('¿Restaurar la plantilla por defecto? Se descartará la personalizada.')) return
    try {
      await restoreTemplate.mutateAsync()
      toast.success('Plantilla por defecto restaurada')
      setPreviewLoading(true)
      await loadPreview()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleDownload() {
    try {
      const res = await fetch(configurationService.getPreviewUrl(), { credentials: 'include' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'certificate_template.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('No se pudo descargar la plantilla. Inténtalo de nuevo.')
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Certificado</h2>
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          El certificado nuevo debe conservar las mismas proporciones y espacios que el que está por defecto.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton count={3} className="h-16 w-full" /></div>
      ) : isError ? (
        <ErrorState message="No se pudo cargar la configuración de la plantilla." />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Plantilla en uso</p>
              <p className="text-xs text-slate-500">
                {info?.is_custom ? 'Plantilla personalizada' : 'Plantilla por defecto'}
                {info?.filename ? ` · ${info.filename}` : ''}
                {info?.size_bytes != null ? ` · ${(info.size_bytes / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Descargar certificado actual
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            {previewLoading ? (
              <div className="flex h-[560px] w-full items-center justify-center bg-slate-100">
                <Skeleton className="h-10 w-48" />
              </div>
            ) : previewUrl ? (
              <iframe
                src={previewUrl}
                title="Vista previa del certificado"
                className="h-[560px] w-full bg-slate-100"
              />
            ) : (
              <div className="flex h-[560px] w-full items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">No se pudo cargar la vista previa.</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">Reemplazar plantilla</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <Button onClick={handleUpload} loading={uploadTemplate.isPending} disabled={!selectedFile}>
                <Upload className="h-4 w-4" />
                Guardar plantilla
              </Button>
            </div>
            {selectedFile && (
              <p className="mt-2 text-xs text-slate-500">
                Se reemplazará la plantilla actual por: {selectedFile.name}
              </p>
            )}
          </div>

          {info?.is_custom && (
            <div className="border-t border-slate-200 pt-4">
              <Button variant="secondary" onClick={handleRestore} loading={restoreTemplate.isPending}>
                <RotateCcw className="h-4 w-4" />
                Restaurar plantilla por defecto
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}