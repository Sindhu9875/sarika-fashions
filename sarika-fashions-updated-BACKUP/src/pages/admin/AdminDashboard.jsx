import React, { useEffect, useMemo, useState } from 'react'
import {
  Package,
  Boxes,
  Layers3,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import StatCard from '../../components/StatCard.jsx'
import './AdminDashboard.css'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_BASE}/products`, {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()
        if (!response.ok || data.status !== 'success') {
          throw new Error(data.message || 'Failed to load products.')
        }
        setProducts(Array.isArray(data.products) ? data.products : [])
      } catch (err) {
        console.error('Dashboard products error:', err)
        setError('Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const totalProducts = products.length
  const totalStock = products.reduce((total, product) => total + Number(product.stock || 0), 0)
  const lowStockProducts = products.filter((p) => { const s = Number(p.stock || 0); return s > 0 && s <= 5 })
  const outOfStockProducts = products.filter((p) => Number(p.stock || 0) === 0)
  const inStockProducts = products.filter((p) => Number(p.stock || 0) > 5)

  const categories = useMemo(() => {
    const categoryMap = {}
    products.forEach((product) => {
      let category = product.category
      if (typeof category === 'object' && category !== null) category = category.name
      category = String(category || 'Other').trim()
      if (!categoryMap[category]) categoryMap[category] = 0
      categoryMap[category] += 1
    })
    return Object.entries(categoryMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  }, [products])

  const maxCategoryCount = categories.length > 0 ? Math.max(...categories.map((c) => c.count)) : 1

  return (
    <div className="admin-dashboard">
      <h1 className="section-title">Dashboard</h1>
      <p className="admin-dashboard-subtitle">Welcome back — here's how Sarika Fashions is performing.</p>

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: '#fff1f1', color: '#b42318', border: '1px solid #f5c2c2' }}>
          {error}
        </div>
      )}

      <div className="admin-stats-grid">
        <StatCard icon={Package} label="Total Products" value={loading ? '...' : totalProducts} />
        <StatCard icon={Boxes} label="Total Stock" value={loading ? '...' : totalStock} />
        <StatCard icon={Layers3} label="Categories" value={loading ? '...' : categories.length} />
      </div>

      <div className="admin-stats-grid" style={{ marginTop: 20 }}>
        <StatCard icon={Boxes} label="In Stock" value={loading ? '...' : inStockProducts.length} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={loading ? '...' : lowStockProducts.length} />
        <StatCard icon={XCircle} label="Out of Stock" value={loading ? '...' : outOfStockProducts.length} />
      </div>

      <div className="admin-chart-card" style={{ marginTop: 20 }}>
        <h3>Products by Category</h3>
        <p style={{ marginTop: 6, color: '#888', fontSize: 13 }}>Number of products available in each category</p>

        {loading ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Loading products...</div>
        ) : categories.length === 0 ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No products available yet.</div>
        ) : (
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {categories.map((category) => {
              const percentage = (category.count / maxCategoryCount) * 100
              return (
                <div key={category.name} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{category.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#8E1748' }}>{category.count} {category.count === 1 ? 'product' : 'products'}</span>
                  </div>
                  <div style={{ width: '100%', height: 10, background: '#f1e9e6', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#8E1748', borderRadius: 20, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {!loading && categories.length > 0 && (
        <div className="admin-chart-card" style={{ marginTop: 20 }}>
          <h3>Category Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginTop: 20 }}>
            {categories.map((category) => (
              <div key={category.name} style={{ padding: '16px 18px', border: '1px solid #eee4e0', borderRadius: 10, background: '#fffaf7' }}>
                <div style={{ fontSize: 13, color: '#777', marginBottom: 6 }}>{category.name}</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#8E1748' }}>{category.count}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>products</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}