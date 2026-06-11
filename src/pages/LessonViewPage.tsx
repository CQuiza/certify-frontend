import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLesson } from '../hooks/useLessons'
import { useModule } from '../hooks/useModules'
import { useCourse } from '../hooks/useCourses'
import { useTasksByLesson } from '../hooks/useTasks'
import { useLessonFilesByLesson } from '../hooks/useLessonFiles'
import { lessonFileService } from '../services/lessonFileService'
import { downloadTaskFile, downloadLessonFile } from '../lib/download'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import { ArrowLeft, ArrowUp, FileText, Video, Image, File, ClipboardList, ExternalLink, X, Eye } from 'lucide-react'

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (!['youtube.com', 'youtu.be'].includes(host)) return null
    let id: string | null = null
    if (host === 'youtu.be') {
      id = u.pathname.slice(1).split('/')[0] || null
    } else if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/')) {
      id = u.pathname.split('/')[2]?.split('?')[0] || null
    } else {
      id = u.searchParams.get('v')
    }
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch {
    return null
  }
}

function getGoogleDriveId(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('drive.google.com')) return null
    const m = u.pathname.match(/\/file\/d\/([^/]+)/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

function FileTextViewer({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null)
  useEffect(() => {
    fetch(url, { credentials: 'include' })
      .then((r) => r.text())
      .then(setContent)
      .catch(() => setContent(null))
  }, [url])
  if (content === null) return <p className="text-sm text-slate-500 py-4">Cargando...</p>
  return <pre className="max-h-[400px] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 whitespace-pre-wrap">{content}</pre>
}

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const lessonIdNum = Number(lessonId)
  const courseIdNum = Number(courseId)

  const { data: lesson, isLoading: loadingLesson } = useLesson(lessonIdNum)
  const { data: mod } = useModule(lesson?.module_id ?? 0)
  const { data: course } = useCourse(courseIdNum)
  const { data: tasks } = useTasksByLesson(lessonIdNum)
  const { data: lessonFiles } = useLessonFilesByLesson(lessonIdNum)

  const [selectedBlob, setSelectedBlob] = useState<{ url: string; id: number; name: string; mime: string | null } | null>(null)

  useEffect(() => {
    return () => {
      if (selectedBlob) URL.revokeObjectURL(selectedBlob.url)
    }
  }, [selectedBlob])

  async function handleView(fileId: number, name: string, mime: string | null) {
    try {
      const res = await fetch(lessonFileService.getFileUrl(lessonIdNum, fileId), { credentials: 'include' })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setSelectedBlob({ url, id: fileId, name, mime })
    } catch {
      // silent
    }
  }

  if (loadingLesson) return <div className="p-6 lg:p-8 space-y-4"><Skeleton count={4} className="h-8 w-full" /></div>
  if (!lesson) return <div className="p-6 lg:p-8"><p className="text-slate-500">Lección no encontrada</p></div>

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4 text-sm">
        <Link to={`/courses/${courseIdNum}`} className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {course?.title || 'Curso'}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">{mod?.title || `Módulo`}</span>
      </div>

      <Card>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
          </div>
          {lesson.text_content && (
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap text-justify">
              {lesson.text_content}
            </div>
          )}
        </div>

        {lessonFiles && lessonFiles.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600">
              <FileText className="h-4 w-4 text-indigo-500" />
              Archivos
            </div>
            <div className="space-y-2">
              {lessonFiles.map((f) => {
                const isViewable = f.mime_type && (f.mime_type.startsWith('image/') || f.mime_type === 'application/pdf' || f.mime_type.startsWith('text/'))
                return (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-700 truncate">{f.original_filename}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {isViewable && (
                        <button
                          onClick={() => handleView(f.id, f.original_filename ?? `file-${f.id}`, f.mime_type)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver
                        </button>
                      )}
                      <button
                        onClick={() => downloadLessonFile(lessonIdNum, f.id, f.original_filename ?? `file-${f.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        Descargar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            {selectedBlob && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
                  <span className="text-sm font-medium text-slate-700 truncate">{selectedBlob.name}</span>
                  <button onClick={() => setSelectedBlob(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  {selectedBlob.mime?.startsWith('image/') ? (
                    <img src={selectedBlob.url} alt={selectedBlob.name} className="max-w-full rounded-lg" />
                  ) : selectedBlob.mime === 'application/pdf' ? (
                    <iframe src={selectedBlob.url} className="w-full h-[600px] rounded-lg border border-slate-200" title={selectedBlob.name} />
                  ) : selectedBlob.mime?.startsWith('text/') ? (
                    <FileTextViewer url={selectedBlob.url} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
                      <FileText className="h-10 w-10" />
                      <p className="text-sm">Vista previa no disponible</p>
                      <button
                        onClick={() => downloadLessonFile(lessonIdNum, selectedBlob.id, selectedBlob.name)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <ArrowUp className="h-4 w-4" />
                        Descargar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {lesson.image_content_url && (() => {
          const gId = getGoogleDriveId(lesson.image_content_url)
          const src = gId ? `https://drive.google.com/thumbnail?id=${gId}&sz=w1000` : lesson.image_content_url
          return (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
                <Image className="h-4 w-4 text-amber-500" />
                Imagen
              </div>
              <img src={src} alt={lesson.title} className="rounded-xl border border-slate-200 max-w-full" />
            </div>
          )
        })()}

        {lesson.video_content_url && (() => {
          const ytEmbed = getYoutubeEmbedUrl(lesson.video_content_url)
          const gId = getGoogleDriveId(lesson.video_content_url)
          const driveEmbed = gId ? `https://drive.google.com/file/d/${gId}/preview` : null
          const embedUrl = ytEmbed ?? driveEmbed ?? null
          return (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
                <Video className="h-4 w-4 text-rose-500" />
                Video
              </div>
              {embedUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full rounded-xl border border-slate-200"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={lesson.title}
                  />
                </div>
              ) : (
                <video controls src={lesson.video_content_url} className="rounded-xl border border-slate-200 w-full" />
              )}
            </div>
          )
        })()}

        {lesson.file_content_url && (() => {
          const gId = getGoogleDriveId(lesson.file_content_url)
          const dlUrl = gId ? `https://drive.google.com/uc?export=download&id=${gId}` : lesson.file_content_url
          const previewUrl = gId ? `https://drive.google.com/file/d/${gId}/preview` : null
          return (
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
                <File className="h-4 w-4 text-blue-500" />
                Archivo adjunto
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={dlUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <ArrowUp className="h-4 w-4" />
                  Descargar archivo
                </a>
                {previewUrl && (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <FileText className="h-4 w-4" />
                    Vista previa
                  </a>
                )}
              </div>
            </div>
          )
        })()}

        {tasks && tasks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900">Tareas</h2>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{task.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {task.file_type === 'google_drive' && task.google_drive_link && (
                          <a
                            href={task.google_drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver en Google Drive
                          </a>
                        )}
                        {task.file_type === 'upload' && task.file_url && (
                          <button
                            onClick={() => downloadTaskFile(task.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                            Descargar archivo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-6">
        <Link to={`/courses/${courseIdNum}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al curso
        </Link>
      </div>
    </div>
  )
}
