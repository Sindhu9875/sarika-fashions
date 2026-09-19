import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const API_BASE = 'http://127.0.0.1:5000/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAdmin = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/admin/me`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        setAdmin(null)
        return
      }

      const data = await response.json()

      if (
        data.status === 'success' &&
        data.authenticated
      ) {
        setAdmin(data.admin)
      } else {
        setAdmin(null)
      }
    } catch (error) {
      console.error(
        'Admin authentication check failed:',
        error
      )

      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdmin()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${API_BASE}/admin/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'Invalid email or password',
        }
      }

      if (
        data.status === 'success' &&
        data.admin
      ) {
        setAdmin(data.admin)

        return {
          success: true,
          admin: data.admin,
        }
      }

      return {
        success: false,
        message: 'Login failed',
      }
    } catch (error) {
      console.error(
        'Admin login error:',
        error
      )

      return {
        success: false,
        message:
          'Unable to connect to the server',
      }
    }
  }

  const logout = async () => {
    try {
      await fetch(
        `${API_BASE}/admin/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error(
        'Admin logout error:',
        error
      )
    } finally {
      setAdmin(null)
    }
  }

  const value = {
    admin,
    loading,
    isAdmin: !!admin,
    login,
    logout,
    checkAdmin,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(
    AdminAuthContext
  )

  if (!context) {
    throw new Error(
      'useAdminAuth must be used inside AdminAuthProvider'
    )
  }

  return context
}