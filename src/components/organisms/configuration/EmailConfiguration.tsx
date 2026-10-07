import { useState } from 'react'
import { toast } from 'sonner'
import {
  useEmailSettings,
  useEmailTemplates,
  useRestoreEmailTemplate,
  useSendTestEmail,
  useUpdateEmailSettings,
  useUpdateEmailTemplate,
} from '../../../hooks/useConfiguration'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Skeleton from '../../atoms/Skeleton'
import ErrorState from '../../atoms/ErrorState'
import EmailTemplateEditor from './EmailTemplateEditor'
import { Mail, Send } from 'lucide-react'
import { getErrorMessage } from '../../../lib/error'
import {
  EMAIL_TEMPLATE_KINDS,
  EMAIL_TEMPLATE_LABELS,
  type EmailSettings,
  type EmailSettingsUpdate,
  type EmailTemplateKind,
  type EmailTemplateUpdate,
} from '../../../types/configuration'

function settingsKey(s: EmailSettings): string {
  return [
    s.smtp_enabled,
    s.smtp_host,
    s.smtp_port,
    s.smtp_user,
    s.smtp_password_set,
    s.smtp_tls,
    s.email_from,
    s.email_from_name,
  ].join('|')
}

export default function EmailConfiguration() {
  const {
    data: settings,
    isLoading: settingsLoading,
    isError: settingsError,
  } = useEmailSettings()
  const updateSettings = useUpdateEmailSettings()
  const { data: templatesData, isLoading: templatesLoading } = useEmailTemplates()
  const updateTemplate = useUpdateEmailTemplate()
  const restoreTemplate = useRestoreEmailTemplate()
  const [selectedKind, setSelectedKind] = useState<EmailTemplateKind>('credentials')

  const selectedTemplate = templatesData?.items.find((t) => t.kind === selectedKind)
  const placeholders = templatesData?.placeholders ?? {}

  async function handleSaveTemplate(kind: EmailTemplateKind, payload: EmailTemplateUpdate) {
    await updateTemplate.mutateAsync({ kind, payload })
  }

  async function handleRestoreTemplate(kind: EmailTemplateKind) {
    await restoreTemplate.mutateAsync(kind)
  }

  if (settingsLoading || templatesLoading) {
    return (
      <Card>
        <Skeleton count={4} className="h-16 w-full" />
      </Card>
    )
  }

  if (settingsError || !settings) {
    return <ErrorState message="No se pudo cargar la configuración de correo." />
  }

  return (
    <div className="space-y-6">
      <SmtpForm key={settingsKey(settings)} initial={settings} updateSettings={updateSettings.mutateAsync} />

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Plantillas de correo</h2>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {EMAIL_TEMPLATE_KINDS.map((kind) => {
            const t = templatesData?.items.find((x) => x.kind === kind)
            const active = kind === selectedKind
            return (
              <button
                key={kind}
                onClick={() => setSelectedKind(kind)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {EMAIL_TEMPLATE_LABELS[kind]}
                {t?.is_custom && <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">*</span>}
              </button>
            )
          })}
        </div>

        {selectedTemplate && (
          <EmailTemplateEditor
            key={`${selectedKind}:${selectedTemplate.is_custom}`}
            kind={selectedKind}
            template={selectedTemplate}
            placeholders={placeholders}
            onSave={handleSaveTemplate}
            onRestore={handleRestoreTemplate}
          />
        )}
      </Card>
    </div>
  )
}

interface SmtpFormProps {
  initial: EmailSettings
  updateSettings: (payload: EmailSettingsUpdate) => Promise<EmailSettings>
}

function SmtpForm({ initial, updateSettings }: SmtpFormProps) {
  const [enabled, setEnabled] = useState(initial.smtp_enabled)
  const [host, setHost] = useState(initial.smtp_host ?? '')
  const [port, setPort] = useState(initial.smtp_port != null ? String(initial.smtp_port) : '')
  const [user, setUser] = useState(initial.smtp_user ?? '')
  const [password, setPassword] = useState('')
  const [tls, setTls] = useState(initial.smtp_tls)
  const [emailFrom, setEmailFrom] = useState(initial.email_from ?? '')
  const [emailFromName, setEmailFromName] = useState(initial.email_from_name ?? '')
  const [testEmail, setTestEmail] = useState('')

  const [saving, setSaving] = useState(false)
  const sendTest = useSendTestEmail()

  function buildCurrent(): EmailSettingsUpdate {
    return {
      smtp_enabled: enabled,
      smtp_host: host || null,
      smtp_port: port ? Number(port) : null,
      smtp_user: user || null,
      smtp_tls: tls,
      email_from: emailFrom || null,
      email_from_name: emailFromName || null,
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettings({ ...buildCurrent(), smtp_password: password || null, clear_smtp_password: false })
      setPassword('')
      toast.success('Configuración SMTP guardada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleClearPassword() {
    try {
      await updateSettings({ ...buildCurrent(), smtp_password: null, clear_smtp_password: true })
      toast.success('Contraseña SMTP eliminada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleSendTest() {
    if (!testEmail) {
      toast.error('Escribe un correo de prueba')
      return
    }
    try {
      await sendTest.mutateAsync(testEmail)
      toast.success('Correo de prueba enviado')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Correo saliente (SMTP)</h2>
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700">Usar configuración personalizada de correo</span>
        </label>
        <p className="text-xs text-slate-500">
          Si está desactivada o incompleta, se usará la configuración SMTP del servidor (.env).
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Host SMTP" value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.dominio.com" />
          <Input label="Puerto" value={port} onChange={(e) => setPort(e.target.value)} placeholder="587" inputMode="numeric" />
          <Input label="Usuario" value={user} onChange={(e) => setUser(e.target.value)} placeholder="soporte@dominio.com" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={initial.smtp_password_set ? '•••••••••• (déjalo en blanco para conservar)' : 'Contraseña o app password'}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {initial.smtp_password_set && (
                <Button variant="secondary" size="sm" onClick={handleClearPassword}>
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={tls}
            onChange={(e) => setTls(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700">Usar STARTTLS</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Correo remitente (From)" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} placeholder="noreply@dominio.com" type="email" />
          <Input label="Nombre del remitente" value={emailFromName} onChange={(e) => setEmailFromName(e.target.value)} placeholder="Nombre de la organización" />
        </div>

        <Button onClick={handleSave} loading={saving}>
          Guardar configuración SMTP
        </Button>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700">Enviar correo de prueba</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="destinatario@correo.com" type="email" />
            <Button variant="secondary" onClick={handleSendTest} loading={sendTest.isPending} className="shrink-0">
              <Send className="h-4 w-4" />
              Enviar prueba
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}