import { useState, useMemo } from 'react'
import { useCertificateAudits, useDeleteCertificateAudit } from '../hooks/useCertificateAudits'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import SearchBar from '../components/molecules/SearchBar'
import Pagination from '../components/molecules/Pagination'
import Badge from '../components/atoms/Badge'
import Skeleton from '../components/atoms/Skeleton'
import { Trash2 } from 'lucide-react'
import type { CertificateAudit } from '../types'

const PAGE_SIZE = 10

export default function CertificateAuditPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: audits, isLoading } = useCertificateAudits()
  const deleteAudit = useDeleteCertificateAudit()

  const filtered = useMemo(() => {
    if (!audits) return []
    const q = search.toLowerCase()
    return audits.filter(
      (a) =>
        a.action?.toLowerCase().includes(q) ||
        String(a.certificate_id ?? '').includes(q) ||
        String(a.performed_by ?? '').includes(q) ||
        a.certificate_unique_id?.toLowerCase().includes(q),
    )
  }, [audits, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const actionVariant = (action: string) => {
    if (action === 'issued') return 'info' as const
    if (action === 'active') return 'success' as const
    if (action === 'revoked' || action === 'deleted') return 'danger' as const
    return 'warning' as const
  }

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'certificate_id', header: 'Certificado ID', render: (a: CertificateAudit) => a.certificate_id ?? '—' },
    { key: 'certificate_unique_id', header: 'UUID', render: (a: CertificateAudit) => (
      <span className="font-mono text-xs text-slate-600">{a.certificate_unique_id?.slice(0, 12) || '—'}...</span>
    )},
    { key: 'action', header: 'Acción', render: (a: CertificateAudit) => (
      <Badge variant={actionVariant(a.action || '')}>{a.action || '—'}</Badge>
    )},
    { key: 'performed_by', header: 'Realizado por', render: (a: CertificateAudit) => a.performed_by ?? '—' },
    { key: 'timestamp', header: 'Fecha', render: (a: CertificateAudit) => {
      if (!a.timestamp) return '—'
      const d = new Date(a.timestamp)
      return isNaN(d.getTime()) ? a.timestamp?.slice(0, 10) ?? '—' : d.toLocaleString('es-CO')
    }},
    { key: 'actions' as string, header: 'Acciones', render: (a: CertificateAudit) => (
      <button
        onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este registro?')) deleteAudit.mutate(a.id) }}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        title="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )},
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría de Certificados</h1>
          <p className="mt-1 text-sm text-slate-500">Registro de acciones sobre certificados</p>
        </div>
      </div>

      <Card padding={false}>
        <div className="border-b border-slate-200 px-4 py-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar por acción, certificado o usuario..." />
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
    </div>
  )
}
