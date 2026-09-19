import React from 'react'
import { Check } from 'lucide-react'
import './CheckoutSteps.css'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutSteps({ current }) {
  return (
    <div className="checkout-steps">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const state = stepNum < current ? 'done' : stepNum === current ? 'active' : 'upcoming'
        return (
          <React.Fragment key={label}>
            <div className={`checkout-step checkout-step-${state}`}>
              <span className="checkout-step-circle">
                {state === 'done' ? <Check size={14} /> : stepNum}
              </span>
              <span className="checkout-step-label">{label}</span>
            </div>
            {stepNum < STEPS.length && <div className="checkout-step-line" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}
