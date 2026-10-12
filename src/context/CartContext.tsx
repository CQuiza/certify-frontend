import { useEffect, useState, type ReactNode } from 'react'
import { CartContext, type CartItem } from './cart'

const STORAGE_KEY = 'certify_cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const count = items.length
  const total = items.reduce((acc, i) => acc + i.price, 0)

  function add(item: CartItem) {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]))
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clear() {
    setItems([])
  }

  function removeMany(ids: number[]) {
    const set = new Set(ids)
    setItems((prev) => prev.filter((i) => !set.has(i.id)))
  }

  return (
    <CartContext.Provider value={{ items, count, total, add, remove, clear, removeMany }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider