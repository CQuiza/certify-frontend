import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCourses, useCourse, useCreateCourse, useUpdateCourse } from '../hooks/useCourses'
import { useUsers } from '../hooks/useUsers'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import Card from '../components/molecules/Card'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Eye, ChevronDown } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import { formatDate } from '../lib/dates'
import { courseStatusVariant } from '../lib/statusVariant'
import type { Course } from '../types'
import { CourseStatus } from '../types'

interface FormData {
  title: string
  description: string
  status: string
  teacher_id: number
  certificate_type_id: number
}

const emptyForm: FormData = { title: '', description: '', status: 'draft', teacher_id: 0, certificate_type_id: 0 }

export default function CoursesPage() {
  const { user } = useAuth()
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const { data: courses, isLoading } = useCourses()
  const { data: fullCourse } = useCourse(editing?.id ?? 0)
  const { data: teachers } = useUsers({ role: 'teacher', limit: 500 }, { enabled: !!canManage })
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
      })
    }
  }, [fullCourse])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
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
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description || null,
      status: form.status as Course['status'],
      teacher_id: form.teacher_id || null,
      certificate_type_id: form.certificate_type_id || null,
    }
    try {
      if (editing) {
        await updateCourse.mutateAsync(payload)
        toast.success('Curso actualizado correctamente')
      } else {
        await createCourse.mutateAsync(payload)
        toast.success('Curso creado correctamente')
      }
      setModalOpen(false)
      setEditing(null)
      setForm(emptyForm)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  function toggleExpand(courseId: number) {
    setExpandedId(expandedId === courseId ? null : courseId)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
          <p className="mt-1 text-sm text-slate-500">Administra los cursos de la plataforma</p>
        </div>
        {canManage && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo curso
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton count={5} className="h-16 w-full rounded-lg" /></div>
      ) : !courses || courses.length === 0 ? (
        <Card><p className="py-8 text-center text-sm text-slate-500">No hay cursos disponibles</p></Card>
      ) : (
        <div className="space-y-2">
          {(courses as Course[]).map((c) => {
            const isOpen = expandedId === c.id
            return (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(c.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{c.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-500 truncate">{c.description || 'Sin descripción'}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={courseStatusVariant(c.status)}>{c.status}</Badge>
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar curso' : 'Nuevo curso'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {editing && fullCourse && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Creado" value={formatDate(fullCourse.created_at)} disabled />
              <Input label="Actualizado" value={formatDate(fullCourse.updated_at)} disabled />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Docente</label>
            <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: Number(e.target.value) })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value={0}>Sin docente</option>
              {teachers?.items?.filter((t) => t.role === 'teacher').map((t) => (
                <option key={t.id} value={t.id}>{t.name || t.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de certificado</label>
            <select value={form.certificate_type_id} onChange={(e) => setForm({ ...form, certificate_type_id: Number(e.target.value) })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value={0}>Sin tipo</option>
              {certTypes?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {Object.values(CourseStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={createCourse.isPending || updateCourse.isPending}>
              {editing ? 'Guardar cambios' : 'Crear curso'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
