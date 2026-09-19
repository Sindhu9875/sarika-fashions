import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'sarika_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1, color = null) => {
    setItems((prev) => {
      const key = `${product.id}-${color || 'default'}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          variant: product.variant,
          color,
          quantity,
        },
      ]
    })
  }

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )
  const shipping = subtotal > 0 && subtotal < 999 ? 75 : 0
  const total = subtotal + shipping
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
