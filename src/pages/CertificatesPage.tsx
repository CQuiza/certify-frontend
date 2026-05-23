import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCertifiedUsers, useUsers } from '../hooks/useUsers'
import { useCertificates, useUpdateCertificate, useDeleteCertificate, useIssueCertificate } from '../hooks/useCertificates'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import SearchBar from '../components/molecules/SearchBar'
import Pagination from '../components/molecules/Pagination'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Skeleton from '../components/atoms/Skeleton'
import { Plus, Pencil, Trash2, FileText, QrCode } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import type { Certificate } from '../types'

const PAGE_SIZE = 10
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface CertRow {
  cert: Certificate
  userName?: string
  userEmail?: string
  userDoc?: string
}

export default function CertificatesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'superuser' || user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [issuedAt, setIssuedAt] = useState('')

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [editStatus, setEditStatus] = useState('')

  const { data: certifiedUsers, isLoading: loadingCertified } = useCertifiedUsers({ enabled: isAdmin })
  const { data: students } = useUsers({ role: 'student' }, { enabled: isAdmin })
  const { data: plainCerts, isLoading: loadingPlain } = useCertificates({ enabled: !isAdmin })
  const { data: certTypes } = useCertificateTypes(undefined, { enabled: isAdmin })
  const issueCert = useIssueCertificate()
  const deleteCert = useDeleteCertificate()
  const updateCert = useUpdateCertificate(editingCert?.id ?? 0)

  const isLoading = isAdmin ? loadingCertified : loadingPlain

  const typeMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, string>
    return Object.fromEntries(certTypes.map((t) => [t.id, t.name]))
  }, [certTypes])

  const rows: CertRow[] = useMemo(() => {
    if (isAdmin && certifiedUsers) {
      const r: CertRow[] = []
      for (const cu of certifiedUsers) {
        for (const c of cu.certificates) {
          r.push({ cert: c, userName: cu.name ?? undefined, userEmail: cu.email, userDoc: cu.identity_number })
        }
      }
      r.sort((a, b) => new Date(b.cert.issued_at).getTime() - new Date(a.cert.issued_at).getTime())
      return r
    }
    if (!isAdmin && plainCerts) {
      return plainCerts.map((c) => ({ cert: c }))
    }
    return []
  }, [isAdmin, certifiedUsers, plainCerts])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.userName?.toLowerCase().includes(q) ||
        r.userEmail?.toLowerCase().includes(q) ||
        r.userDoc?.includes(q) ||
        r.cert.unique_id?.toLowerCase().includes(q),
    )
  }, [rows, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
    if (!selectedUserId || !selectedTypeId) return
    try {
      await issueCert.mutateAsync({
        user_id: Number(selectedUserId),
        certificate_type_id: Number(selectedTypeId),
        issued_at: issuedAt || undefined,
      })
      toast.success('Certificado emitido correctamente')
      setIssueModalOpen(false)
      setSelectedUserId('')
      setSelectedTypeId('')
      setIssuedAt('')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const statusVariant = (s: string) => {
    if (s === 'active') return 'success' as const
    if (s === 'revoked') return 'danger' as const
    return 'warning' as const
  }

  const baseColumns = [
    ...(isAdmin ? [
      { key: 'student', header: 'Estudiante', sortValue: (r: CertRow) => r.userName ?? '', render: (r: CertRow) => (
        <div>
          <p className="font-medium text-slate-900">{r.userName || `Usuario #${r.cert.user_id}`}</p>
          {r.userEmail && <p className="text-xs text-slate-500">{r.userEmail}</p>}
          {r.userDoc && <p className="text-xs text-slate-400">{r.userDoc}</p>}
        </div>
      )},
      { key: 'cert_type', header: 'Tipo', sortValue: (r: CertRow) => r.cert.certificate_type_id ?? '', render: (r: CertRow) => {
        const name = r.cert.certificate_type_id != null ? typeMap[r.cert.certificate_type_id] : '—'
        return <span className="text-sm">{name || `ID: ${r.cert.certificate_type_id}`}</span>
      }},
    ] : []),
    { key: 'status', header: 'Estado', sortValue: (r: CertRow) => r.cert.status, render: (r: CertRow) => (
      <Badge variant={statusVariant(r.cert.status)}>{r.cert.status}</Badge>
    )},
    { key: 'issued_at', header: 'Emitido', sortValue: (r: CertRow) => r.cert.issued_at ?? '', render: (r: CertRow) => {
      const d = new Date(r.cert.issued_at)
      return isNaN(d.getTime()) ? r.cert.issued_at?.slice(0, 10) ?? '—' : d.toLocaleDateString('es-CO')
    }},
    { key: 'expires_at', header: 'Expira', sortValue: (r: CertRow) => r.cert.expires_at ?? '', render: (r: CertRow) => {
      if (!r.cert.expires_at) return '—'
      const d = new Date(r.cert.expires_at)
      return isNaN(d.getTime()) ? r.cert.expires_at?.slice(0, 10) ?? '—' : d.toLocaleDateString('es-CO')
    }},
    { key: 'unique_id', header: 'UUID', sortValue: (r: CertRow) => r.cert.unique_id, render: (r: CertRow) => (
      <span
        className="font-mono text-xs text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
        title={r.cert.unique_id}
        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(r.cert.unique_id) }}
      >
        {r.cert.unique_id.slice(0, 8)}
      </span>
    )},
  ]

  const actionColumn = {
    key: 'actions' as string, header: 'Acciones', render: (r: CertRow) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); window.open(`${API_BASE}/certificates/view/${r.cert.unique_id}`, '_blank') }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Ver PDF">
          <FileText className="h-4 w-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); window.open(`${API_BASE}/certificates/view/${r.cert.unique_id}/qr`, '_blank') }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Ver QR">
          <QrCode className="h-4 w-4" />
        </button>
        {isAdmin && (
          <>
            <button onClick={(e) => { e.stopPropagation(); openEdit(r.cert) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Editar">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este certificado?')) deleteCert.mutateAsync(r.cert.id).then(() => toast.success('Certificado eliminado correctamente')).catch((err) => toast.error(getErrorMessage(err))) }} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Eliminar">
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    ),
  }

  const columns = [...baseColumns, actionColumn]

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
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar por estudiante, documento o UUID..." />
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

      {isAdmin && (
        <Modal open={issueModalOpen} onClose={() => setIssueModalOpen(false)} title="Adicionar Nuevo Certificado">
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuario</label>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Seleccionar usuario...</option>
                {students?.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de certificado</label>
              <select value={selectedTypeId} onChange={(e) => setSelectedTypeId(e.target.value)} required className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Seleccionar tipo...</option>
                {certTypes?.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
              </select>
            </div>
            <Input label="Fecha de emisión (opcional)" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setIssueModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={issueCert.isPending}>Emitir certificado</Button>
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
              <option value="expired">Expirado</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={updateCert.isPending}>Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
