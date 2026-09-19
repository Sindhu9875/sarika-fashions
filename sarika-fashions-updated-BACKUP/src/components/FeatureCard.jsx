import React from 'react'
import './FeatureCard.css'

export default function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">
        <Icon size={22} />
      </div>
      <div>
        <h4 className="feature-card-title">{title}</h4>
        <p className="feature-card-text">{text}</p>
      </div>
    </div>
  )
}
