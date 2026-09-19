import React from 'react'
import './InfoPages.css'

export default function Terms() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <h1>Terms & Conditions</h1>
          <p>
            Please read these terms before placing an order.
          </p>
        </div>

        <div className="info-card">

          <h2>Orders</h2>

          <p>
            Orders placed through the website are subject to product
            availability and payment confirmation.
          </p>

          <h2>Product Information</h2>

          <p>
            We make reasonable efforts to display product images,
            colours, descriptions, and prices accurately. Actual colours
            may vary slightly depending on your screen.
          </p>

          <h2>Pricing</h2>

          <p>
            Product prices displayed on the website may change without
            prior notice. The applicable price at checkout will be shown
            before payment.
          </p>

          <h2>Payments</h2>

          <p>
            Online payments are processed securely through Razorpay.
            Orders are confirmed after successful payment verification.
          </p>

          <h2>Order Cancellation</h2>

          <p>
            Cancellation eligibility may depend on the status of your
            order. Please contact us as soon as possible if you need to
            cancel an order.
          </p>

          <p className="info-note">
            Final business terms should be reviewed and approved by
            Sarika Fashions before publication.
          </p>

        </div>

      </div>
    </div>
  )
}