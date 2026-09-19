import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, LogOut } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar.jsx'
import './AdminLayout.css'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setLoggingOut(true)

      const response = await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Logout request failed')
      }

      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)

      // Even if the request fails, send the user back to login
      navigate('/admin/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="admin-shell">

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-content">

        <header className="admin-topbar">

          <button
            className="mobile-only btn-icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="admin-topbar-spacer" />

          <button
            className="btn-icon"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          <Link
            to="/"
            className="admin-topbar-avatar"
            title="Back to storefront"
          >
            SF
          </Link>

          <button
            type="button"
            className="btn-icon"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Logout"
            title="Logout"
            style={{
              marginLeft: 4,
              opacity: loggingOut ? 0.6 : 1,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
            }}
          >
            <LogOut size={18} />
          </button>

        </header>

        <div className="admin-page">
          <Outlet />
        </div>

      </div>

    </div>
  )
}