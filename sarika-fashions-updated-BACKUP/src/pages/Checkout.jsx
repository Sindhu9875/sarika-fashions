import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import CheckoutSteps from '../components/CheckoutSteps.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import { useCart } from '../context/CartContext.jsx'
import './Checkout.css'

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart()

  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  // =========================
  // EMPTY CART
  // =========================

  if (items.length === 0 && !placed) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty.</h2>

        <p>
          Add some sarees before checking out.
        </p>

        <Link
          to="/shop"
          className="btn btn-primary"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  // =========================
  // VALIDATE ADDRESS
  // =========================

  const validateAddress = () => {
    const next = {}

    if (!address.fullName.trim()) {
      next.fullName = 'Full name is required'
    }

    if (!/^\d{10}$/.test(address.phone.trim())) {
      next.phone = 'Enter a valid 10-digit phone number'
    }

    if (!address.address.trim()) {
      next.address = 'Address is required'
    }

    if (!address.city.trim()) {
      next.city = 'City is required'
    }

    if (!address.state.trim()) {
      next.state = 'State is required'
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      next.pincode = 'Enter a valid 6-digit pincode'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  // =========================
  // SHIPPING SUBMIT
  // =========================

  const handleShippingSubmit = (e) => {
    e.preventDefault()

    if (validateAddress()) {
      setStep(2)
    }
  }

  // =========================
  // UPDATE ADDRESS
  // =========================

  const update = (field) => (e) => {
    setAddress((a) => ({
      ...a,
      [field]: e.target.value,
    }))
  }

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  const handlePlaceOrder = async () => {
    try {
      setPaymentLoading(true)

      // Create Razorpay order through Flask backend
      const response = await axios.post(
        'http://127.0.0.1:5000/api/payment/create-order',
        {
          amount: total,
        }
      )

      const {
        order_id,
        amount,
        currency,
        key_id,
      } = response.data

      // Check Razorpay Checkout
      if (!window.Razorpay) {
        alert(
          'Razorpay Checkout failed to load. Please refresh the page.'
        )

        setPaymentLoading(false)
        return
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================

      const options = {
        key: key_id,

        amount: amount,

        currency: currency,

        name: 'Sarika Fashions',

        description: 'Saree Purchase',

        order_id: order_id,

        // =========================
        // SHOW ALL PAYMENT METHODS
        // (UPI, Cards, Netbanking, Wallets)
        // =========================

        config: {
          display: {
            blocks: {
              banks: {
                name: 'Payment Methods',

                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },

            sequence: ['block.banks'],

            preferences: {
              show_default_blocks: true,
            },
          },
        },

        // =========================
        // CUSTOMER DETAILS
        // =========================

        prefill: {
          name: address.fullName,

          contact: address.phone,
        },

        // =========================
        // RAZORPAY THEME
        // =========================

        theme: {
          color: '#8E1748',
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================

        handler: function (paymentResponse) {
          console.log(
            'Razorpay payment response:',
            paymentResponse
          )

          setPaymentLoading(false)

          setPlaced(true)

          clearCart()
        },

        // =========================
        // PAYMENT MODAL CLOSED
        // =========================

        modal: {
          ondismiss: function () {
            setPaymentLoading(false)
          },
        },
      }

      // =========================
      // CREATE RAZORPAY INSTANCE
      // =========================

      const razorpay = new window.Razorpay(options)

      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on(
        'payment.failed',
        function (response) {
          console.error(
            'Payment failed:',
            response.error
          )

          alert(
            response.error?.description ||
            'Payment failed. Please try again.'
          )

          setPaymentLoading(false)
        }
      )

      // =========================
      // OPEN RAZORPAY
      // =========================

      razorpay.open()

    } catch (error) {
      console.error(
        'Payment error:',
        error
      )

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to start payment. Please try again.'
      )

      setPaymentLoading(false)
    }
  }

  // =========================
  // PAYMENT SUCCESS PAGE
  // =========================

  if (placed) {
    return (
      <div className="container empty-state">

        <CheckCircle2
          size={56}
          color="var(--color-success)"
          strokeWidth={1.4}
        />

        <h2>
          Order Placed Successfully!
        </h2>

        <p>
          Your payment was successful.
          Thank you for shopping with
          Sarika Fashions.
        </p>

        <Link
          to="/shop"
          className="btn btn-primary"
        >
          Continue Shopping
        </Link>

      </div>
    )
  }

  // =========================
  // CHECKOUT PAGE
  // =========================

  return (
    <div className="container checkout-page">

      <h1 className="section-title">
        Checkout
      </h1>

      <CheckoutSteps current={step} />

      <div className="checkout-layout">

        {/* =================================
            MAIN CHECKOUT
        ================================= */}

        <div className="checkout-main">

          {/* =================================
              STEP 1 - SHIPPING ADDRESS
          ================================= */}

          {step === 1 && (
            <form
              className="checkout-card"
              onSubmit={handleShippingSubmit}
            >

              <h3>
                Shipping Address
              </h3>

              {/* FULL NAME */}

              <div className="field">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  value={address.fullName}
                  onChange={update('fullName')}
                  className={
                    errors.fullName
                      ? 'has-error'
                      : ''
                  }
                />

                {errors.fullName && (
                  <div className="field-error">
                    {errors.fullName}
                  </div>
                )}

              </div>

              {/* PHONE */}

              <div className="field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  value={address.phone}
                  onChange={update('phone')}
                  className={
                    errors.phone
                      ? 'has-error'
                      : ''
                  }
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />

                {errors.phone && (
                  <div className="field-error">
                    {errors.phone}
                  </div>
                )}

              </div>

              {/* ADDRESS */}

              <div className="field">

                <label htmlFor="address">
                  Address
                </label>

                <input
                  id="address"
                  value={address.address}
                  onChange={update('address')}
                  className={
                    errors.address
                      ? 'has-error'
                      : ''
                  }
                />

                {errors.address && (
                  <div className="field-error">
                    {errors.address}
                  </div>
                )}

              </div>

              {/* CITY + STATE */}

              <div className="field-row">

                <div className="field">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    value={address.city}
                    onChange={update('city')}
                    className={
                      errors.city
                        ? 'has-error'
                        : ''
                    }
                  />

                  {errors.city && (
                    <div className="field-error">
                      {errors.city}
                    </div>
                  )}

                </div>

                <div className="field">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    value={address.state}
                    onChange={update('state')}
                    className={
                      errors.state
                        ? 'has-error'
                        : ''
                    }
                  />

                  {errors.state && (
                    <div className="field-error">
                      {errors.state}
                    </div>
                  )}

                </div>

              </div>

              {/* PINCODE */}

              <div className="field">

                <label htmlFor="pincode">
                  Pincode
                </label>

                <input
                  id="pincode"
                  value={address.pincode}
                  onChange={update('pincode')}
                  className={
                    errors.pincode
                      ? 'has-error'
                      : ''
                  }
                  placeholder="6-digit pincode"
                  maxLength="6"
                />

                {errors.pincode && (
                  <div className="field-error">
                    {errors.pincode}
                  </div>
                )}

              </div>

              {/* CONTINUE */}

              <button
                type="submit"
                className="btn btn-primary btn-block"
              >
                Continue to Payment
              </button>

            </form>
          )}

          {/* =================================
              STEP 2 - PAYMENT
          ================================= */}

          {step === 2 && (
            <div className="checkout-card">

              <h3>
                Payment
              </h3>

              <div className="razorpay-info">

                <h4>
                  Secure Payment
                </h4>

                <p>
                  Click the button below to continue
                  to Razorpay's secure payment checkout.
                </p>

                <p>
                  You can pay securely using UPI,
                  including PhonePe and Google Pay
                  where supported by Razorpay.
                </p>

              </div>

              <div className="checkout-actions">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                  disabled={paymentLoading}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={paymentLoading}
                >
                  Review Order
                </button>

              </div>

            </div>
          )}

          {/* =================================
              STEP 3 - REVIEW ORDER
          ================================= */}

          {step === 3 && (
            <div className="checkout-card">

              <h3>
                Review Your Order
              </h3>

              {/* SHIPPING DETAILS */}

              <div className="review-block">

                <h4>
                  Shipping To
                </h4>

                <p>
                  {address.fullName},{' '}
                  {address.phone}
                </p>

                <p>
                  {address.address},{' '}
                  {address.city},{' '}
                  {address.state} -{' '}
                  {address.pincode}
                </p>

              </div>

              {/* PAYMENT DETAILS */}

              <div className="review-block">

                <h4>
                  Payment
                </h4>

                <p>
                  Secure payment via Razorpay
                </p>

                <p>
                  UPI supported, including
                  PhonePe and Google Pay
                  where available.
                </p>

              </div>

              {/* ITEMS */}

              <div className="review-block">

                <h4>
                  Items ({items.length})
                </h4>

                {items.map((item) => (
                  <div
                    className="review-item"
                    key={item.key}
                  >

                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString('en-IN')}
                    </span>

                  </div>
                ))}

              </div>

              {/* ACTIONS */}

              <div className="checkout-actions">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(2)}
                  disabled={paymentLoading}
                >
                  Back
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? 'Opening Payment...'
                    : `Pay ₹${total.toLocaleString('en-IN')}`}
                </button>

              </div>

            </div>
          )}

        </div>

        {/* =================================
            ORDER SUMMARY
        ================================= */}

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
        />

      </div>

    </div>
  )
}