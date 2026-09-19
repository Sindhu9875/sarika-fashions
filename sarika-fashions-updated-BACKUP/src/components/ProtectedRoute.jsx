import React from 'react'
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { useAdminAuth } from '../context/AdminAuthContext.jsx'

export default function ProtectedRoute() {
  const {
    isAdmin,
    loading,
  } = useAdminAuth()

  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
        }}
      >
        Checking admin access...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  return <Outlet />
}