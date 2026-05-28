import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getInitialState(): AuthState {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  let user: User | null = null
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User
    } catch {
      localStorage.removeItem('user')
    }
  }
  return { user, token, isAuthenticated: !!token }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState)
  const navigate = useNavigate()

  const login = useCallback(
    async (email: string, password: string) => {
      const token = await authService.login({ username: email, password })
      localStorage.setItem('token', token.access_token)

      let user: User | null = null
      try {
        user = await authService.getMe<User>()
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('No se pudo obtener la información del usuario')
      }

      localStorage.setItem('user', JSON.stringify(user))
      setState({ user, token: token.access_token, isAuthenticated: true })

      if (!user) {
        navigate('/dashboard')
        return
      }

      const role = user.role
      if (role === 'superuser' || role === 'admin') {
        navigate('/dashboard')
      } else if (role === 'teacher') {
        navigate('/courses')
      } else {
        navigate('/dashboard')
      }
    },
    [navigate],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setState({ user: null, token: null, isAuthenticated: false })
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
