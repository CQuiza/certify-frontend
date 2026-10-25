import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCourses, useCourse, useCreateCourse, useUpdateCourse } from '../hooks/useCourses'
import { useUsers } from '../hooks/useUsers'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import { courseService } from '../services/courseService'
import Card from '../components/molecules/Card'
import Modal from '../components/molecules/Modal'
import SearchBar from '../components/molecules/SearchBar'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import CourseImage from '../components/molecules/CourseImage'
import PageHeader from '../components/molecules/PageHeader'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Eye, ChevronDown, BookOpen, MessageCircle, GraduationCap, Image as ImageIcon } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import { formatDate } from '../lib/dates'
import { courseStatusVariant } from '../lib/statusVariant'
import { usePublicBranding } from '../hooks/useConfiguration'
import { waLink } from '../types/course'
import { config } from '../config'
import type { Course } from '../types'
import { CourseStatus } from '../types'

interface FormData {
  title: string
  description: string
  status: string
  teacher_id: number
  certificate_type_id: number
  price: string
  renewal_price: string
  is_for_sale: boolean
}

const emptyForm: FormData = { title: '', description: '', status: 'draft', teacher_id: 0, certificate_type_id: 0, price: '', renewal_price: '', is_for_sale: false }

export default function CoursesPage() {
  const { user } = useAuth()
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [savingImage, setSavingImage] = useState(false)
  const qc = useQueryClient()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  const { data: courses, isLoading, isError } = useCourses({ limit: 2000, search: debouncedSearch || undefined })
  const { data: fullCourse } = useCourse(editing?.id ?? 0)
  const { data: teachers } = useUsers({ role: 'teacher', limit: 2000 }, { enabled: !!canManage })
  const { data: certTypes } = useCertificateTypes(undefined, { enabled: !!canManage })
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse(editing?.id ?? 0)

  useEffect(() => {
    if (fullCourse) {
      setForm({
        title: fullCourse.title,
        description: fullCourse.description || '',
        status: fullCourse.status,
        teacher_id: fullCourse.teacher_id ?? 0,
        certificate_type_id: fullCourse.certificate_type_id ?? 0,
        price: fullCourse.price != null ? String(fullCourse.price) : '',
        renewal_price: fullCourse.renewal_price != null ? String(fullCourse.renewal_price) : '',
        is_for_sale: fullCourse.is_for_sale,
      })
    }
  }, [fullCourse])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview(null)
    setModalOpen(true)
  }

  function openEdit(c: Course) {
    setEditing(c)
    setForm({
      title: c.title,
      description: c.description || '',
      status: c.status,
      teacher_id: 0,
      certificate_type_id: 0,
      price: c.price != null ? String(c.price) : '',
      renewal_price: c.renewal_price != null ? String(c.renewal_price) : '',
      is_for_sale: c.is_for_sale,
    })
    setImageFile(null)
    setImagePreview(c.has_image ? courseService.imageUrl(c.id) : null)
    setModalOpen(true)
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen válido')
      return
    }
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  async function handleRemoveImage() {
    if (!editing) return
    try {
      await courseService.removeImage(editing.id)
      setImageFile(null)
      setImagePreview(null)
      qc.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Imagen eliminada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description || null,
      status: form.status as Course['status'],
      teacher_id: form.teacher_id || null,
      certificate_type_id: form.certificate_type_id || null,
      price: form.price ? Number(form.price) : 0,
      renewal_price: form.renewal_price ? Number(form.renewal_price) : null,
      is_for_sale: form.is_for_sale,
    }
    try {
      const saved = editing
        ? await updateCourse.mutateAsync(payload)
        : await createCourse.mutateAsync(payload)
      if (imageFile) {
        setSavingImage(true)
        try {
          await courseService.uploadImage(saved.id, imageFile)
          qc.invalidateQueries({ queryKey: ['courses'] })
        } catch (err) {
          toast.error(getErrorMessage(err))
        } finally {
          setSavingImage(false)
        }
      }
      toast.success(editing ? 'Curso actualizado correctamente' : 'Curso creado correctamente')
      setModalOpen(false)
      setEditing(null)
      setForm(emptyForm)
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  function toggleExpand(courseId: number) {
    setExpandedId(expandedId === courseId ? null : courseId)
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Cursos"
        subtitle="Administra los cursos de la plataforma"
        actions={
          canManage ? (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nuevo curso
            </Button>
          ) : undefined
        }
      />

      {isError && <ErrorState className="mb-6" />}

      <Card padding={false}>
        <div className="border-b border-slate-200 px-4 py-3">
          <SearchBar
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Buscar por título o descripción..."
          />
        </div>
        {isLoading ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-16 w-full rounded-lg" /></div>
        ) : !courses || courses.length === 0 ? (
          debouncedSearch ? (
            <div className="p-6">
              <p className="py-8 text-center text-sm text-slate-500">
                No se encontraron cursos para tu búsqueda.
              </p>
            </div>
          ) : user?.role === 'student' ? (
            <div className="p-8 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-700">Aún no tienes cursos asignados</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Revisa el <strong>catálogo</strong> para comprar un curso, o comunícate con un asesor
                para que te asignen uno.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Ver catálogo
                </Link>
                <a
                  href={waLink(contactPhone, 'Hola, quiero información para adquirir o que me asignen un curso.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar a un asesor
                </a>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <p className="py-8 text-center text-sm text-slate-500">No hay cursos disponibles</p>
            </div>
          )
        ) : (
          <div className="space-y-2 p-4 sm:p-6">
          {(courses as Course[]).map((c) => {
            const isOpen = expandedId === c.id
            return (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(c.id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:items-center sm:gap-4 sm:px-5"
                >
                  <CourseImage courseId={c.id} title={c.title} hasImage={c.has_image} variant="thumb" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 sm:truncate sm:line-clamp-none">{c.title}</h3>
                    <div className="mt-0.5 flex min-w-0 items-center gap-2">
                      <span className="shrink-0 sm:hidden">
                        <Badge variant={courseStatusVariant(c.status)}>{c.status}</Badge>
                      </span>
                      <p className="truncate text-sm text-slate-500">{c.description || 'Sin descripción'}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span className="hidden sm:inline-flex">
                      <Badge variant={courseStatusVariant(c.status)}>{c.status}</Badge>
                    </span>
                    <div className="text-slate-400 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : '' }}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4 space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{c.description || 'Sin descripción'}</p>
                    <div className="flex gap-2 pt-1">
                      <Link
                        to={`/courses/${c.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver contenido
                      </Link>
                      {canManage && (
                        <button
                          onClick={() => openEdit(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar curso' : 'Nuevo curso'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Imagen del curso (opcional)</label>
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa" className="mb-2 h-40 w-full rounded-lg border border-slate-200 object-cover" />
            ) : (
              <div className="mb-2 flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {editing && (editing.has_image || imageFile) && (
                <Button variant="secondary" size="sm" type="button" className="shrink-0" onClick={handleRemoveImage}>
                  Quitar
                </Button>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">Se redimensiona automáticamente (máx. 5 MB).</p>
          </div>
          {editing && fullCourse && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Creado" value={formatDate(fullCourse.created_at)} disabled />
              <Input label="Actualizado" value={formatDate(fullCourse.updated_at)} disabled />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Docente</label>
            <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: Number(e.target.value) })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value={0}>Sin docente</option>
              {teachers?.items?.filter((t) => t.role === 'teacher').map((t) => (
                <option key={t.id} value={t.id}>{t.name || t.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de certificado</label>
            <select value={form.certificate_type_id} onChange={(e) => setForm({ ...form, certificate_type_id: Number(e.target.value) })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value={0}>Sin tipo</option>
              {certTypes?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {Object.values(CourseStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio (COP, 0 = sin venta)" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="50000" />
            <Input label="Precio renovación (COP, 0 = gratis)" type="number" min={0} value={form.renewal_price} onChange={(e) => setForm({ ...form, renewal_price: e.target.value })} placeholder="Igual al precio si se deja vacío" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_for_sale} onChange={(e) => setForm({ ...form, is_for_sale: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-slate-700">Disponible para compra</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={createCourse.isPending || updateCourse.isPending || savingImage}>
              {editing ? 'Guardar cambios' : 'Crear curso'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
