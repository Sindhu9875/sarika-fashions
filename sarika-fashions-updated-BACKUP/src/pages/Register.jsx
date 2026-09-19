import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SareeArt from '../components/SareeArt.jsx'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address'
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Placeholder: real registration call goes here once backend is connected.
      navigate('/login')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual desktop-only">
        <SareeArt variant={4} />
        <div className="auth-visual-overlay">
          <h2>Join the Sarika Fashions Family</h2>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-box">
          <Link to="/" className="auth-logo">Sarika Fashions</Link>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Sign up to start your saree shopping journey.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" value={form.fullName} onChange={update('fullName')} className={errors.fullName ? 'has-error' : ''} />
              {errors.fullName && <div className="field-error">{errors.fullName}</div>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={update('email')} className={errors.email ? 'has-error' : ''} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={form.phone} onChange={update('phone')} className={errors.phone ? 'has-error' : ''} placeholder="10-digit mobile number" />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={form.password} onChange={update('password')} className={errors.password ? 'has-error' : ''} />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className={errors.confirmPassword ? 'has-error' : ''} />
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">Register</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
