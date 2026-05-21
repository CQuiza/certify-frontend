import Spinner from '../atoms/Spinner'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (item: T) => void
}

export default function DataTable<T>({ columns, data, loading, onRowClick }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <p className="text-sm">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 font-medium text-slate-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={(item as Record<string, unknown>).id as string ?? idx}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-slate-100 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-slate-900">
                  {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key as string] as React.ReactNode) ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
