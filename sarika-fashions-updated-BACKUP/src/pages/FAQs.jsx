import React from 'react'
import './InfoPages.css'

const faqs = [
  {
    question: 'How can I place an order?',
    answer:
      'Browse our sarees, select the product you love, add it to your cart, and proceed to checkout.',
  },
  {
    question: 'What payment methods are available?',
    answer:
      'Online payments can be made securely through Razorpay using the payment methods supported at checkout.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Use the Track Order page with your order ID once your order has been shipped.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery time depends on your location and courier availability. You will receive tracking information after dispatch.',
  },
  {
    question: 'Can I return a saree?',
    answer:
      'Returns depend on the condition of the product and the applicable return policy. Please contact us if you receive a damaged or incorrect item.',
  },
  {
    question: 'How do I contact Sarika Fashions?',
    answer:
      'You can contact us through the Contact Us page, phone, or email provided in the website footer.',
  },
]

export default function FAQs() {
  return (
    <div className="info-page">
      <div className="info-container">

        <div className="info-hero">
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about your orders.
          </p>
        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>

              <h2>{faq.question}</h2>

              <p>{faq.answer}</p>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}