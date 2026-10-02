import { useState, useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCertifiedUsers, useUsers } from '../hooks/useUsers'
import { useCertificates, useUpdateCertificate, useIssueCertificate, useCreatePendingCertificate, usePendingCertificates } from '../hooks/useCertificates'
import { useEnrollments } from '../hooks/useEnrollments'
import { useCourses } from '../hooks/useCourses'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import RenewCertificateModal from '../components/organisms/RenewCertificateModal'
import Card from '../components/molecules/Card'
import SearchBar from '../components/molecules/SearchBar'
import SearchableSelect from '../components/molecules/SearchableSelect'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import Pagination from '../components/molecules/Pagination'
import { Plus, Pencil, FileText, QrCode, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import { formatDate } from '../lib/dates'
import { certificateStatusVariant } from '../lib/statusVariant'
import { config } from '../config'
import type { Certificate } from '../types'

const PAGE_SIZE = 15

interface CertRow {
  cert: Certificate
  userName?: string
  userEmail?: string
  userDoc?: string
}

interface UserGroup {
  userId: number
  userName: string
  userEmail: string
  userDoc: string
  certificates: Certificate[]
}

export default function CertificatesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'superuser' || user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [certPage, setCertPage] = useState(1)
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set())
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      setCertPage(1)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | number>('')
  const [selectedTypeId, setSelectedTypeId] = useState<string | number>('')
  const [selectedCourseId, setSelectedCourseId] = useState<string | number>('')
  const [issueMode, setIssueMode] = useState<'available' | 'in_progress'>('available')
  const [issuedAt, setIssuedAt] = useState('')
  const [validityExtension, setValidityExtension] = useState<number | null>(null)
  const [hours, setHours] = useState<number | null>(null)

  function resetIssueForm() {
    setSelectedUserId('')
    setSelectedTypeId('')
    setSelectedCourseId('')
    setIssueMode('available')
    setIssuedAt('')
    setValidityExtension(null)
    setHours(null)
  }
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [renewCert, setRenewCert] = useState<Certificate | null>(null)

  const { data: certifiedUsers, isLoading: loadingCertified, isError: certifiedError } = useCertifiedUsers(
    { skip: (certPage - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: debouncedSearch || undefined },
    { enabled: isAdmin },
  )
  const { data: students } = useUsers({ role: 'student', limit: 2000 }, { enabled: isAdmin })
  const { data: plainCerts, isLoading: loadingPlain, isError: plainError } = useCertificates(
    { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: debouncedSearch || undefined },
    { enabled: !isAdmin },
  )
  const { data: pendingCerts, isError: pendingError } = usePendingCertificates(
    undefined,
    { enabled: !isAdmin },
  )
  const { data: studentCourses } = useCourses({ limit: 2000 }, { enabled: !isAdmin && !!pendingCerts && pendingCerts.length > 0 })
  const courseTitleMap = useMemo(() => {
    if (!studentCourses) return {} as Record<number, string>
    return Object.fromEntries(studentCourses.map((c) => [c.id, c.title]))
  }, [studentCourses])
  const { data: certTypes } = useCertificateTypes({ limit: 2000 })
  const issueCert = useIssueCertificate()
  const createPendingCert = useCreatePendingCertificate()
  const updateCert = useUpdateCertificate(editingCert?.id ?? 0)
  const selectedUserIdNum = Number(selectedUserId)
  const { data: enrollments } = useEnrollments(
    { user_id: selectedUserIdNum },
    { enabled: isAdmin && issueMode === 'in_progress' && selectedUserIdNum > 0 },
  )
  const { data: allCourses } = useCourses({ limit: 2000 }, { enabled: isAdmin && issueMode === 'in_progress' })

  const isLoading = isAdmin ? loadingCertified : loadingPlain
  const isError = isAdmin ? certifiedError : plainError

  const typeMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, string>
    return Object.fromEntries(certTypes.map((t) => [t.id, t.name]))
  }, [certTypes])

  const enrolledCourses = useMemo(() => {
    if (!enrollments || !allCourses) return []
    const enrolledIds = new Set(enrollments.map((e) => e.course_id))
    return allCourses
      .filter((c) => enrolledIds.has(c.id) && c.certificate_type_id != null)
      .map((c) => ({
        value: c.id,
        label: c.title,
        sublabel: c.certificate_type_id != null ? typeMap[c.certificate_type_id] || 'Tipo' : 'Sin tipo',
      }))
  }, [enrollments, allCourses, typeMap])

  const referenceMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, string | null>
    return Object.fromEntries(certTypes.map((t) => [t.id, t.reference]))
  }, [certTypes])

  const userGroups: UserGroup[] = useMemo(() => {
    if (!isAdmin || !certifiedUsers?.items) return []
    return certifiedUsers.items
      .filter((cu) => cu.certificates && cu.certificates.length > 0)
      .map((cu) => ({
        userId: cu.id,
        userName: cu.name || `Usuario #${cu.id}`,
        userEmail: cu.email,
        userDoc: cu.identity_number,
        certificates: [...cu.certificates].sort(
          (a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime(),
        ),
      }))
      .sort((a, b) => a.userName.localeCompare(b.userName))
  }, [isAdmin, certifiedUsers])



  function toggleUser(userId: number) {
    setExpandedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  function openEdit(c: Certificate) {
    setEditingCert(c)
    setEditStatus(c.status)
    setEditModalOpen(true)
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingCert) return
    try {
      await updateCert.mutateAsync({ status: editStatus as Certificate['status'] })
      toast.success('Certificado actualizado correctamente')
      setEditModalOpen(false)
      setEditingCert(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleIssueSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUserId) return
    try {
      if (issueMode === 'in_progress') {
        if (!selectedCourseId) return
        await createPendingCert.mutateAsync({
          user_id: Number(selectedUserId),
          course_id: Number(selectedCourseId),
          issued_at: issuedAt || undefined,
          validity_extension: validityExtension ?? undefined,
          hours: hours ?? undefined,
        })
        toast.success('Certificado en proceso registrado. Se emitirá al completar el curso.')
        setIssueModalOpen(false)
        resetIssueForm()
        return
      }
      if (!selectedTypeId) return
      await issueCert.mutateAsync({
        user_id: Number(selectedUserId),
        certificate_type_id: Number(selectedTypeId),
        issued_at: issuedAt || undefined,
        validity_extension: validityExtension ?? undefined,
        hours: hours ?? undefined,
      })
      toast.success('Certificado emitido correctamente')
      setIssueModalOpen(false)
      resetIssueForm()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  // Non-admin: flat view
  const flatRows: CertRow[] = useMemo(() => {
    if (!isAdmin && plainCerts?.items) {
      return plainCerts.items.map((c) => ({ cert: c }))
    }
    return []
  }, [isAdmin, plainCerts?.items])

  const studentOptions = useMemo(
    () =>
      (students?.items || []).map((s) => ({
        value: s.id,
        label: `${s.name || ''} ${s.first_last_name || ''}`.trim() || s.email,
        sublabel: `${s.identity_type} ${s.identity_number} — ${s.email}`,
      })),
    [students],
  )

  const certTypeOptions = useMemo(
    () =>
      (certTypes || []).map((t) => ({
        value: t.id,
        label: t.name,
        sublabel: `${t.type} — ${t.hours} horas${t.reference ? ` · ${t.reference}` : ''}`,
      })),
    [certTypes],
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificados</h1>
          <p className="mt-1 text-sm text-slate-500">Emite y gestiona certificados</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIssueModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Adicionar Nuevo Certificado
          </Button>
        )}
      </div>

      <Card padding={false}>
        <div className="border-b border-slate-200 px-4 py-3">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); setExpandedUsers(new Set()) }}
            placeholder="Buscar por estudiante, documento o UUID..."
          />
        </div>
        {isError ? (
          <ErrorState className="m-4" />
        ) : isLoading ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-10 w-full" /></div>
        ) : isAdmin ? (
          <div className="divide-y divide-slate-100">
              {userGroups.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">No se encontraron certificados.</p>
            ) : (
                userGroups.map((group) => {
                const expanded = expandedUsers.has(group.userId)
                return (
                  <div key={group.userId}>
                    <button
                      onClick={() => toggleUser(group.userId)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{group.userName}</p>
                          <p className="text-xs text-slate-500 truncate">{group.userEmail} · {group.userDoc}</p>
                        </div>
                      </div>
                      <Badge variant="default">{group.certificates.length} certificado{group.certificates.length !== 1 ? 's' : ''}</Badge>
                    </button>
                    {expanded && (
                      <div className="border-t border-slate-100">
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
                              {user?.role === 'superuser' && <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Referencia</th>}
                              <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                              <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Emitido</th>
                              <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Expira</th>
                              <th className="px-6 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">UUID</th>
                              <th className="px-6 py-2.5 text-right text-xs font-medium text-slate-500 uppercase">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {group.certificates.map((cert) => (
                              <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3 text-slate-700">
                                  {cert.certificate_type_id != null
                                    ? typeMap[cert.certificate_type_id] || `ID: ${cert.certificate_type_id}`
                                    : '—'}
                                </td>
                                {user?.role === 'superuser' && (
                                  <td className="px-6 py-3 text-slate-600">
                                    {cert.certificate_type_id != null
                                      ? referenceMap[cert.certificate_type_id] || '—'
                                      : '—'}
                                  </td>
                                )}
                                <td className="px-6 py-3">
                                  <Badge variant={certificateStatusVariant(cert.status)}>{cert.status}</Badge>
                                </td>
                                <td className="px-6 py-3 text-slate-600">
                                  {formatDate(cert.issued_at)}
                                </td>
                                <td className="px-6 py-3 text-slate-600">
                                  {!cert.expires_at ? '—' : formatDate(cert.expires_at)}
                                </td>
                                <td className="px-6 py-3">
                                  <span
                                    className="font-mono text-xs text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                                    title={cert.unique_id}
                                    onClick={() => navigator.clipboard.writeText(cert.unique_id)}
                                  >
                                    {cert.unique_id.slice(0, 8)}
                                  </span>
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex justify-end gap-1">
                                    <button
                                      onClick={() => window.open(`${config.apiUrl}/certificates/view/${cert.unique_id}`, '_blank')}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                      title="Ver PDF"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => window.open(`${config.apiUrl}/certificates/view/${cert.unique_id}/qr`, '_blank')}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                      title="Ver QR"
                                    >
                                      <QrCode className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => openEdit(cert)}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                      title="Editar"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setRenewCert(cert)}
                                      disabled={cert.status === 'revoked'}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                      title="Renovar"
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
            {isAdmin && certifiedUsers && (
              <Pagination page={certPage} totalPages={Math.ceil(certifiedUsers.total / PAGE_SIZE)} onPageChange={setCertPage} />
            )}
          </div>
        ) : (
          <>
            {pendingError ? (
              <ErrorState className="m-4" message="No se pudieron cargar los certificados en proceso." />
            ) : pendingCerts && pendingCerts.filter((p) => p.status === 'in_progress').length > 0 ? (
              <div className="border-b border-slate-100">
                <div className="px-6 py-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Certificados en proceso</h3>
                  <p className="mb-3 text-xs text-slate-500">
                    Se emitirán automáticamente al completar el 100% del curso.
                  </p>
                  <div className="space-y-2">
                    {pendingCerts.filter((p) => p.status === 'in_progress').map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {courseTitleMap[p.course_id] || `Curso #${p.course_id}`}
                          </p>
                          <p className="text-xs text-slate-500">En proceso — se emitirá al completar el curso</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          En proceso
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Emitido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expira</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">UUID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flatRows.map((r) => (
                  <tr key={r.cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-slate-700">
                      {r.cert.certificate_type_id != null
                        ? typeMap[r.cert.certificate_type_id] || `ID: ${r.cert.certificate_type_id}`
                        : '—'}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {r.cert.certificate_type_id != null
                        ? referenceMap[r.cert.certificate_type_id] || '—'
                        : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={certificateStatusVariant(r.cert.status)}>{r.cert.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {formatDate(r.cert.issued_at)}
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {!r.cert.expires_at ? '—' : formatDate(r.cert.expires_at)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className="font-mono text-xs text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                        title={r.cert.unique_id}
                        onClick={() => navigator.clipboard.writeText(r.cert.unique_id)}
                      >
                        {r.cert.unique_id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => window.open(`${config.apiUrl}/certificates/view/${r.cert.unique_id}`, '_blank')}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Ver PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.open(`${config.apiUrl}/certificates/view/${r.cert.unique_id}/qr`, '_blank')}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Ver QR"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {flatRows.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-slate-400">No se encontraron certificados.</p>
            )}
            {!isAdmin && plainCerts && (
              <Pagination page={page} totalPages={Math.ceil(plainCerts.total / PAGE_SIZE)} onPageChange={setPage} />
            )}
          </>
        )}
      </Card>

      {isAdmin && (
        <Modal open={issueModalOpen} onClose={() => { setIssueModalOpen(false); resetIssueForm() }} title="Adicionar Nuevo Certificado">
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Modo de emisión</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIssueMode('available')}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    issueMode === 'available' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Disponible
                </button>
                <button
                  type="button"
                  onClick={() => setIssueMode('in_progress')}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    issueMode === 'in_progress' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  En proceso
                </button>
              </div>
              {issueMode === 'in_progress' && (
                <p className="mt-1 text-xs text-slate-500">
                  El certificado quedará retenido y se emitirá automáticamente cuando el estudiante complete el curso al 100%.
                </p>
              )}
            </div>
            <SearchableSelect
              label="Usuario"
              options={studentOptions}
              value={selectedUserId}
              onChange={setSelectedUserId}
              placeholder="Buscar estudiante por nombre o identidad..."
              required
            />
            {issueMode === 'in_progress' ? (
              <SearchableSelect
                label="Curso"
                options={enrolledCourses}
                value={selectedCourseId}
                onChange={setSelectedCourseId}
                placeholder="Buscar curso con tipo de certificado..."
                required
              />
            ) : (
              <SearchableSelect
                label="Tipo de certificado"
                options={certTypeOptions}
                value={selectedTypeId}
                onChange={setSelectedTypeId}
                placeholder="Buscar tipo o referencia..."
                required
              />
            )}
            <Input label="Fecha de emisión (opcional)" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            <Input label="Extensión de vigencia (años, opcional)" type="number" min={1} value={validityExtension ?? ''} onChange={(e) => setValidityExtension(e.target.value ? Number(e.target.value) : null)} />
            <Input label="Número de horas (opcional)" type="number" min={1} value={hours ?? ''} onChange={(e) => setHours(e.target.value ? Number(e.target.value) : null)} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setIssueModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={issueCert.isPending || createPendingCert.isPending}>
                {issueMode === 'in_progress' ? 'Registrar en proceso' : 'Emitir certificado'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Actualizar certificado">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="active">Activo</option>
              <option value="revoked">Revocado</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={updateCert.isPending}>Guardar</Button>
          </div>
        </form>
      </Modal>

      {renewCert && (
        <RenewCertificateModal
          open={!!renewCert}
          onClose={() => setRenewCert(null)}
          certificate={renewCert}
        />
      )}
    </div>
  )
}
