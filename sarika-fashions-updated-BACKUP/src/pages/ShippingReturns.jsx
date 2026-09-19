
import React from 'react'
import { Truck, RotateCcw } from 'lucide-react'
import './InfoPages.css'

export default function ShippingReturns() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <Truck size={38} />
          <h1>Shipping & Returns</h1>
          <p>Everything you need to know about delivery and returns.</p>
        </div>

        <div className="info-card">
          <h2>Shipping</h2>

          <p>
            We carefully pack every order before dispatch to make sure
            your saree reaches you safely.
          </p>

          <h3>Order Processing</h3>

          <p>
            Orders are processed after payment confirmation. Delivery
            timelines may vary depending on your location and courier
            availability.
          </p>

          <h3>Delivery</h3>

          <p>
            Once your order has been dispatched, tracking details may
            be shared with you through the contact information provided
            during checkout.
          </p>
        </div>

        <div className="info-card">
          <div className="info-card-heading">
            <RotateCcw size={22} />
            <h2>Returns</h2>
          </div>

          <p>
            If you receive a damaged, incorrect, or defective product,
            please contact us as soon as possible after delivery.
          </p>

          <p>
            Return eligibility depends on the condition of the product
            and the reason for the return.
          </p>

          <p className="info-note">
            Please confirm the final return and exchange conditions
            with Sarika Fashions before publishing this policy.
          </p>
        </div>

      </div>
    </div>
  )
}
