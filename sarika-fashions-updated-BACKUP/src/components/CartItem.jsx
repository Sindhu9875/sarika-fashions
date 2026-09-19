import React from 'react'
import { Trash2 } from 'lucide-react'
import QuantitySelector from './QuantitySelector.jsx'
import { useCart } from '../context/CartContext.jsx'
import './CartItem.css'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="cart-item">
    <div className="cart-item-image">
  <img
    src={item.image}
    alt={item.name}
    className="cart-product-image"
  />
</div>
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        {item.color && <p className="cart-item-color">Color: {item.color}</p>}
        <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
      </div>
      <div className="cart-item-controls">
        <QuantitySelector
          value={item.quantity}
          onChange={(q) => updateQuantity(item.key, q)}
        />
        <button className="cart-item-remove" onClick={() => removeFromCart(item.key)} aria-label="Remove item">
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  )
}
