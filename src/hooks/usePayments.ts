import { useQuery, useMutation } from '@tanstack/react-query'
import { paymentService } from '../services/paymentService'

export function useCheckout() {
  return useMutation({
    mutationFn: (courseIds: number[]) => paymentService.checkout(courseIds),
  })
}

export function useRenewCheckout() {
  return useMutation({
    mutationFn: (certificateId: number) => paymentService.renewCheckout(certificateId),
  })
}

export function useOrder(orderId: number, options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: () => paymentService.getOrder(orderId),
    enabled: options?.enabled ?? orderId > 0,
    refetchInterval: options?.refetchInterval,
  })
}