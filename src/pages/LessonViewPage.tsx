import { useParams, Link } from 'react-router-dom'
import { useLesson } from '../hooks/useLessons'
import { useModule } from '../hooks/useModules'
import { useCourse } from '../hooks/useCourses'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import { ArrowLeft, ArrowUp, FileText, Video, Image, File } from 'lucide-react'

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

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const lessonIdNum = Number(lessonId)
  const courseIdNum = Number(courseId)

  const { data: lesson, isLoading: loadingLesson } = useLesson(lessonIdNum)
  const { data: mod } = useModule(lesson?.module_id ?? 0)
  const { data: course } = useCourse(courseIdNum)

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
