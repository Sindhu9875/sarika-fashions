import React from 'react'
import { RotateCcw } from 'lucide-react'
import './InfoPages.css'

export default function RefundPolicy() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <RotateCcw size={38} />
          <h1>Refund & Cancellation</h1>
          <p>
            Information about cancellations and refunds.
          </p>
        </div>

        <div className="info-card">

          <h2>Cancellation</h2>

          <p>
            If you need to cancel your order, please contact us as soon
            as possible. Cancellation may not be possible after the order
            has been dispatched.
          </p>

          <h2>Refunds</h2>

          <p>
            If a refund is approved, it will be processed according to
            the applicable payment and refund procedure.
          </p>

          <h2>Damaged or Incorrect Products</h2>

          <p>
            If your order arrives damaged or you receive an incorrect
            product, please contact Sarika Fashions promptly with the
            relevant order details.
          </p>

          <h2>Refund Timeline</h2>

          <p>
            Once a refund is approved, the time required for the amount
            to appear in your account may depend on the payment provider
            and your bank.
          </p>

          <p className="info-note">
            Final cancellation, return, and refund conditions must be
            confirmed by the business owner before publishing.
          </p>

        </div>

      </div>
    </div>
  )
}