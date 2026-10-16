import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  useBranding,
  useUpdateOrganization,
  useUploadBrandingLogo,
  useRestoreBrandingLogo,
  useUploadDarkLogo,
  useRestoreDarkLogo,
} from '../../../hooks/useConfiguration'
import { configurationService } from '../../../services/configurationService'
import { config } from '../../../config'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Skeleton from '../../atoms/Skeleton'
import ErrorState from '../../atoms/ErrorState'
import { Building2, RotateCcw } from 'lucide-react'
import { getErrorMessage } from '../../../lib/error'

type LogoSurface = 'auto' | 'none' | 'light'

function interpolate(template: string, organization: string): string {
  return template
    .replaceAll('{{app_name}}', config.appName)
    .replaceAll('{{organization}}', organization || config.appName)
}

export default function OrganizationConfiguration() {
  const { data, isLoading, isError } = useBranding()

  if (isLoading) {
    return (
      <Card>
        <Skeleton count={3} className="h-16 w-full" />
      </Card>
    )
  }

  if (isError || !data) {
    return <ErrorState message="No se pudo cargar la configuración de la organización." />
  }

  return (
    <OrganizationForm
      key={`${data.organization_name ?? ''}|${data.dashboard_message}|${data.has_custom_logo}|${data.has_dark_logo}|${data.logo_surface}|${data.contact_phone ?? ''}|${data.contact_email ?? ''}`}
      initialOrganizationName={data.organization_name ?? ''}
      initialDashboardMessage={data.dashboard_message}
      initialHasCustomLogo={data.has_custom_logo}
      initialHasDarkLogo={data.has_dark_logo}
      initialLogoSurface={data.logo_surface}
      initialContactPhone={data.contact_phone ?? ''}
      initialContactEmail={data.contact_email ?? ''}
    />
  )
}

interface FormProps {
  initialOrganizationName: string
  initialDashboardMessage: string
  initialHasCustomLogo: boolean
  initialHasDarkLogo: boolean
  initialLogoSurface: LogoSurface
  initialContactPhone: string
  initialContactEmail: string
}

function OrganizationForm({
  initialOrganizationName,
  initialDashboardMessage,
  initialHasCustomLogo,
  initialHasDarkLogo,
  initialLogoSurface,
  initialContactPhone,
  initialContactEmail,
}: FormProps) {
  const updateOrg = useUpdateOrganization()
  const uploadLogo = useUploadBrandingLogo()
  const restoreLogo = useRestoreBrandingLogo()
  const uploadDarkLogo = useUploadDarkLogo()
  const restoreDarkLogo = useRestoreDarkLogo()

  const [organizationName, setOrganizationName] = useState(initialOrganizationName)
  const [dashboardMessage, setDashboardMessage] = useState(initialDashboardMessage)
  const [contactPhone, setContactPhone] = useState(initialContactPhone)
  const [contactEmail, setContactEmail] = useState(initialContactEmail)
  const [logoSurface, setLogoSurface] = useState<LogoSurface>(initialLogoSurface)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const darkInputRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    try {
      await updateOrg.mutateAsync({
        organization_name: organizationName || null,
        dashboard_message: dashboardMessage || null,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        logo_surface: logoSurface,
      })
      toast.success('Configuración de la organización guardada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleUploadLogo(file: File | null) {
    if (!file) return
    try {
      await uploadLogo.mutateAsync(file)
      toast.success('Logo actualizado')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleRestoreLogo() {
    if (!confirm('¿Restaurar el logo por defecto de Acreditapp?')) return
    try {
      await restoreLogo.mutateAsync()
      toast.success('Logo por defecto restaurado')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleUploadDarkLogo(file: File | null) {
    if (!file) return
    try {
      await uploadDarkLogo.mutateAsync(file)
      toast.success('Logo para fondos oscuros actualizado')
      if (darkInputRef.current) darkInputRef.current.value = ''
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleRestoreDarkLogo() {
    if (!confirm('¿Quitar el logo para fondos oscuros?')) return
    try {
      await restoreDarkLogo.mutateAsync()
      toast.success('Logo para fondos oscuros eliminado')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const logoUrl = initialHasCustomLogo ? configurationService.getLogoUrl() : null
  const darkLogoUrl = initialHasDarkLogo ? configurationService.getDarkLogoUrl() : null
  const fileInputClass =
    'block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100'

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Organización</h2>
      </div>

      <div className="space-y-6">
        <Input
          label="Nombre de la organización"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Ej. Fundación Educativa ACME"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Teléfono de contacto (WhatsApp)"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Ej. +57 300 000 0000"
          />
          <Input
            label="Correo de contacto"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contacto@organizacion.com"
          />
        </div>
        <p className="-mt-2 text-xs text-slate-500">
          Estos contactos se usan en los botones de WhatsApp y en las páginas públicas de la organización.
        </p>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Mensaje del panel principal
          </label>
          <textarea
            value={dashboardMessage}
            onChange={(e) => setDashboardMessage(e.target.value)}
            rows={3}
            placeholder="Panel principal de la plataforma {{app_name}} para la organización {{organization}}"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500">
            Usa <code className="rounded bg-slate-100 px-1">{"{{app_name}}"}</code> y{' '}
            <code className="rounded bg-slate-100 px-1">{"{{organization}}"}</code> para
            interpolar automáticamente.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Vista previa</p>
          <p className="mt-1 text-sm text-slate-700">
            {interpolate(dashboardMessage, organizationName)}
          </p>
        </div>

        <Button onClick={handleSave} loading={updateOrg.isPending}>
          Guardar configuración
        </Button>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm font-medium text-slate-700">
            Logos de la organización (también se incluyen en los correos)
          </p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-medium text-slate-500">Logo principal (fondos claros)</p>
              <div className="mt-2 flex h-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
                <img
                  src={logoUrl ?? '/certify_logo.png'}
                  alt="Logo"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleUploadLogo(e.target.files?.[0] ?? null)}
                  className={fileInputClass}
                />
                {initialHasCustomLogo && (
                  <Button variant="secondary" size="sm" onClick={handleRestoreLogo} loading={restoreLogo.isPending}>
                    <RotateCcw className="h-4 w-4" />
                    Restaurar por defecto
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-medium text-slate-500">Logo para fondos oscuros (sidebar)</p>
              <div className="mt-2 flex h-32 items-center justify-center rounded-lg bg-slate-900 p-3">
                {darkLogoUrl ? (
                  <img src={darkLogoUrl} alt="Logo oscuro" className="max-h-full w-auto max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Sin logo específico</span>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <input
                  ref={darkInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleUploadDarkLogo(e.target.files?.[0] ?? null)}
                  className={fileInputClass}
                />
                {initialHasDarkLogo && (
                  <Button variant="secondary" size="sm" onClick={handleRestoreDarkLogo} loading={restoreDarkLogo.isPending}>
                    <RotateCcw className="h-4 w-4" />
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Fondo del logo en superficies oscuras (si no subes un logo oscuro)
            </label>
            <select
              value={logoSurface}
              onChange={(e) => setLogoSurface(e.target.value as LogoSurface)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-xs"
            >
              <option value="auto">Automático (según el color del logo)</option>
              <option value="none">Sin fondo (transparente)</option>
              <option value="light">Fondo claro</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Se aplica en la barra lateral (navy) cuando no hay un logo específico para fondos oscuros.
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            PNG, JPG o WebP, máximo 2 MB. Se normaliza a PNG.
          </p>
        </div>
      </div>
    </Card>
  )
}
