import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantService } from '../services/tenantService'
import type { TenantCreate, TenantStatusUpdate } from '../types/tenant'

const QUERY_KEY = ['admin', 'tenants']

export function useTenants() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => tenantService.list(),
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TenantCreate) => tenantService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateTenantStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TenantStatusUpdate }) =>
      tenantService.updateStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useImpersonateTenant() {
  return useMutation({
    mutationFn: (id: number) => tenantService.impersonate(id),
  })
}

export function useStopImpersonation() {
  return useMutation({
    mutationFn: () => tenantService.stop(),
  })
}

export function useActingTenant(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'acting-tenant'],
    queryFn: () => tenantService.acting(),
    ...options,
  })
}