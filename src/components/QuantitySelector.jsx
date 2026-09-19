import React from 'react'
import { Minus, Plus } from 'lucide-react'
import './QuantitySelector.css'

export default function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="qty-selector">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
