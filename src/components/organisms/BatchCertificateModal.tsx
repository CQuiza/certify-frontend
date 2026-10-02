import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useBatchIssueCertificates, useCreatePendingCertificate } from '../../hooks/useCertificates'
import Modal from '../molecules/Modal'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import { Search, CheckSquare, Square } from 'lucide-react'
import { getErrorMessage } from '../../lib/error'
import type { CertificateType, Course } from '../../types'

interface BatchCertificateModalProps {
  open: boolean
  onClose: () => void
  userId: number
  certTypes: CertificateType[]
  typeInfoMap: Record<number, { name: string; reference: string | null }>
  courses?: Course[]
}

export default function BatchCertificateModal({ open, onClose, userId, certTypes, typeInfoMap, courses = [] }: BatchCertificateModalProps) {
  const batchIssue = useBatchIssueCertificates()
  const createPending = useCreatePendingCertificate()
  const [mode, setMode] = useState<'available' | 'in_progress'>('available')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<number>>(new Set())
  const [issuedAt, setIssuedAt] = useState('')
  const [validityExtension, setValidityExtension] = useState<number | null>(null)
  const [hours, setHours] = useState<number | null>(null)

  const coursesWithCert = useMemo(
    () => courses.filter((c) => c.certificate_type_id != null),
    [courses],
  )

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

  function toggleCourse(id: number) {
    setSelectedCourseIds((prev) => {
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

  function selectAllCourses() {
    if (selectedCourseIds.size === coursesWithCert.length) {
      setSelectedCourseIds(new Set())
    } else {
      setSelectedCourseIds(new Set(coursesWithCert.map((c) => c.id)))
    }
  }

  function resetForm() {
    setMode('available')
    setSearch('')
    setSelectedIds(new Set())
    setSelectedCourseIds(new Set())
    setIssuedAt('')
    setValidityExtension(null)
    setHours(null)
  }

  async function handleIssue() {
    if (mode === 'in_progress') {
      if (selectedCourseIds.size === 0) return
      try {
        let ok = 0
        for (const courseId of Array.from(selectedCourseIds)) {
          await createPending.mutateAsync({
            user_id: userId,
            course_id: courseId,
            issued_at: issuedAt || null,
            validity_extension: validityExtension ?? undefined,
            hours: hours ?? undefined,
          })
          ok += 1
        }
        toast.success(`${ok} certificado(s) en proceso registrado(s) correctamente`)
        resetForm()
        onClose()
      } catch (err) {
        toast.error(getErrorMessage(err))
      }
      return
    }
    if (selectedIds.size === 0) return
    try {
      const result = await batchIssue.mutateAsync({
        user_id: userId,
        certificate_type_ids: Array.from(selectedIds),
        issued_at: issuedAt || null,
        validity_extension: selectedIds.size === 1 ? (validityExtension ?? undefined) : undefined,
        hours: selectedIds.size === 1 ? (hours ?? undefined) : undefined,
      })
      const issuedCount = result.issued.length
      const errorCount = result.errors.length
      if (errorCount === 0) {
        toast.success(`${issuedCount} certificado(s) emitido(s) correctamente`)
      } else {
        toast.success(`${issuedCount} emitido(s), ${errorCount} error(es)`)
        result.errors.forEach((e) => toast.error(`Tipo #${e.certificate_type_id}: ${e.error}`))
      }
      resetForm()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={() => { resetForm(); onClose() }} title="Generar certificados">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Modo de emisión</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('available')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'available' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Disponible
            </button>
            <button
              type="button"
              onClick={() => setMode('in_progress')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'in_progress' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              En proceso
            </button>
          </div>
          {mode === 'in_progress' && (
            <p className="mt-1 text-xs text-slate-500">
              El certificado quedará retenido y se emitirá automáticamente cuando el estudiante complete el curso al 100%. Los cursos seleccionados serán asignados al estudiante automáticamente.
            </p>
          )}
        </div>

        <Input
          label="Fecha de emisión (opcional)"
          type="date"
          value={issuedAt}
          onChange={(e) => setIssuedAt(e.target.value)}
        />

        <div className="space-y-1.5">
          <Input
            label="Extensión de vigencia (años, opcional)"
            type="number"
            min={1}
            value={validityExtension ?? ''}
            onChange={(e) => setValidityExtension(e.target.value ? Number(e.target.value) : null)}
            disabled={mode === 'available' && selectedIds.size !== 1}
          />
          {mode === 'available' && selectedIds.size !== 1 && (
            <p className="text-xs text-slate-500">Solo disponible al seleccionar un único tipo de certificado.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Input
            label="Número de horas (opcional)"
            type="number"
            min={1}
            value={hours ?? ''}
            onChange={(e) => setHours(e.target.value ? Number(e.target.value) : null)}
            disabled={mode === 'available' && selectedIds.size !== 1}
          />
          {mode === 'available' && selectedIds.size !== 1 && (
            <p className="text-xs text-slate-500">Solo disponible al seleccionar un único tipo de certificado.</p>
          )}
        </div>

        {mode === 'in_progress' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cursos (con tipo de certificado)</label>
            {coursesWithCert.length === 0 ? (
              <p className="text-sm text-slate-500">Este usuario no tiene cursos con tipo de certificado asociado.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-2">
                <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <button onClick={selectAllCourses} className="shrink-0">
                    {selectedCourseIds.size === coursesWithCert.length && coursesWithCert.length > 0
                      ? <CheckSquare className="h-4 w-4 text-indigo-600" />
                      : <Square className="h-4 w-4 text-slate-400" />}
                  </button>
                  Seleccionar todos ({coursesWithCert.length})
                </label>
                {coursesWithCert.map((c) => {
                  const typeName = c.certificate_type_id != null ? typeInfoMap[c.certificate_type_id]?.name : null
                  return (
                    <label key={c.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 cursor-pointer">
                      <button onClick={() => toggleCourse(c.id)} className="shrink-0">
                        {selectedCourseIds.has(c.id)
                          ? <CheckSquare className="h-4 w-4 text-indigo-600" />
                          : <Square className="h-4 w-4 text-slate-400" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-900 truncate">{c.title}</p>
                        <p className="text-xs text-slate-400">{typeName || 'Sin tipo'}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
            {selectedCourseIds.size > 0 && (
              <p className="mt-1 text-xs text-indigo-600 font-medium">{selectedCourseIds.size} curso(s) seleccionado(s)</p>
            )}
          </div>
        ) : (
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
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={() => { resetForm(); onClose() }}>Cancelar</Button>
          <Button
            onClick={handleIssue}
            loading={batchIssue.isPending || createPending.isPending}
            disabled={mode === 'in_progress' ? selectedCourseIds.size === 0 : selectedIds.size === 0}
          >
            {mode === 'in_progress' ? `Registrar en proceso (${selectedCourseIds.size})` : `Emitir certificados (${selectedIds.size})`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
