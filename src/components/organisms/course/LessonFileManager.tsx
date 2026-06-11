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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !lessonId) return

    setUploading(true)
    try {
      const created = await createFile.mutateAsync({
        lessonId,
        data: {
          original_filename: file.name,
          mime_type: file.type || null,
          order_index: (files?.length ?? 0) + 1,
        },
      })
      await uploadFile.mutateAsync({ lessonId, fileId: created.id, file })
      toast.success('Archivo subido correctamente')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al subir archivo')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
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
                  <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
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
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
              <Upload className="h-5 w-5" />
              {uploading ? 'Subiendo...' : 'Subir archivo'}
              <input type="file" className="hidden" onChange={handleFileSelect} disabled={uploading} />
            </label>
          </div>
        )}
      </div>
    </Modal>
  )
}
