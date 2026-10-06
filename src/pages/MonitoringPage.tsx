import { useState, useEffect, useRef } from 'react'
import { useSystemLogs } from '../hooks/useMonitoring'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import Pagination from '../components/molecules/Pagination'
import Modal from '../components/molecules/Modal'
import Badge from '../components/atoms/Badge'
import Button from '../components/atoms/Button'
import ErrorState from '../components/atoms/ErrorState'
import { Activity, Eye, Search } from 'lucide-react'
import { formatDate } from '../lib/dates'
import { logLevelVariant } from '../lib/statusVariant'
import type { SystemLog, SystemLogLevel, SystemLogSource } from '../types'

const PAGE_SIZE = 20

const LEVELS: SystemLogLevel[] = ['debug', 'info', 'warning', 'error', 'critical']
const SOURCES: SystemLogSource[] = ['api', 'worker', 'frontend']

export default function MonitoringPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [level, setLevel] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SystemLog | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [search])

  const { data, isLoading, isError } = useSystemLogs({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    level: level || undefined,
    source: source || undefined,
    search: debouncedSearch || undefined,
  })

  const rows = data?.items ?? []
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const columns = [
    { key: 'created_at', header: 'Fecha', render: (l: SystemLog) => (
      <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(l.created_at, { withTime: true })}</span>
    )},
    { key: 'level', header: 'Nivel', render: (l: SystemLog) => (
      <Badge variant={logLevelVariant(l.level)}>{l.level}</Badge>
    )},
    { key: 'source', header: 'Fuente', render: (l: SystemLog) => (
      <span className="text-xs uppercase tracking-wide text-slate-500">{l.source}</span>
    )},
    { key: 'event', header: 'Evento', render: (l: SystemLog) => (
      <span className="block max-w-[320px] truncate text-sm text-slate-800" title={l.event}>{l.event}</span>
    )},
    { key: 'path', header: 'Ruta', render: (l: SystemLog) => (
      <span className="block max-w-[200px] truncate text-xs text-slate-500" title={l.path ?? ''}>{l.path ?? '—'}</span>
    )},
    { key: 'status_code', header: 'Estado', render: (l: SystemLog) => (
      <span className="text-xs text-slate-600">{l.status_code ?? '—'}</span>
    )},
    { key: 'actions', header: '', render: (l: SystemLog) => (
      <button
        onClick={() => setSelected(l)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
        title="Ver detalle"
      >
        <Eye className="h-4 w-4" />
      </button>
    )},
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Activity className="h-6 w-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoreo</h1>
          <p className="mt-1 text-sm text-slate-500">Registro de eventos y errores de la plataforma</p>
        </div>
      </div>

      <Card padding={false}>
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por evento, detalle o ruta..."
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setPage(1) }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos los niveles</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1) }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas las fuentes</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {isError ? (
          <ErrorState className="m-4" message="No se pudieron cargar los logs." />
        ) : (
          <>
            <DataTable columns={columns} data={rows} loading={isLoading} onRowClick={setSelected} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalle del evento" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={logLevelVariant(selected.level)}>{selected.level}</Badge>
              <span className="text-xs uppercase tracking-wide text-slate-500">{selected.source}</span>
              <span className="text-xs text-slate-400">{formatDate(selected.created_at, { withTime: true })}</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Evento</p>
              <p className="mt-1 break-words text-sm text-slate-800">{selected.event}</p>
            </div>
            {(selected.method || selected.path || selected.status_code) && (
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Petición</p>
                <p className="mt-1 break-words font-mono text-xs text-slate-600">
                  {[selected.method, selected.path, selected.status_code && `→ ${selected.status_code}`].filter(Boolean).join(' ')}
                </p>
              </div>
            )}
            {selected.request_id && (
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Request ID</p>
                <p className="mt-1 font-mono text-xs text-slate-600">{selected.request_id}</p>
              </div>
            )}
            {selected.detail && (
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Detalle</p>
                <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700 whitespace-pre-wrap break-words">{selected.detail}</pre>
              </div>
            )}
            {selected.stacktrace && (
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Stacktrace</p>
                <pre className="mt-1 max-h-72 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 whitespace-pre-wrap break-words">{selected.stacktrace}</pre>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}