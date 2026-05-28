import { useState, useRef, useEffect, useMemo } from 'react'

interface Option {
  value: string | number
  label: string
  sublabel?: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  label,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(q)),
    )
  }, [options, search])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <div
          onClick={() => { if (!disabled) { setOpen(!open); setSearch(''); setTimeout(() => inputRef.current?.focus(), 50) }}}
          className={`flex items-center justify-between w-full rounded-lg border px-3 py-2.5 text-sm cursor-pointer ${
            disabled ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-900'
          } ${open ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'}`}
        >
          <span className={selected ? '' : 'text-slate-400'}>
            {selected ? selected.label : placeholder}
          </span>
          <svg className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-400">Sin resultados</p>
              ) : (
                filtered.map((opt) => {
                  const active = opt.value === value
                  return (
                    <div
                      key={String(opt.value)}
                      onClick={() => { onChange(opt.value); setOpen(false); setSearch('') }}
                      className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                        active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        {opt.sublabel && (
                          <p className="text-xs text-slate-400">{opt.sublabel}</p>
                        )}
                      </div>
                      {active && (
                        <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
