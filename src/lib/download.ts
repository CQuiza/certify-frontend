import { toast } from 'sonner'
import { config } from '../config'

async function downloadBlob(url: string, filename: string): Promise<void> {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}

export async function downloadTaskFile(taskId: number): Promise<void> {
  try {
    const res = await fetch(`${config.apiUrl}/tasks/${taskId}/file`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const blob = await res.blob()
    const disposition = res.headers.get('content-disposition')
    const match = disposition?.match(/filename="(.+)"/)
    const filename = match ? match[1] : `task-${taskId}`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch {
    toast.error('No se pudo descargar el archivo. Inténtalo de nuevo.')
  }
}

export async function downloadLessonFile(lessonId: number, fileId: number, filename: string): Promise<void> {
  try {
    await downloadBlob(`${config.apiUrl}/lessons/${lessonId}/files/${fileId}/file?download=true`, filename)
  } catch {
    toast.error('No se pudo descargar el archivo. Inténtalo de nuevo.')
  }
}