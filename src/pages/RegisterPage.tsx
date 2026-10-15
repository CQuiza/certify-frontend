import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import { Link } from 'react-router-dom'
import { config } from '../config'
import { getErrorMessage } from '../lib/error'

export default function RegisterPage() {
  const { register } = useAuth()
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

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
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
      })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/certify_logo.png" alt="Certify" className="mx-auto mb-3 h-20 w-auto" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear cuenta de estudiante</h1>
          <p className="mt-1 text-sm text-slate-500">Accede a {config.appName} para comprar y cursar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Input label="Nombre" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          <Input label="Apellido" value={form.first_last_name} onChange={(e) => set('first_last_name', e.target.value)} />
          <Input label="Correo electrónico" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de documento</label>
              <select value={form.identity_type} onChange={(e) => set('identity_type', e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {['CC', 'TI', 'CE', 'PPT', 'PASSPORT', 'OTHER'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <Input label="Número" value={form.identity_number} onChange={(e) => set('identity_number', e.target.value)} required />
          </div>
          <Input label="Teléfono" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} required placeholder="+57 300 000 0000" />
          <Input label="Contraseña" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo" />

          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <Button type="submit" loading={loading} className="w-full">
            Crear cuenta
          </Button>
          <p className="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}