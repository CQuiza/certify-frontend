import { useCourses } from '../hooks/useCourses'
import { GraduationCap, Clock, BookOpen, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import Skeleton from '../components/atoms/Skeleton'

export default function CatalogPage() {
  const { data: courses, isLoading } = useCourses({ limit: 50 })

  const published = (courses || []).filter((c) => c.status === 'published')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Certify</p>
              <p className="text-xs text-slate-500">Plataforma de Certificación</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Inicio</Link>
            <Link to="/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Catálogo de Cursos</h1>
          <p className="mt-2 text-slate-500">Explora los cursos disponibles y encuentra el que mejor se ajuste a tus necesidades</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : published.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-600">No hay cursos disponibles por el momento</p>
            <p className="mt-1 text-sm text-slate-400">Vuelve a consultar más tarde.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((course) => (
              <div key={course.id} className="group rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-3">{course.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Curso disponible</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <Link to="/faq" className="text-indigo-600 hover:text-indigo-700 transition-colors">Preguntas frecuentes</Link>
          <span className="mx-3 text-slate-300">·</span>
          &copy; {new Date().getFullYear()} Certify. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
