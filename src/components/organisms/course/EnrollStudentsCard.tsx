import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useUsers } from '../../../hooks/useUsers'
import { useEnrollments, useCreateEnrollment, useDeleteEnrollment } from '../../../hooks/useEnrollments'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'
import SearchableSelect from '../../molecules/SearchableSelect'
import { UserPlus, UserMinus } from 'lucide-react'
import { getErrorMessage } from '../../../lib/error'
import type { CourseEnrollment } from '../../../types'

interface Props {
  courseId: number
}

export default function EnrollStudentsCard({ courseId }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<string | number>('')
  const { data: students } = useUsers({ role: 'student', limit: 2000 })
  const { data: enrollments, isLoading } = useEnrollments({})
  const createEnrollment = useCreateEnrollment()
  const deleteEnrollment = useDeleteEnrollment()

  const courseEnrollments = useMemo(
    () => (enrollments || []).filter((e: CourseEnrollment) => e.course_id === courseId),
    [enrollments, courseId],
  )

  const enrolledIds = useMemo(() => new Set(courseEnrollments.map((e) => e.user_id)), [courseEnrollments])

  const studentOptions = useMemo(
    () =>
      (students?.items || [])
        .filter((s) => !enrolledIds.has(s.id))
        .map((s) => ({
          value: s.id,
          label: `${s.name || ''} ${s.first_last_name || ''}`.trim() || s.email,
          sublabel: `${s.identity_type} ${s.identity_number}`,
        })),
    [students, enrolledIds],
  )

  const studentMap = useMemo(() => {
    const m = new Map<number, { name: string; email: string }>()
    for (const s of students?.items || []) {
      m.set(s.id, { name: `${s.name || ''} ${s.first_last_name || ''}`.trim() || s.email, email: s.email })
    }
    return m
  }, [students])

  async function handleAdd() {
    if (!selectedUserId) {
      toast.error('Selecciona un estudiante')
      return
    }
    try {
      await createEnrollment.mutateAsync({ user_id: Number(selectedUserId), course_id: courseId })
      toast.success('Estudiante inscrito al curso')
      setSelectedUserId('')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleRemove(enrollment: CourseEnrollment) {
    try {
      await deleteEnrollment.mutateAsync(enrollment.id)
      toast.success('Inscripción eliminada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Estudiantes inscritos</h2>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <SearchableSelect
            label="Estudiante"
            options={studentOptions}
            value={selectedUserId}
            onChange={setSelectedUserId}
            placeholder="Buscar estudiante por nombre o identidad..."
          />
        </div>
        <Button onClick={handleAdd} loading={createEnrollment.isPending} disabled={!selectedUserId}>
          <UserPlus className="h-4 w-4" />
          Inscribir
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando inscripciones...</p>
      ) : courseEnrollments.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">Aún no hay estudiantes inscritos en este curso.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {courseEnrollments.map((e) => {
            const student = studentMap.get(e.user_id)
            return (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{student?.name ?? `Usuario #${e.user_id}`}</p>
                  {student?.email && <p className="truncate text-xs text-slate-500">{student.email}</p>}
                </div>
                <button
                  onClick={() => handleRemove(e)}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-red-600 transition-colors"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}