import api from './api'
import type { Token, LoginRequest } from '../types'

export const authService = {
  login: async (data: LoginRequest): Promise<Token> => {
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)
    const { data: response } = await api.post<Token>('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response
  },

  getMe: async <T = unknown>(): Promise<T> => {
    const { data } = await api.get<T>('/auth/me')
    return data
  },
}
