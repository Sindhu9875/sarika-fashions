import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import SareeArt from './SareeArt.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  const image = product.image || product.images?.[0]

  return (
    <Link to={`/product/${product.id}`} className="product-card">

      <div className="product-card-image">

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="product-card-real-image"
          />
        ) : (
          <SareeArt variant={product.variant || 0} />
        )}

        {product.discount > 0 && (
          <span className="product-card-discount">
            {product.discount}% OFF
          </span>
        )}

        <button
          className={`product-card-wishlist ${
            wishlisted ? 'is-active' : ''
          }`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={17}
            fill={
              wishlisted
                ? 'var(--color-primary)'
                : 'none'
            }
          />
        </button>

      </div>

      <div className="product-card-body">

        <h4 className="product-card-name">
          {product.name}
        </h4>

        <div className="product-card-rating">

          <Star
            size={13}
            fill="var(--color-gold)"
            stroke="var(--color-gold)"
          />

          <span>
            {product.rating || 0}
          </span>

          <span className="product-card-reviews">
            ({product.reviews || 0})
          </span>

        </div>

        <div className="product-card-prices">

          <span className="product-card-price">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          {Number(product.originalPrice) > Number(product.price) && (
            <span className="product-card-original">
              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
            </span>
          )}

        </div>

        <button
          className="btn btn-primary btn-block btn-sm product-card-cta"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>

      </div>

    </Link>
  )
}