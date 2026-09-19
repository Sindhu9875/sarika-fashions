import React from 'react'
import { Truck } from 'lucide-react'
import './InfoPages.css'

export default function ShippingPolicy() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <Truck size={38} />
          <h1>Shipping Policy</h1>
          <p>
            Information about order processing and delivery.
          </p>
        </div>

        <div className="info-card">

          <h2>Order Processing</h2>

          <p>
            Orders are processed after successful payment confirmation.
            Processing time may vary depending on order volume and
            product availability.
          </p>

          <h2>Delivery</h2>

          <p>
            Orders are shipped to the address provided during checkout.
            Delivery timelines depend on the destination and courier
            service.
          </p>

          <h2>Tracking</h2>

          <p>
            Once your order is dispatched, tracking information may be
            provided so that you can follow your shipment.
          </p>

          <h2>Delivery Delays</h2>

          <p>
            Delays may occasionally occur because of weather, courier
            issues, holidays, or other circumstances outside our control.
          </p>

          <p className="info-note">
            Final delivery timelines and shipping charges should be
            confirmed by Sarika Fashions before publishing.
          </p>

        </div>

      </div>
    </div>
  )
}