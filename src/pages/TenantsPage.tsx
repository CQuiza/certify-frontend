import { useState } from 'react'
import { toast } from 'sonner'
import { useTenants, useCreateTenant, useUpdateTenantStatus, useImpersonateTenant } from '../hooks/useTenants'
import Card from '../components/molecules/Card'
import Modal from '../components/molecules/Modal'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import Badge from '../components/atoms/Badge'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import { config } from '../config'
import { Building2, Plus, Users, GraduationCap, Award, Power, PowerOff, Eye } from 'lucide-react'
import { formatDate } from '../lib/dates'
import { getErrorMessage } from '../lib/error'
import type { TenantCreate } from '../types/tenant'

const subdomainSuffix = config.rootDomain ? `.${config.rootDomain}` : ''

const emptyForm: TenantCreate = {
  name: '',
  slug: '',
  admin_email: '',
  admin_name: '',
  admin_password: '',
}

export default function TenantsPage() {
  const { data: tenants, isLoading, isError } = useTenants()
  const createTenant = useCreateTenant()
  const updateStatus = useUpdateTenantStatus()
  const impersonate = useImpersonateTenant()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<TenantCreate>(emptyForm)
  const [createdPassword, setCreatedPassword] = useState<string | null>(null)

  function openCreate() {
    setForm(emptyForm)
    setCreatedPassword(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const result = await createTenant.mutateAsync({
        name: form.name,
        slug: form.slug,
        admin_email: form.admin_email,
        admin_name: form.admin_name || null,
        admin_password: form.admin_password || null,
      })
      setCreatedPassword(result.admin_password ?? null)
      toast.success('Organización creada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleToggle(t: { id: number; is_active: boolean }) {
    try {
      await updateStatus.mutateAsync({ id: t.id, payload: { is_active: !t.is_active } })
      toast.success(t.is_active ? 'Organización desactivada' : 'Organización activada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleImpersonate(t: { id: number; slug: string; name: string }) {
    try {
      await impersonate.mutateAsync(t.id)
      toast.success(`Entrando a ${t.name}`)
      // La cookie acting_tenant se comparte por subdominios (navegador).
      if (config.rootDomain && t.slug !== 'default') {
        window.location.assign(`https://${t.slug}.${config.rootDomain}`)
      } else {
        window.location.reload()
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizaciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tenants que alquilan la plataforma (SaaS). Sus datos están aislados entre sí.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nueva organización
        </Button>
      </div>

      {isError && <ErrorState className="mb-6" />}

      <Card padding={false}>
        {isLoading ? (
          <div className="space-y-4 p-6"><Skeleton count={5} className="h-12 w-full" /></div>
        ) : !tenants || tenants.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No hay organizaciones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Organización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Subdominio</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-slate-500">Usuarios</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-slate-500">Cursos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-slate-500">Certificados</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-slate-500">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">creado {t.created_at ? formatDate(t.created_at) : '—'}</p>
                    </td>
                    <td className="px-6 py-3">
<span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {subdomainSuffix ? `${t.slug}${subdomainSuffix}` : t.slug}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600"><Users className="h-3.5 w-3.5" />{t.total_users}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600"><GraduationCap className="h-3.5 w-3.5" />{t.total_courses}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600"><Award className="h-3.5 w-3.5" />{t.total_certificates}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={t.is_active ? 'success' : 'danger'}>{t.is_active ? 'Activa' : 'Inactiva'}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleImpersonate(t)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                          title="Entrar al tenant como superuser"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver como
                        </button>
                        <button
                          onClick={() => handleToggle(t)}
                          disabled={t.slug === 'default'}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                          title={t.slug === 'default' ? 'El tenant por defecto no se puede desactivar' : (t.is_active ? 'Desactivar' : 'Activar')}
                        >
                          {t.is_active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                          {t.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva organización">
        {createdPassword ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Organización creada correctamente. Esta es la contraseña del administrador
              (solo se muestra una vez; guárdala antes de cerrar):
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <code className="font-mono text-sm text-slate-800">{createdPassword}</code>
              <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(createdPassword); toast.success('Contraseña copiada') }}>
                Copiar
              </Button>
            </div>
            <Button onClick={() => { setModalOpen(false); setCreatedPassword(null) }}>Cerrar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre de la organización" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Fundación Educativa ACME" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Subdominio / slug</label>
              <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 focus-within:ring-2 focus-within:ring-indigo-500">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
                  required
                  placeholder="acme"
                />
                <span className="text-xs text-slate-400">{subdomainSuffix}</span>
              </div>
              <p className="text-xs text-slate-500">Solo minúsculas, números y guiones. Será el subdominio <code className="rounded bg-slate-100 px-1">{'{slug}'}</code>.</p>
            </div>
            <Input label="Email del administrador" type="email" value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} required placeholder="admin@organizacion.com" />
            <Input label="Nombre del administrador" value={form.admin_name ?? ''} onChange={(e) => setForm({ ...form, admin_name: e.target.value })} placeholder="Nombre del admin" />
            <Input label="Contraseña inicial (opcional)" type="text" value={form.admin_password ?? ''} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} placeholder="Se genera automáticamente si se deja vacía" />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={createTenant.isPending}>Crear organización</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}