import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  useBranding,
  useUpdateOrganization,
  useUploadBrandingLogo,
  useRestoreBrandingLogo,
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
      key={`${data.organization_name ?? ''}|${data.dashboard_message}|${data.has_custom_logo}`}
      initialOrganizationName={data.organization_name ?? ''}
      initialDashboardMessage={data.dashboard_message}
      initialHasCustomLogo={data.has_custom_logo}
    />
  )
}

interface FormProps {
  initialOrganizationName: string
  initialDashboardMessage: string
  initialHasCustomLogo: boolean
}

function OrganizationForm({
  initialOrganizationName,
  initialDashboardMessage,
  initialHasCustomLogo,
}: FormProps) {
  const updateOrg = useUpdateOrganization()
  const uploadLogo = useUploadBrandingLogo()
  const restoreLogo = useRestoreBrandingLogo()

  const [organizationName, setOrganizationName] = useState(initialOrganizationName)
  const [dashboardMessage, setDashboardMessage] = useState(initialDashboardMessage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    try {
      await updateOrg.mutateAsync({
        organization_name: organizationName || null,
        dashboard_message: dashboardMessage || null,
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
    if (!confirm('¿Restaurar el logo por defecto de Certify?')) return
    try {
      await restoreLogo.mutateAsync()
      toast.success('Logo por defecto restaurado')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const logoUrl = initialHasCustomLogo ? configurationService.getLogoUrl() : null

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
            Logo de la organización (también se incluye en los correos)
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2">
              {initialHasCustomLogo && logoUrl ? (
                <img src={logoUrl} alt="Logo personalizado" className="max-h-full max-w-full object-contain" />
              ) : (
                <img src="/certify_logo.png" alt="Logo por defecto" className="max-h-full max-w-full object-contain" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleUploadLogo(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {initialHasCustomLogo && (
                <Button variant="secondary" size="sm" onClick={handleRestoreLogo} loading={restoreLogo.isPending}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar logo por defecto
                </Button>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            PNG, JPG o WebP, máximo 2 MB. Se normaliza a PNG.
          </p>
        </div>
      </div>
    </Card>
  )
}