import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, MenuItem } from '../types'

interface CartContextValue {
  cart: CartItem[]
  addItem: (item: MenuItem, quantity: number, customizations?: Record<string, string[]>) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  totalCents: number
  itemCount: number
  openCartAfterAdd: boolean
  setOpenCartAfterAdd: (v: boolean) => void
  lastAddedImage: string | null
  clearLastAdded: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function getItemUnitPrice(cartItem: CartItem): number {
  let unit = cartItem.item.price
  if (cartItem.selectedCustomizations && cartItem.item.customizations) {
    for (const group of cartItem.item.customizations) {
      const selected = cartItem.selectedCustomizations[group.id] ?? []
      for (const optId of selected) {
        const opt = group.options.find((o) => o.id === optId)
        if (opt) unit += opt.priceModifier
      }
    }
  }
  return unit
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [openCartAfterAdd, setOpenCartAfterAdd] = useState(false)
  const [lastAddedImage, setLastAddedImage] = useState<string | null>(null)

  const addItem = useCallback(
    (item: MenuItem, quantity: number, customizations?: Record<string, string[]>) => {
      setCart((prev) => [
        ...prev,
        { item, quantity, selectedCustomizations: customizations },
      ])
      setLastAddedImage(item.image)
    },
    []
  )

  const clearLastAdded = useCallback(() => setLastAddedImage(null), [])

  const removeItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index))
    } else {
      setCart((prev) => prev.map((ci, i) => (i === index ? { ...ci, quantity } : ci)))
    }
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalCents = useMemo(
    () => cart.reduce((sum, ci) => sum + getItemUnitPrice(ci) * ci.quantity, 0),
    [cart]
  )

  const itemCount = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.quantity, 0),
    [cart]
  )

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalCents, itemCount, openCartAfterAdd, setOpenCartAfterAdd, lastAddedImage, clearLastAdded }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export { getItemUnitPrice }
