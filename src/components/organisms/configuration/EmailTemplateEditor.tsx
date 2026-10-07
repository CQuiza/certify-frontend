import { useState } from 'react'
import { toast } from 'sonner'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Badge from '../../atoms/Badge'
import { RotateCcw, Save } from 'lucide-react'
import type {
  EmailTemplate,
  EmailTemplateKind,
  EmailTemplateUpdate,
} from '../../../types/configuration'
import { getErrorMessage } from '../../../lib/error'

interface Props {
  kind: EmailTemplateKind
  template: EmailTemplate
  placeholders: Record<string, string>
  onSave: (kind: EmailTemplateKind, payload: EmailTemplateUpdate) => Promise<void>
  onRestore: (kind: EmailTemplateKind) => Promise<void>
}

export default function EmailTemplateEditor({ kind, template, placeholders, onSave, onRestore }: Props) {
  const [subject, setSubject] = useState(template.subject)
  const [body, setBody] = useState(template.body_html)
  const [saving, setSaving] = useState(false)
  const [restoring, setRestoring] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(kind, { subject, body_html: body, is_enabled: true })
      toast.success('Plantilla guardada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRestore() {
    if (!confirm('¿Restaurar esta plantilla a su versión por defecto?')) return
    setRestoring(true)
    try {
      await onRestore(kind)
      toast.success('Plantilla restaurada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">Mensaje HTML</p>
        <Badge variant={template.is_custom ? 'info' : 'default'}>
          {template.is_custom ? 'Personalizada' : 'Por defecto'}
        </Badge>
      </div>

      <Input
        label="Asunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Asunto del correo"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Cuerpo (HTML)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          spellCheck={false}
          className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Variables disponibles
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(placeholders).map(([key, desc]) => (
            <span key={key} title={desc} className="cursor-default rounded-md bg-white px-2 py-1 text-xs text-indigo-700 ring-1 ring-slate-200">
              {'{{' + key + '}}'}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" />
          Guardar plantilla
        </Button>
        {template.is_custom && (
          <Button variant="secondary" onClick={handleRestore} loading={restoring}>
            <RotateCcw className="h-4 w-4" />
            Restaurar por defecto
          </Button>
        )}
      </div>
    </div>
  )
}