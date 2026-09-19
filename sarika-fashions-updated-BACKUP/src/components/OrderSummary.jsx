import React from 'react'
import './OrderSummary.css'

export default function OrderSummary({ subtotal, shipping, total, children }) {
  return (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="order-summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
      </div>
      <div className="order-summary-divider" />
      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <span>₹{total.toLocaleString('en-IN')}</span>
      </div>
      {children}
    </div>
  )
}
