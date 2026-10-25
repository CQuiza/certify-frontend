import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import Badge from '../../atoms/Badge'
import type { ReportChartConfig, ReportResult } from '../../../types/report'

const PALETTE = ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#f97316', '#64748b']

interface Props {
  result: ReportResult
}

function numberValue(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function ReportChart({ result }: Props) {
  const chart: ReportChartConfig = result.chart
  const rows = result.rows

  const xKey = chart.x ?? result.columns[0]?.key ?? ''
  const numericCandidates = useMemo(() => {
    const fromConfig = chart.numericKeys ?? []
    if (fromConfig.length > 0) return fromConfig
    return result.columns
      .map((c) => c.key)
      .filter((k) => rows.some((r) => typeof r[k] === 'number'))
  }, [chart, result.columns, rows])

  const [kind, setKind] = useState<'bar' | 'line' | 'pie'>(chart.kind ?? 'bar')
  const [numericKey, setNumericKey] = useState<string>(numericCandidates[0] ?? '')

  const data: Array<{ x?: string; name?: string; value: number }> = useMemo(() => {
    if (kind === 'pie' || !numericKey) {
      // Conteo por categoría (x).
      const counts = new Map<string, number>()
      for (const r of rows) {
        const key = String(r[xKey] ?? '—')
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
      return Array.from(counts, ([name, value]) => ({ x: name, name, value }))
    }
    return rows.map((r) => ({ x: String(r[xKey] ?? '—'), value: numberValue(r[numericKey]) }))
  }, [rows, xKey, numericKey, kind])

  const pieColors = useMemo(() => data.map((_, i) => PALETTE[i % PALETTE.length]), [data])

  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">Sin datos para graficar.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {(['bar', 'line', 'pie'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                kind === k ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {k === 'bar' ? 'Barras' : k === 'line' ? 'Línea' : 'Pastel'}
            </button>
          ))}
        </div>
        {numericCandidates.length > 1 && (
          <select
            value={numericKey}
            onChange={(e) => setNumericKey(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Contar por {xKey}</option>
            {numericCandidates.map((k) => (
              <option key={k} value={k}>Suma de {k}</option>
            ))}
          </select>
        )}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {kind === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={numericKey ? 'x' : 'name'} fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={numericKey || 'n'} fill="#059669" />
            </BarChart>
          ) : kind === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name={numericKey || 'n'} stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={pieColors[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="info">X: {xKey}</Badge>
        {numericKey && <Badge variant="success">Serie: {numericKey}</Badge>}
        <Badge>Filas: {rows.length}</Badge>
      </div>
    </div>
  )
}