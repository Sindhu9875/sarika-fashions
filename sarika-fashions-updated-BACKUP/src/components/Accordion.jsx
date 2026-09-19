import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './Accordion.css'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={item.title} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            aria-expanded={openIndex === i}
          >
            <span>{item.title}</span>
            <ChevronDown size={18} className={openIndex === i ? 'is-open' : ''} />
          </button>
          {openIndex === i && <div className="accordion-content">{item.content}</div>}
        </div>
      ))}
    </div>
  )
}
