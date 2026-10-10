import { useState } from 'react'
import { toast } from 'sonner'
import { useReportsCatalog } from '../hooks/useReports'
import { reportService } from '../services/reportService'
import Card from '../components/molecules/Card'
import Button from '../components/atoms/Button'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import { BarChart3, Download, Play, FileText } from 'lucide-react'
import { getErrorMessage } from '../lib/error'
import type { ReportResult } from '../types/report'

function cellValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

export default function ReportsPage() {
  const { data: catalog, isLoading, isError } = useReportsCatalog()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [results, setResults] = useState<(ReportResult | null)[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  function toggle(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleGenerate() {
    const keys = Array.from(selectedKeys)
    if (keys.length === 0) {
      toast.error('Selecciona al menos un reporte')
      return
    }
    setLoading(true)
    setResults(null)
    try {
      const pending = keys.map((key) =>
        reportService
          .runReport({ key, startDate: startDate || undefined, endDate: endDate || undefined })
          .then((r) => r)
          .catch((e) => {
            toast.error(`Reporte "${key}": ${getErrorMessage(e)}`)
            return null
          }),
      )
      setResults(await Promise.all(pending))
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(key: string) {
    setDownloading(key)
    try {
      await reportService.downloadCsv({
        key,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDownloading(null)
    }
  }

  const generated = (results || []).filter((r): r is ReportResult => r !== null)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Analítica del tenant: selecciona uno o varios reportes y un rango de fechas.</p>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Desde</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Hasta</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} loading={loading}>
              <Play className="h-4 w-4" />
              Generar
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Sin fechas se genera todo el histórico.</p>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2"><Skeleton count={4} className="h-24 w-full" /></div>
      ) : isError || !catalog ? (
        <ErrorState message="No se pudo cargar el catálogo de reportes." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {catalog.map((report) => {
            const active = selectedKeys.has(report.key)
            return (
              <button
                key={report.key}
                onClick={() => toggle(report.key)}
                className={`rounded-xl border p-4 text-left transition-all ${active ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/40' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <p className="font-semibold text-slate-900">{report.title}</p>
                </div>
                <p className="text-sm text-slate-500">{report.description}</p>
              </button>
            )
          })}
        </div>
      )}

      {generated.length > 0 && (
        <div className="mt-8 space-y-6">
          {generated.map((result) => (
            <Card key={result.key}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{result.title}</h2>
                <Button variant="secondary" size="sm" onClick={() => handleDownload(result.key)} loading={downloading === result.key}>
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      {result.columns.map((c) => (
                        <th key={c.key} className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium uppercase text-slate-500">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.rows.length === 0 ? (
                      <tr><td colSpan={result.columns.length} className="px-4 py-6 text-center text-sm text-slate-400">Sin resultados para el rango seleccionado.</td></tr>
                    ) : (
                      result.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          {result.columns.map((c) => (
                            <td key={c.key} className="whitespace-nowrap px-4 py-2 text-slate-700">{cellValue(row[c.key])}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}