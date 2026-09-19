import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: 12 }}>404</h1>
      <p style={{ color: '#7a6a6e', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}
