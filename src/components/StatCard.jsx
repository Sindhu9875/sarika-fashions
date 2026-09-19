import React from 'react'
import './StatCard.css'

export default function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <Icon size={20} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </div>
  )
}
