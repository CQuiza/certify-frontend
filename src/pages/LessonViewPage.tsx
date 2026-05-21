import { useParams, Link } from 'react-router-dom'
import { useLesson } from '../hooks/useLessons'
import { useModule } from '../hooks/useModules'
import { useCourse } from '../hooks/useCourses'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import { ArrowLeft, ArrowUp, FileText, Video, Image, File } from 'lucide-react'

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
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {lesson.text_content}
            </div>
          )}
        </div>

        {lesson.image_content_url && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
              <Image className="h-4 w-4 text-amber-500" />
              Imagen
            </div>
            <img src={lesson.image_content_url} alt={lesson.title} className="rounded-xl border border-slate-200 max-w-full" />
          </div>
        )}

        {lesson.video_content_url && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
              <Video className="h-4 w-4 text-rose-500" />
              Video
            </div>
            <video controls src={lesson.video_content_url} className="rounded-xl border border-slate-200 w-full" />
          </div>
        )}

        {lesson.file_content_url && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-600">
              <File className="h-4 w-4 text-blue-500" />
              Archivo adjunto
            </div>
            <a href={lesson.file_content_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowUp className="h-4 w-4" />
              Descargar archivo
            </a>
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
