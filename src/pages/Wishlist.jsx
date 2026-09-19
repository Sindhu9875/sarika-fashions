import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import SareeArt from '../components/SareeArt.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProductById } from '../data/products.js'
import './Wishlist.css'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <Heart size={56} strokeWidth={1} />
        <h2>Your wishlist is empty.</h2>
        <p>Save your favourite sarees here to shop them later.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  const handleAddToCart = (item) => {
    const product = getProductById(item.id)
    if (product) addToCart(product, 1)
  }

  return (
    <div className="container wishlist-page">
      <h1 className="section-title">My Wishlist ({items.length})</h1>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <Link to={`/product/${item.id}`} className="wishlist-card-image">
              <SareeArt variant={item.variant} />
            </Link>
            <div className="wishlist-card-body">
              <Link to={`/product/${item.id}`}>
                <h4>{item.name}</h4>
              </Link>
              <p className="wishlist-card-price">₹{item.price.toLocaleString('en-IN')}</p>
              <div className="wishlist-card-actions">
                <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(item)}>
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                <button className="btn-icon" onClick={() => removeFromWishlist(item.id)} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
