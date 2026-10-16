import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePublicBranding } from '../hooks/useConfiguration'
import { configurationService } from '../services/configurationService'
import { config } from '../config'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import AuthShowcase from '../components/organisms/AuthShowcase'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../lib/error'

export default function LoginPage() {
  const { login } = useAuth()
  const { data: pub } = usePublicBranding()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const logoSrc = pub?.has_custom_logo ? configurationService.getPublicLogoUrl() : '/certify_logo.png'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <img src={logoSrc} alt={config.appName} className="mx-auto mb-4 h-20 w-auto max-w-full object-contain" />
            <p className="text-sm text-slate-500">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
            <p className="text-center text-sm text-slate-500">
              ¿Eres estudiante y no tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Crea una aquí</Link>
            </p>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Servicio prestado por {config.appName}
          </p>
        </div>
      </div>
      <AuthShowcase />
    </div>
  )
}
