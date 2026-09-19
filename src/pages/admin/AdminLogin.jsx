import React, { useEffect, useState } from 'react'
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()

  const {
    login,
    isAdmin,
    loading,
  } = useAdminAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin', {
        replace: true,
      })
    }
  }, [loading, isAdmin, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Please enter your admin email.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setSubmitting(true)

    const result = await login(
      email.trim(),
      password
    )

    setSubmitting(false)

    if (!result.success) {
      setError(
        result.message ||
        'Invalid email or password.'
      )
      return
    }

    navigate('/admin', {
      replace: true,
    })
  }

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-loading">
          Checking admin access...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-icon">
          <ShieldCheck size={30} />
        </div>

        <div className="admin-login-heading">
          <h1>Admin Login</h1>

          <p>
            Sign in to manage Sarika Fashions
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-login-form"
        >

          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-login-input-wrapper">
              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter admin email"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-login-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="admin-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter admin password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={submitting}
          >
            {submitting
              ? 'Signing in...'
              : 'Sign In'}
          </button>

        </form>

        <div className="admin-login-security">
          <ShieldCheck size={16} />

          <span>
            Secure administrator access
          </span>
        </div>

      </div>
    </div>
  )
}