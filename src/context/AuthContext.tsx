import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { enrollmentService } from '../services/enrollmentService'
import { broadcastLogout, onAuthMessage } from '../lib/authChannel'
import { setSentryUser } from '../lib/sentry'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    name: string
    first_last_name?: string
    second_last_name?: string | null
    identity_type?: string
    identity_number: string
    phone_number: string
    birth_date: string
    turnstile_token?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getMinimalUser(): User | null {
  const uid = localStorage.getItem('_uid')
  const role = localStorage.getItem('_role')
  if (!uid || !role) return null
  return { id: Number(uid), role } as User
}

function storeMinimalUser(u: User): void {
  localStorage.setItem('_uid', String(u.id))
  localStorage.setItem('_role', u.role)
}

function clearStoredUser(): void {
  localStorage.removeItem('_uid')
  localStorage.removeItem('_role')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getMinimalUser)
  const navigate = useNavigate()

  useEffect(() => {
    const uid = localStorage.getItem('_uid')
    if (uid) {
      authService.getMe<User>()
        .then((u) => { setUser(u); storeMinimalUser(u); setSentryUser(u) })
        .catch(() => { setUser(null); clearStoredUser(); setSentryUser(null) })
    }
  }, [])

  useEffect(
    () =>
      onAuthMessage((message) => {
        if (message.type === 'logout') {
          setUser(null)
          clearStoredUser()
          setSentryUser(null)
          navigate('/login')
        }
      }),
    [navigate],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      await authService.login({ username: email, password })

      let u: User | null
      try {
        u = await authService.getMe<User>()
      } catch {
        throw new Error('No se pudo obtener la información del usuario')
      }

      if (u) {
        storeMinimalUser(u)
      }
      setUser(u)
      setSentryUser(u)

      if (!u) {
        navigate('/login')
        return
      }

      const role = u.role
      if (role === 'superuser' || role === 'admin') {
        navigate('/dashboard')
      } else if (role === 'teacher') {
        navigate('/courses')
      } else {
        let hasCourses = false
        try {
          const enrollments = await enrollmentService.list({ limit: 1 })
          hasCourses = enrollments.length > 0
        } catch {
          // sin confirmación de inscripciones se asume que no tiene cursos
        }
        navigate(hasCourses ? '/courses' : '/catalog')
      }
    },
    [navigate],
  )

  const register = useCallback(
    async (data: {
      email: string
      password: string
      name: string
      first_last_name?: string
      second_last_name?: string | null
      identity_type?: string
      identity_number: string
      phone_number: string
      birth_date: string
      turnstile_token?: string
    }) => {
      await authService.register(data)

      const u = await authService.getMe<User>()
      if (u) storeMinimalUser(u)
      setUser(u)
      setSentryUser(u)
      navigate('/catalog')
    },
    [navigate],
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignora errores de logout, igual limpiamos sesión local
    }
    clearStoredUser()
    setUser(null)
    setSentryUser(null)
    broadcastLogout()
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
