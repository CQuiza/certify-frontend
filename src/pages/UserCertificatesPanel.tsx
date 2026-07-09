import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCertificates } from '../hooks/useCertificates'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import { useCourses } from '../hooks/useCourses'
import { useEnrollments, useCreateEnrollment, useDeleteEnrollment } from '../hooks/useEnrollments'
import { useUser } from '../hooks/useUsers'
import BatchCertificateModal from '../components/organisms/BatchCertificateModal'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import SearchBar from '../components/molecules/SearchBar'
import Badge from '../components/atoms/Badge'
import Skeleton from '../components/atoms/Skeleton'
import { ArrowLeft, Plus, FileText, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { config } from '../config'
import { getErrorMessage } from '../lib/error'
import { formatDate } from '../lib/dates'
import type { Certificate, Course } from '../types'

const statusVariant = { active: 'success', expired: 'warning', revoked: 'danger' } as const

export default function UserCertificatesPanel() {
  const { userId } = useParams<{ userId: string }>()
  const userIdNum = Number(userId)

  const { data: user, isLoading: loadingUser } = useUser(userIdNum)
  const { data: certificates, isLoading: loadingCerts } = useCertificates({ user_id: userIdNum }, { enabled: userIdNum > 0 })
  const { data: certTypes } = useCertificateTypes()
  const { data: courses } = useCourses()
  const { data: enrollments } = useEnrollments({ user_id: userIdNum }, { enabled: userIdNum > 0 })

  const createEnrollment = useCreateEnrollment()
  const deleteEnrollment = useDeleteEnrollment()

  const [searchQuery, setSearchQuery] = useState('')
  const [batchModalOpen, setBatchModalOpen] = useState(false)

  const typeInfoMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, { name: string; reference: string | null }>
    return Object.fromEntries(certTypes.map((t) => [t.id, { name: t.name, reference: t.reference }]))
  }, [certTypes])

  const courseByTypeId = useMemo(() => {
    if (!courses) return {} as Record<number, Course>
    return Object.fromEntries(courses.filter((c) => c.certificate_type_id != null).map((c) => [c.certificate_type_id!, c]))
  }, [courses])

  const enrolledCourseIds = useMemo(() => new Set(enrollments?.map((e) => e.course_id) ?? []), [enrollments])

  const filteredCertificates = useMemo(() => {
    if (!certificates?.items) return []
    if (!searchQuery.trim()) return certificates.items
    const q = searchQuery.toLowerCase()
    return certificates.items.filter((cert) => {
      const info = cert.certificate_type_id != null ? typeInfoMap[cert.certificate_type_id] : undefined
      if (!info) return false
      return info.name.toLowerCase().includes(q) || (info.reference && info.reference.toLowerCase().includes(q))
    })
  }, [certificates, searchQuery, typeInfoMap])

  async function handleToggleEnrollment(courseId: number, isEnrolled: boolean) {
    try {
      if (isEnrolled) {
        const enr = enrollments?.find((e) => e.course_id === courseId)
        if (enr) await deleteEnrollment.mutateAsync(enr.id)
        toast.success('Usuario removido del curso')
      } else {
        await createEnrollment.mutateAsync({ user_id: userIdNum, course_id: courseId })
        toast.success('Usuario asignado al curso')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const columns = [
    { key: 'type', header: 'Tipo', render: (cert: Certificate) => {
      const info = cert.certificate_type_id != null ? typeInfoMap[cert.certificate_type_id] : undefined
      return <span className="font-medium text-slate-900">{info?.name ?? `Tipo #${cert.certificate_type_id}`}</span>
    }},
    { key: 'reference', header: 'Referencia', render: (cert: Certificate) => {
      const info = cert.certificate_type_id != null ? typeInfoMap[cert.certificate_type_id] : undefined
      return <span className="text-center ps-4 text-sm text-slate-500">{info?.reference || '—'}</span>
    }},
    { key: 'status', header: 'Estado', render: (cert: Certificate) => (
      <Badge variant={(statusVariant[cert.status as keyof typeof statusVariant] || 'default') as 'success' | 'warning' | 'danger' | 'default'}>{cert.status}</Badge>
    )},
    { key: 'issued_at', header: 'Emitido', render: (cert: Certificate) => (
      <span className="text-sm text-slate-600">{formatDate(cert.issued_at, { fallback: '—' })}</span>
    )},
    { key: 'expires_at', header: 'Expira', render: (cert: Certificate) => (
      <span className="text-sm text-slate-600">{cert.expires_at ? formatDate(cert.expires_at, { fallback: '—' }) : '—'}</span>
    )},
    { key: 'course', header: 'Curso asociado', render: (cert: Certificate) => {
      const course = cert.certificate_type_id != null ? courseByTypeId[cert.certificate_type_id] : undefined
      if (!course) return <span className="text-sm text-slate-400">Sin curso</span>
      return (
        <div className="flex items-center gap-2">
          <Link to={`/courses/${course.id}`} className="text-sm text-indigo-600 hover:underline truncate max-w-[180px]">{course.title}</Link>
        </div>
      )
    }},
    { key: 'action_course', header: 'Acción curso', render: (cert: Certificate) => {
      const course = cert.certificate_type_id != null ? courseByTypeId[cert.certificate_type_id] : undefined
      if (!course) return <span className="text-sm text-slate-400">—</span>
      const isEnrolled = enrolledCourseIds.has(course.id)
      return (
        <button
          onClick={() => handleToggleEnrollment(course.id, isEnrolled)}
          className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
            isEnrolled
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {isEnrolled ? 'Remover' : 'Asignar'}
        </button>
      )
    }},
    { key: 'actions', header: 'Acciones', render: (cert: Certificate) => (
      <div className="flex gap-2">
        <a href={cert.pdf_url ?? '#'} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Ver PDF">
          <FileText className="h-4 w-4" />
        </a>
        <button
          onClick={() => window.open(`${config.apiUrl}/certificates/view/${cert.unique_id}/qr`, '_blank')}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          title="Ver QR"
        >
          <QrCode className="h-4 w-4" />
        </button>
      </div>
    )},
  ]

  if (loadingUser) return <div className="p-6 lg:p-8 space-y-4"><Skeleton count={4} className="h-8 w-full" /></div>
  if (!user) return <div className="p-6 lg:p-8"><p className="text-slate-500">Usuario no encontrado</p></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link to="/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" />
          Volver a usuarios
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">{user.name} {user.first_last_name}</h1>
            </div>
            <p className="text-sm text-slate-500">{user.email} · {user.identity_number}</p>
          </div>
          <button onClick={() => setBatchModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" />
            Nuevo certificado(s)
          </button>
        </div>
      </div>

      <Card padding={false}>
        <div className="border-b border-slate-200 px-4 py-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por tipo o referencia..." />
        </div>
        {loadingCerts ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-10 w-full" /></div>
        ) : (
          <DataTable columns={columns} data={filteredCertificates} />
        )}
      </Card>

      <BatchCertificateModal
        open={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        userId={userIdNum}
        certTypes={certTypes ?? []}
        typeInfoMap={typeInfoMap}
      />
    </div>
  )
}
