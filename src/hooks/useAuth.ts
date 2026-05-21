import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import type { LoginRequest } from '../types'

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
  })
}

export function useGetMe() {
  return useMutation({
    mutationFn: () => authService.getMe(),
  })
}
