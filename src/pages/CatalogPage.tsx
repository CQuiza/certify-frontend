import { useCourses } from '../hooks/useCourses'
import { usePublicBranding } from '../hooks/useConfiguration'
import { GraduationCap, Clock, ShoppingCart, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import PublicHeader from '../components/organisms/PublicHeader'
import PublicFooter from '../components/organisms/PublicFooter'
import CourseImage from '../components/molecules/CourseImage'
import { useCart } from '../context/cart'
import { config } from '../config'
import { formatCurrency, waLink } from '../types/course'

export default function CatalogPage() {
  const { data: courses, isLoading, isError } = useCourses({ limit: 50, catalog: true })
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const { add } = useCart()

  const published = (courses || []).filter((c) => c.status === 'published')

  function handleAdd(id: number, title: string, price: number) {
    add({ id, title, price })
    toast.success('Curso agregado al carrito')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

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
                  <CourseImage courseId={course.id} title={course.title} hasImage={course.has_image} variant="cover" />
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

      <PublicFooter />
    </div>
  )
}