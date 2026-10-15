import { useCourses } from '../hooks/useCourses'
import { usePublicBranding } from '../hooks/useConfiguration'
import { courseService } from '../services/courseService'
import { GraduationCap, Clock, BookOpen, ShoppingCart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import { useCart } from '../context/cart'
import { config } from '../config'
import { formatCurrency, waLink } from '../types/course'

export default function CatalogPage() {
  const { data: courses, isLoading, isError } = useCourses({ limit: 50, catalog: true })
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const { items, add } = useCart()
  const count = items.length

  const published = (courses || []).filter((c) => c.status === 'published')

  function handleAdd(id: number, title: string, price: number) {
    add({ id, title, price })
    toast.success('Curso agregado al carrito')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="shrink-0">
            <img src="/certify_logo.png" alt="Certify" className="h-12 w-auto sm:h-20" />
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <Link to="/cart" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Carrito">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link to="/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Catálogo de Cursos</h1>
          <p className="mt-2 text-slate-500">Explora, agrega al carrito y paga de forma independiente</p>
        </div>

        {isError ? (
          <ErrorState className="mx-auto max-w-lg" />
        ) : isLoading ? (
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
            {published.map((course) => {
              const forSale = course.is_for_sale && Number(course.price) > 0
              return (
                <div key={course.id} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
                  {course.has_image ? (
                    <img
                      src={courseService.imageUrl(course.id)}
                      alt={course.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-indigo-50 text-indigo-500">
                      <BookOpen className="h-10 w-10" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                  {course.description && <p className="mt-2 text-sm text-slate-500 line-clamp-3">{course.description}</p>}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Curso disponible</span>
                  </div>

                  <div className="mt-auto pt-4">
                    {forSale ? (
                      <>
                        <p className="mb-2 text-lg font-bold text-slate-900">{formatCurrency(course.price)}</p>
                        <button
                          onClick={() => handleAdd(course.id, course.title, Number(course.price))}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Agregar al carrito
                        </button>
                      </>
                    ) : (
                      <p className="mb-2 text-sm text-slate-400">No disponible para compra</p>
                    )}
                    <a
                      href={waLink(contactPhone, `Hola, me interesa el curso "${course.title}". ¿Me das más información?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Consultar con un asesor
                    </a>
                  </div>
                  </div>
                </div>
              )
            })}
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