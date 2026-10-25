import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../../context/AuthContext'
import {
  useLessonFilesByLesson,
  useCreateLessonFile,
  useUploadLessonFile,
  useDeleteLessonFile,
} from '../../../hooks/useLessonFiles'
import Modal from '../../molecules/Modal'
import { Trash2, FileText, Upload } from 'lucide-react'
import {
  isAllowedLessonFile,
  LESSON_FILE_ACCEPT,
  LESSON_FILE_MAX_SIZE_BYTES,
  LESSON_FILE_MAX_SIZE_MB,
} from '../../../lib/lessonFiles'

interface LessonFileManagerProps {
  lessonId: number | null
  onClose: () => void
}

export default function LessonFileManager({ lessonId, onClose }: LessonFileManagerProps) {
  const { user } = useAuth()
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)
  const { data: files } = useLessonFilesByLesson(lessonId ?? 0, { enabled: lessonId !== null })
  const createFile = useCreateLessonFile()
  const uploadFile = useUploadLessonFile()
  const deleteFile = useDeleteLessonFile()

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function uploadFiles(list: File[]) {
    if (!lessonId || uploading || list.length === 0) return

    const valid = list.filter((file) => {
      if (!isAllowedLessonFile(file)) {
        toast.error(`Tipo de archivo no permitido: ${file.name}`)
        return false
      }
      if (file.size > LESSON_FILE_MAX_SIZE_BYTES) {
        toast.error(`${file.name} supera el límite de ${LESSON_FILE_MAX_SIZE_MB} MB`)
        return false
      }
      return true
    })
    if (valid.length === 0) return

    setUploading(true)
    setUploadProgress({ done: 0, total: valid.length })
    const base = files?.length ?? 0
    let ok = 0
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]
      try {
        const created = await createFile.mutateAsync({
          lessonId,
          data: {
            original_filename: file.name,
            mime_type: file.type || null,
            order_index: base + i + 1,
          },
        })
        await uploadFile.mutateAsync({ lessonId, fileId: created.id, file })
        ok += 1
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al subir archivo'
        toast.error(`${file.name}: ${msg}`)
      } finally {
        setUploadProgress({ done: i + 1, total: valid.length })
      }
    }
    if (ok > 0) {
      toast.success(ok === 1 ? 'Archivo subido correctamente' : `${ok} archivos subidos correctamente`)
    }
    setUploading(false)
    setUploadProgress(null)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? [])
    if (list.length) void uploadFiles(list)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (uploading) return
    const list = Array.from(e.dataTransfer.files ?? [])
    if (list.length) void uploadFiles(list)
  }

  async function handleDelete(fileId: number) {
    if (!lessonId) return
    try {
      await deleteFile.mutateAsync({ lessonId, fileId })
      toast.success('Archivo eliminado')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar archivo')
    }
  }

  return (
    <Modal open={lessonId !== null} onClose={onClose} title="Archivos de la lección">
      <div className="space-y-4">
        <div className="space-y-3">
          {(!files || files.length === 0) ? (
            <p className="text-sm text-slate-500">No hay archivos aún.</p>
          ) : (
            files.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="h-5 w-5 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{f.original_filename}</p>
                    <p className="text-xs text-slate-400">Orden {f.order_index}</p>
                  </div>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {canManage && (
          <div className="border-t border-slate-200 pt-4">
            <label
              onDragOver={(e) => {
                e.preventDefault()
                if (!uploading) setIsDragging(true)
              }}
              onDragEnter={(e) => {
                e.preventDefault()
                if (!uploading) setIsDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              onDrop={handleDrop}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-sm transition-colors ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
              } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            >
              <Upload className="h-5 w-5" />
              {uploading
                ? uploadProgress
                  ? `Subiendo ${uploadProgress.done}/${uploadProgress.total}...`
                  : 'Subiendo...'
                : isDragging
                  ? 'Suelta los archivos aquí'
                  : 'Subir archivos (o arrástralos aquí)'}
              <input
                type="file"
                accept={LESSON_FILE_ACCEPT}
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>
    </Modal>
  )
}
