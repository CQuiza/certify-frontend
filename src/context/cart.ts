import { createContext, useContext } from 'react'

export interface CartItem {
  id: number
  title: string
  price: number
}

export interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  add: (item: CartItem) => void
  remove: (id: number) => void
  clear: () => void
  removeMany: (ids: number[]) => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}