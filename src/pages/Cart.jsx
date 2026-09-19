import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import CartItem from '../components/CartItem.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import { useCart } from '../context/CartContext.jsx'
import './Cart.css'

export default function Cart() {
  const { items, subtotal, shipping, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <ShoppingBag size={56} strokeWidth={1} />
        <h2>Your cart is empty.</h2>
        <p>Looks like you haven't added any sarees yet.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container cart-page">
      <h1 className="section-title">Your Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.key} item={item} />
          ))}
        </div>

        <OrderSummary subtotal={subtotal} shipping={shipping} total={total}>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="cart-continue-link">Continue Shopping</Link>
        </OrderSummary>
      </div>
    </div>
  )
}
