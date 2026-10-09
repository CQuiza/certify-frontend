import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCourse } from '../hooks/useCourses'
import Skeleton from '../components/atoms/Skeleton'
import Badge from '../components/atoms/Badge'
import ErrorState from '../components/atoms/ErrorState'
import ModuleManager from '../components/organisms/course/ModuleManager'
import EnrollStudentsCard from '../components/organisms/course/EnrollStudentsCard'
import { ArrowLeft } from 'lucide-react'

export default function CourseDetailPage() {
  const { user } = useAuth()
  const { courseId } = useParams<{ courseId: string }>()
  const id = Number(courseId)
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)

  const { data: course, isLoading: loadingCourse, isError } = useCourse(id)

  if (loadingCourse) return <div className="p-6 lg:p-8 space-y-4"><Skeleton count={3} className="h-8 w-full" /></div>
  if (isError) return <div className="p-6 lg:p-8"><ErrorState message="No se pudo cargar el curso. Inténtalo de nuevo." /></div>
  if (!course) return <div className="p-6 lg:p-8"><p className="text-slate-500">Curso no encontrado</p></div>

  const isAdmin = user?.role === 'superuser' || user?.role === 'admin'
  const canAdminister = isAdmin || user?.id === course.teacher_id

  return (
    <div className="p-6 lg:p-8">
      <Link to="/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver a cursos
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
          {course.description && <p className="mt-2 text-slate-600">{course.description}</p>}
          <div className="mt-2"><Badge variant={course.status === 'published' ? 'success' : 'warning'}>{course.status}</Badge></div>
        </div>
      </div>

      <ModuleManager courseId={id} canManage={!!canManage} />

      {canAdminister && (
        <div className="mt-6">
          <EnrollStudentsCard courseId={id} />
        </div>
      )}
    </div>
  )
}
