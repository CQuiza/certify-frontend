import { useState, useMemo } from 'react'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers'
import { useEnrollments, useCreateEnrollment, useDeleteEnrollment } from '../hooks/useEnrollments'
import { useCourses } from '../hooks/useCourses'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import SearchBar from '../components/molecules/SearchBar'
import Pagination from '../components/molecules/Pagination'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, GraduationCap, X } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import type { User, CourseEnrollment } from '../types'
import { IdentityType } from '../types'

const PAGE_SIZE = 10

interface FormData {
  email: string
  password: string
  name: string
  first_last_name: string
  second_last_name: string
  role: string
  identity_type: string
  identity_number: string
  phone_number: string
  is_active: boolean
}

const emptyForm: FormData = {
  email: '', password: '', name: '', first_last_name: '', second_last_name: '',
  role: 'student', identity_type: 'CC', identity_number: '', phone_number: '', is_active: true,
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()
  const updateUser = useUpdateUser(editing?.id ?? 0)

  const [enrollUserId, setEnrollUserId] = useState<number | null>(null)
  const enrollUser = users?.find((u) => u.id === enrollUserId)
  const { data: enrollments, isLoading: loadingEnroll } = useEnrollments(
    { user_id: enrollUserId ?? 0 },
    { enabled: !!enrollUserId },
  )
  const { data: courses } = useCourses()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const createEnrollment = useCreateEnrollment()
  const deleteEnrollment = useDeleteEnrollment()
  const courseMap = useMemo(() => {
    if (!courses) return {} as Record<number, string>
    return Object.fromEntries(courses.map((c) => [c.id, c.title]))
  }, [courses])
  const enrolledCourseIds = useMemo(() => new Set(enrollments?.map((e) => e.course_id) ?? []), [enrollments])

  const filtered = useMemo(() => {
    if (!users) return []
    const q = search.toLowerCase()
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.identity_number?.includes(q),
    )
  }, [users, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(u: User) {
    setEditing(u)
    setForm({
      email: u.email,
      password: '',
      name: u.name || '',
      first_last_name: u.first_last_name || '',
      second_last_name: u.second_last_name || '',
      role: u.role,
      identity_type: u.identity_type,
      identity_number: u.identity_number,
      phone_number: u.phone_number,
      is_active: u.is_active,
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          email: form.email,
          name: form.name || null,
          first_last_name: form.first_last_name || null,
          second_last_name: form.second_last_name || null,
          role: form.role,
          identity_type: form.identity_type,
          identity_number: form.identity_number,
          phone_number: form.phone_number,
          is_active: form.is_active,
        }
        if (form.password) payload.password = form.password
        await updateUser.mutateAsync(payload as Parameters<typeof updateUser.mutateAsync>[0])
        toast.success('Usuario actualizado correctamente')
      } else {
        await createUser.mutateAsync({
          email: form.email,
          password: form.password,
          name: form.name || null,
          first_last_name: form.first_last_name || null,
          second_last_name: form.second_last_name || null,
          role: form.role as User['role'],
          identity_type: form.identity_type as User['identity_type'],
          identity_number: form.identity_number,
          phone_number: form.phone_number,
          is_active: form.is_active,
        })
        toast.success('Usuario creado correctamente')
      }
      setModalOpen(false)
      setEditing(null)
      setForm(emptyForm)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const columns = [
    { key: 'name', header: 'Nombre', render: (u: User) => (
      <div>
        <p className="font-medium text-slate-900">{u.name} {u.first_last_name}</p>
        <p className="text-xs text-slate-500">{u.email}</p>
      </div>
    )},
    { key: 'identity_number', header: 'Identificación' },
    { key: 'role', header: 'Rol', render: (u: User) => {
      const variant = u.role === 'superuser' || u.role === 'admin' ? 'info' : u.role === 'teacher' ? 'warning' : 'default'
      return <Badge variant={variant as 'info' | 'warning' | 'default'}>{u.role}</Badge>
    }},
    { key: 'is_active', header: 'Estado', render: (u: User) => (
      <Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Activo' : 'Inactivo'}</Badge>
    )},
    { key: 'actions' as string, header: 'Acciones', render: (u: User) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); openEdit(u) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este usuario?')) deleteUser.mutate(u.id) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setEnrollUserId(u.id); setSelectedCourseId('') }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Asignar cursos">
          <GraduationCap className="h-4 w-4" />
        </button>
      </div>
    )},
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona los usuarios de la plataforma</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      <Card padding={false}>
        <div className="border-b border-slate-200 px-4 py-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar por nombre, email o identificación..." />
        </div>
        {isLoading ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-10 w-full" /></div>
        ) : (
          <>
            <DataTable columns={columns} data={pageData} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar usuario' : 'Nuevo usuario'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label={editing ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña'} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Primer apellido" value={form.first_last_name} onChange={(e) => setForm({ ...form, first_last_name: e.target.value })} />
          </div>
          <Input label="Segundo apellido" value={form.second_last_name} onChange={(e) => setForm({ ...form, second_last_name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="student">Estudiante</option>
                <option value="teacher">Docente</option>
                <option value="admin">Admin</option>
                <option value="superuser">Superusuario</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo ID</label>
              <select value={form.identity_type} onChange={(e) => setForm({ ...form, identity_type: e.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                {Object.values(IdentityType).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Número ID" value={form.identity_number} onChange={(e) => setForm({ ...form, identity_number: e.target.value })} required />
            <Input label="Teléfono" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-slate-700">Usuario activo</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={createUser.isPending || updateUser.isPending}>
              {editing ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!enrollUserId} onClose={() => setEnrollUserId(null)} title={enrollUser ? `Cursos de ${enrollUser.name || enrollUser.email}` : 'Cursos'}>
        {loadingEnroll ? (
          <div className="space-y-3 p-2"><Skeleton count={3} className="h-10 w-full" /></div>
        ) : (
          <div className="space-y-4">
            {enrollments && enrollments.length > 0 ? (
              <div className="space-y-2">
                {enrollments.map((enr: CourseEnrollment) => (
                  <div key={enr.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{courseMap[enr.course_id] || `Curso #${enr.course_id}`}</p>
                      <p className="text-xs text-slate-500">Inscrito el {(() => { const d = new Date(enr.enrolled_at); return isNaN(d.getTime()) ? enr.enrolled_at?.slice(0, 10) ?? '' : d.toLocaleDateString('es-CO') })()}</p>
                    </div>
                    <button onClick={() => deleteEnrollment.mutateAsync(enr.id).catch((err) => toast.error(getErrorMessage(err)))} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Este usuario no tiene cursos asignados.</p>
            )}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Asignar nuevo curso</label>
              <div className="flex gap-2">
                <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Seleccionar curso...</option>
                  {courses?.filter((c) => !enrolledCourseIds.has(c.id)).map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <Button
                  onClick={() => {
                    if (!enrollUserId || !selectedCourseId) return
                    createEnrollment.mutateAsync({ user_id: enrollUserId, course_id: Number(selectedCourseId) })
                      .then(() => { setSelectedCourseId(''); toast.success('Curso asignado correctamente') })
                      .catch((err) => toast.error(getErrorMessage(err)))
                  }}
                  disabled={!selectedCourseId}
                  loading={createEnrollment.isPending}
                >
                  Asignar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
