import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Users, Tags, Settings, Search, RefreshCw } from 'lucide-react'
import { categories } from '../../data/products.js'
import './AdminInfo.css'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function AdminInfo() {
  const path = useLocation().pathname

  // =========================
  // CUSTOMERS
  // =========================

  const [orders, setOrders] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [customerError, setCustomerError] = useState('')
  const [search, setSearch] = useState('')

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      setCustomerError('')

      const response = await fetch(`${API_BASE}/orders`)

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()

      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Customer fetch error:', error)
      setCustomerError(
        'Unable to load customers. Please make sure the backend is running.'
      )
    } finally {
      setLoadingCustomers(false)
    }
  }

  useEffect(() => {
    if (path.endsWith('/customers')) {
      fetchCustomers()
    }
  }, [path])

  // =========================
  // CREATE CUSTOMER LIST
  // FROM REAL ORDERS
  // =========================

  const customers = useMemo(() => {
    const customerMap = {}

    orders.forEach((order) => {
      const email = (order.email || '').trim().toLowerCase()
      const phone = (order.phone || '').trim()
      const name = (order.customer || 'Guest Customer').trim()

      const customerKey =
        email ||
        phone ||
        name.toLowerCase()

      if (!customerMap[customerKey]) {
        customerMap[customerKey] = {
          id: customerKey,
          name,
          email: order.email || '—',
          phone: order.phone || '—',
          orders: 0,
          totalSpent: 0,
        }
      }

      customerMap[customerKey].orders += 1

      const isPaid =
        String(order.paymentStatus || '').toLowerCase() === 'paid'

      const isCancelled =
        String(order.status || '').toLowerCase() === 'cancelled'

      if (isPaid && !isCancelled) {
        customerMap[customerKey].totalSpent +=
          Number(order.amount) || 0
      }
    })

    return Object.values(customerMap)
  }, [orders])

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return customers
    }

    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    )
  }, [customers, search])

  // =========================
  // CUSTOMERS PAGE
  // =========================

  if (path.endsWith('/customers')) {
    return (
      <div className="admin-info">

        <div className="admin-info-header">
          <div>
            <h1 className="section-title">Customers</h1>

            <p className="admin-info-sub">
              View customers from your real orders.
            </p>
          </div>

          <button
            className="customer-refresh-btn"
            onClick={fetchCustomers}
            type="button"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* CUSTOMER SUMMARY */}

        <div className="customer-summary">

          <div className="customer-summary-card">
            <Users size={20} />

            <div>
              <span>Total Customers</span>
              <strong>{customers.length}</strong>
            </div>
          </div>

          <div className="customer-summary-card">
            <span className="rupee-icon">₹</span>

            <div>
              <span>Total Customer Spending</span>

              <strong>
                ₹
                {customers
                  .reduce(
                    (sum, customer) =>
                      sum + customer.totalSpent,
                    0
                  )
                  .toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

        </div>

        {/* SEARCH */}

        <div className="customer-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search customer by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* TABLE */}

        <div className="admin-table-card">

          {loadingCustomers && (
            <div className="customer-empty">
              <p>Loading customers...</p>
            </div>
          )}

          {!loadingCustomers && customerError && (
            <div className="customer-empty">

              <p>{customerError}</p>

              <button
                className="btn btn-primary"
                onClick={fetchCustomers}
              >
                Try Again
              </button>

            </div>
          )}

          {!loadingCustomers &&
            !customerError &&
            customers.length === 0 && (
              <div className="customer-empty">

                <Users size={40} />

                <h3>No customers yet</h3>

                <p>
                  Customers will automatically appear here
                  when orders are placed.
                </p>

              </div>
            )}

          {!loadingCustomers &&
            !customerError &&
            customers.length > 0 &&
            filteredCustomers.length === 0 && (
              <div className="customer-empty">

                <Search size={40} />

                <h3>No customers found</h3>

                <p>
                  Try a different name, email or phone number.
                </p>

              </div>
            )}

          {!loadingCustomers &&
            !customerError &&
            filteredCustomers.length > 0 && (
              <div className="admin-table-scroll">

                <table>

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>

                        <td>
                          <div className="customer-name">

                            <div className="customer-avatar">
                              {customer.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {customer.name}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone}
                        </td>

                        <td>
                          {customer.orders}
                        </td>

                        <td>
                          <strong>
                            ₹
                            {customer.totalSpent.toLocaleString(
                              'en-IN'
                            )}
                          </strong>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

        </div>

      </div>
    )
  }

  // =========================
  // CATEGORIES
  // =========================

  if (path.endsWith('/categories')) {
    return (
      <div className="admin-info">

        <h1 className="section-title">
          Categories
        </h1>

        <p className="admin-info-sub">
          Organize your storefront categories.
        </p>

        <div className="admin-category-cards">

          {categories.map((c) => (
            <div
              className="admin-category-card"
              key={c.id}
            >

              <Tags size={18} />

              <div>
                <strong>{c.name}</strong>
                <span>Active collection</span>
              </div>

              <Link to={`/shop?category=${c.id}`}>
                View
              </Link>

            </div>
          ))}

        </div>

      </div>
    )
  }

  // =========================
  // SETTINGS
  // =========================

  return (
    <div className="admin-info">

      <h1 className="section-title">
        Store Settings
      </h1>

      <p className="admin-info-sub">
        These settings are ready to connect to the backend.
      </p>

      <div className="settings-card">

        <Settings size={22} />

        <div className="field">
          <label>Store Name</label>
          <input
            defaultValue="Sarika Fashions"
          />
        </div>

        <div className="field">
          <label>Support Email</label>
          <input
            defaultValue="hello@sarikafashions.com"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            alert('Settings saved for this frontend preview.')
          }
        >
          Save Settings
        </button>

      </div>

    </div>
  )
}