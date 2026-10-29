import api from './api'
import type { Token, LoginRequest } from '../types'

export const authService = {
  register: async (data: {
    email: string
    password: string
    name: string
    first_last_name?: string
    second_last_name?: string | null
    identity_type?: string
    identity_number: string
    phone_number: string
    turnstile_token?: string
  }): Promise<Token> => {
    const { data: response } = await api.post<Token>('/auth/register', data)
    return response
  },

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

  refresh: async (): Promise<Token> => {
    const { data } = await api.post<Token>('/auth/refresh')
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}
