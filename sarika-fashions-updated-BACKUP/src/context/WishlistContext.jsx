import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'sarika_wishlist'

export function WishlistProvider({ children }) {
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

  const isWishlisted = (id) => items.some((i) => i.id === id)

  const toggleWishlist = (product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) {
        return prev.filter((i) => i.id !== product.id)
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          variant: product.variant,
        },
      ]
    })
  }

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const value = { items, isWishlisted, toggleWishlist, removeFromWishlist, count: items.length }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
