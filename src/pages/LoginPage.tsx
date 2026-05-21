import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Award } from 'lucide-react'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        typeof err === 'string' ? err :
        'Credenciales inválidas. Intenta de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
              <Award className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Certify</h1>
            <p className="mt-1 text-sm text-slate-500">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        </div>
      </div>
      <div className="hidden flex-1 bg-indigo-600 lg:flex items-center justify-center">
        <div className="max-w-md text-center text-white">
          <Award className="mx-auto mb-6 h-16 w-16 opacity-80" />
          <h2 className="text-3xl font-bold">Plataforma de Certificación</h2>
          <p className="mt-3 text-lg text-indigo-200">
            Gestiona cursos, usuarios y certificados de forma centralizada.
          </p>
        </div>
      </div>
    </div>
  )
}
