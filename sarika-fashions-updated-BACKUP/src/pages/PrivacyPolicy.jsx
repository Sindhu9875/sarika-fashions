import React from 'react'
import './InfoPages.css'

export default function PrivacyPolicy() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <h1>Privacy Policy</h1>
          <p>Your privacy matters to us.</p>
        </div>

        <div className="info-card">

          <h2>Information We Collect</h2>

          <p>
            When you place an order or contact us, we may collect
            information such as your name, phone number, email address,
            shipping address, and order details.
          </p>

          <h2>How We Use Your Information</h2>

          <p>
            Your information may be used to process orders, arrange
            delivery, provide customer support, and communicate with
            you about your order.
          </p>

          <h2>Payment Information</h2>

          <p>
            Online payments are processed through Razorpay. Payment
            information is handled through the payment provider's
            secure systems.
          </p>

          <h2>Data Security</h2>

          <p>
            We take reasonable steps to protect the information
            provided to us and use it only for legitimate business
            purposes.
          </p>

          <h2>Policy Updates</h2>

          <p>
            This privacy policy may be updated when necessary to reflect
            changes in our services or legal requirements.
          </p>

          <p className="info-note">
            This page should be reviewed and approved by the business
            owner before the website goes live.
          </p>

        </div>

      </div>
    </div>
  )
}