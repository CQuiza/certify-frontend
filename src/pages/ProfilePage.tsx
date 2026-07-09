import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useChangePassword } from '../hooks/useUsers'
import { PASSWORD_RULES, validatePassword, generateSecurePassword } from '../hooks/usePasswordValidation'
import Badge from '../components/atoms/Badge'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import { CheckCircle, XCircle, Sparkles, Eye, EyeOff, User } from 'lucide-react'

const roleLabels: Record<string, string> = {
  superuser: 'Superusuario',
  admin: 'Administrador',
  teacher: 'Profesor',
  student: 'Estudiante',
}

const roleVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  superuser: 'danger',
  admin: 'warning',
  teacher: 'info',
  student: 'default',
}

export default function ProfilePage() {
  const { user } = useAuth()
  const changePassword = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!user) return null

  const passwordErrors = validatePassword(newPassword)
  const allRulesMet = passwordErrors.length === 0 && newPassword.length > 0
  const confirmError = confirmPassword && newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Debes ingresar tu contraseña actual')
      return
    }
    if (!newPassword) {
      toast.error('Debes ingresar una nueva contraseña')
      return
    }
    if (passwordErrors.length > 0) {
      toast.error('La contraseña no cumple los requisitos:\n' + passwordErrors.join('\n'))
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    try {
      await changePassword.mutateAsync({ current_password: currentPassword, new_password: newPassword })
      toast.success('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Error al actualizar la contraseña')
    }
  }

  function handleGenerate() {
    const pw = generateSecurePassword()
    setNewPassword(pw)
    setConfirmPassword(pw)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {[user.name, user.first_last_name, user.second_last_name].filter(Boolean).join(' ') || 'Sin nombre'}
              </h2>
              <Badge variant={roleVariants[user.role] || 'default'}>
                {roleLabels[user.role] || user.role}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Email:</span>
                <p className="text-slate-900">{user.email}</p>
              </div>
              <div>
                <span className="text-slate-500">Teléfono:</span>
                <p className="text-slate-900">{user.phone_number || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500">Identidad:</span>
                <p className="text-slate-900">{user.identity_type} {user.identity_number}</p>
              </div>
              <div>
                <span className="text-slate-500">Miembro desde:</span>
                <p className="text-slate-900">{new Date(user.created_at).toLocaleDateString('es-CO')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input
              label="Contraseña actual"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div>
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Input
                  label="Nueva contraseña"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={handleGenerate}>
                <Sparkles className="h-3.5 w-3.5" />
                Generar
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {newPassword ? (
                PASSWORD_RULES.map((rule) => {
                  const ok = rule.validate(newPassword)
                  return (
                    <div key={rule.key} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ok ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {rule.label}
                    </div>
                  )
                })
              ) : (
                <p className="text-xs text-slate-400">Debe cumplir los requisitos de seguridad</p>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              label="Confirmar nueva contraseña"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmError}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={changePassword.isPending} disabled={!allRulesMet || !!confirmError}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
