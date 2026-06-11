import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useBatchIssueCertificates } from '../../hooks/useCertificates'
import Modal from '../molecules/Modal'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import { Search, CheckSquare, Square } from 'lucide-react'
import { getErrorMessage } from '../../lib/error'
import type { CertificateType } from '../../types'

interface BatchCertificateModalProps {
  open: boolean
  onClose: () => void
  userId: number
  certTypes: CertificateType[]
  typeInfoMap: Record<number, { name: string; reference: string | null }>
}

export default function BatchCertificateModal({ open, onClose, userId, certTypes, typeInfoMap }: BatchCertificateModalProps) {
  const batchIssue = useBatchIssueCertificates()
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [issuedAt, setIssuedAt] = useState('')

  const filteredTypes = useMemo(() => {
    if (!search.trim()) return certTypes
    const q = search.toLowerCase()
    return certTypes.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        String(t.hours).includes(q) ||
        (t.reference && t.reference.toLowerCase().includes(q)),
    )
  }, [certTypes, search])

  function toggle(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    if (selectedIds.size === filteredTypes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredTypes.map((t) => t.id)))
    }
  }

  async function handleIssue() {
    if (selectedIds.size === 0) return
    try {
      const result = await batchIssue.mutateAsync({
        user_id: userId,
        certificate_type_ids: Array.from(selectedIds),
        issued_at: issuedAt || null,
      })
      const issuedCount = result.issued.length
      const errorCount = result.errors.length
      if (errorCount === 0) {
        toast.success(`${issuedCount} certificado(s) emitido(s) correctamente`)
      } else {
        toast.success(`${issuedCount} emitido(s), ${errorCount} error(es)`)
        result.errors.forEach((e) => toast.error(`Tipo #${e.certificate_type_id}: ${e.error}`))
      }
      setSelectedIds(new Set())
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Generar certificados por lote">
      <div className="space-y-4">
        <Input
          label="Fecha de emisión (opcional)"
          type="date"
          value={issuedAt}
          onChange={(e) => setIssuedAt(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipos de certificado</label>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, tipo, horas o referencia..."
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-2">
            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
              <button onClick={selectAll} className="shrink-0">
                {selectedIds.size === filteredTypes.length && filteredTypes.length > 0
                  ? <CheckSquare className="h-4 w-4 text-indigo-600" />
                  : <Square className="h-4 w-4 text-slate-400" />}
              </button>
              Seleccionar todos ({filteredTypes.length})
            </label>
            {filteredTypes.map((t) => {
              const info = typeInfoMap[t.id]
              return (
                <label key={t.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 cursor-pointer">
                  <button onClick={() => toggle(t.id)} className="shrink-0">
                    {selectedIds.has(t.id)
                      ? <CheckSquare className="h-4 w-4 text-indigo-600" />
                      : <Square className="h-4 w-4 text-slate-400" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-900 truncate">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.type} · {t.hours}h {info?.reference ? `· ${info.reference}` : ''}</p>
                  </div>
                </label>
              )
            })}
            {filteredTypes.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">Sin resultados</p>
            )}
          </div>
          {selectedIds.size > 0 && (
            <p className="mt-1 text-xs text-indigo-600 font-medium">{selectedIds.size} seleccionado(s)</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleIssue} loading={batchIssue.isPending} disabled={selectedIds.size === 0}>
            Emitir certificados ({selectedIds.size})
          </Button>
        </div>
      </div>
    </Modal>
  )
}
