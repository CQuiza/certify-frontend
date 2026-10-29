import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePublicBranding } from '../hooks/useConfiguration'
import { configurationService } from '../services/configurationService'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import AuthShowcase from '../components/organisms/AuthShowcase'
import DeveloperCredit from '../components/molecules/DeveloperCredit'
import TurnstileWidget from '../components/molecules/TurnstileWidget'
import { Link } from 'react-router-dom'
import { config } from '../config'
import { getErrorMessage } from '../lib/error'

export default function RegisterPage() {
  const { register } = useAuth()
  const { data: pub } = usePublicBranding()
  const logoSrc = pub?.has_custom_logo ? configurationService.getPublicLogoUrl() : '/app_logo.png'
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    first_last_name: '',
    identity_type: 'CC',
    identity_number: '',
    phone_number: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReset, setTurnstileReset] = useState(0)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (config.turnstileSiteKey && !turnstileToken) {
      setError('Completa la verificación de seguridad.')
      return
    }
    setLoading(true)
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        first_last_name: form.first_last_name || undefined,
        identity_type: form.identity_type,
        identity_number: form.identity_number,
        phone_number: form.phone_number,
        turnstile_token: turnstileToken || undefined,
      })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
      setTurnstileToken('')
      setTurnstileReset((value) => value + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AuthShowcase />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link to="/home" aria-label={config.appName} className="inline-block transition-opacity hover:opacity-80">
              <img src={logoSrc} alt={config.appName} className="mx-auto mb-3 h-20 w-auto max-w-full object-contain" />
            </Link>
            <p className="text-sm text-slate-500">Crea tu cuenta de estudiante</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <Input label="Nombre" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            <Input label="Apellido" value={form.first_last_name} onChange={(e) => set('first_last_name', e.target.value)} />
            <Input label="Correo electrónico" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de documento</label>
                <select value={form.identity_type} onChange={(e) => set('identity_type', e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {['CC', 'TI', 'CE', 'PPT', 'PASSPORT', 'OTHER'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input label="Número" value={form.identity_number} onChange={(e) => set('identity_number', e.target.value)} required />
            </div>
            <Input label="Teléfono" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} required placeholder="+57 300 000 0000" />
            <Input label="Contraseña" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo" />

            <TurnstileWidget
              siteKey={config.turnstileSiteKey}
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken('')}
              onError={() =>
                setError('No se pudo cargar la verificación de seguridad. Recarga la página.')
              }
              resetSignal={turnstileReset}
            />

            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <Button type="submit" loading={loading} className="w-full">
              Crear cuenta
            </Button>
            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes cuenta? <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">Inicia sesión</Link>
            </p>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Servicio prestado por {config.appName}
          </p>
          <DeveloperCredit className="mt-4" />
        </div>
      </div>
    </div>
  )
}
