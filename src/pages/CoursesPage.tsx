import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCourses, useCourse, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourses'
import { useUsers } from '../hooks/useUsers'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
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

const statusVariant = (s: string) => {
  if (s === 'published') return 'success' as const
  if (s === 'draft') return 'warning' as const
  return 'default' as const
}

export default function CoursesPage() {
  const { user } = useAuth()
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const { data: courses, isLoading } = useCourses()
  const { data: fullCourse } = useCourse(editing?.id ?? 0)
  const { data: teachers } = useUsers(undefined, { enabled: !!canManage })
  const { data: certTypes } = useCertificateTypes(undefined, { enabled: !!canManage })
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse(editing?.id ?? 0)
  const deleteCourse = useDeleteCourse()

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

  const columns = [
    { key: 'title', header: 'Título' },
    { key: 'description', header: 'Descripción', render: (c: Course) => (
      <span className="text-sm text-slate-600 line-clamp-1">{c.description || '—'}</span>
    )},
    { key: 'status', header: 'Estado', render: (c: Course) => (
      <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
    )},
    {
      key: 'actions' as string, header: 'Acciones', render: (c: Course) => (
        <div className="flex gap-2">
          <Link to={`/courses/${c.id}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Ver contenido">
            <Eye className="h-4 w-4" />
          </Link>
          {canManage && (
            <>
              <button onClick={(e) => { e.stopPropagation(); openEdit(c) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este curso?')) deleteCourse.mutate(c.id) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  function fmtDate(d: string | undefined | null) {
    if (!d) return '—'
    const date = new Date(d)
    return isNaN(date.getTime()) ? d.slice(0, 10) : date.toLocaleDateString('es-CO')
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

      <Card padding={false}>
        {isLoading ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-10 w-full" /></div>
        ) : (
          <DataTable columns={columns} data={(courses as Course[]) || []} />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar curso' : 'Nuevo curso'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {editing && fullCourse && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Creado" value={fmtDate(fullCourse.created_at)} disabled />
              <Input label="Actualizado" value={fmtDate(fullCourse.updated_at)} disabled />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Docente</label>
            <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: Number(e.target.value) })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value={0}>Sin docente</option>
              {teachers?.filter((t) => t.role === 'teacher').map((t) => (
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
