import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Package,
  AlertCircle,
  X,
} from 'lucide-react'
import './AdminProducts.css'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_BASE_URL}/products`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
          ? data.products
          : []

      setProducts(productList)
    } catch (err) {
      console.error('Fetch products error:', err)

      setError(
        'Unable to load products. Please check that your backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // =========================
  // SEARCH
  // =========================

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return products
    }

    return products.filter((product) => {
      const name = String(
        product.name || ''
      ).toLowerCase()

      const category = String(
        product.category || ''
      ).toLowerCase()

      const fabric = String(
        product.fabric || ''
      ).toLowerCase()

      return (
        name.includes(keyword) ||
        category.includes(keyword) ||
        fabric.includes(keyword)
      )
    })
  }, [products, search])

  // =========================
  // STOCK
  // =========================

  const getStock = (product) => {
    const stock = Number(
      product.stock ?? product.quantity ?? 0
    )

    return Number.isNaN(stock) ? 0 : stock
  }

  // =========================
  // PRICE
  // =========================

  const getPrice = (product) => {
    const price = Number(
      product.price ?? 0
    )

    return Number.isNaN(price) ? 0 : price
  }

  // =========================
  // IMAGE
  // =========================

  const getImage = (product) => {
    return (
      product.image_url ||
      product.imageUrl ||
      product.image ||
      '/logo.png'
    )
  }

  // =========================
  // STATUS
  // =========================

  const getStatus = (product) => {
    const stock = getStock(product)

    if (stock <= 0) {
      return 'Out of Stock'
    }

    if (stock <= 5) {
      return 'Low Stock'
    }

    return 'In Stock'
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(product.id)
      setError('')

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: 'DELETE',

          // IMPORTANT:
          // Sends Flask admin session cookie
          credentials: 'include',
        }
      )

      const data = await response
        .json()
        .catch(() => null)

      if (response.status === 401) {
        throw new Error(
          'Admin authentication required. Please login again.'
        )
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to delete product'
        )
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            item.id !== product.id
        )
      )

    } catch (err) {
      console.error(
        'Delete product error:',
        err
      )

      setError(
        err.message ||
          'Unable to delete this product.'
      )
    } finally {
      setDeleting(null)
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-products-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="admin-products-header">

        <div>

          <p className="admin-products-eyebrow">
            INVENTORY MANAGEMENT
          </p>

          <h1 className="admin-products-title">
            Products
          </h1>

          <p className="admin-products-subtitle">
            Add, edit and manage your saree collection.
          </p>

        </div>

        <Link
          to="/admin/products/add"
          className="admin-add-product-btn"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="admin-product-summary">

        {/* TOTAL PRODUCTS */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            <Package size={20} />
          </div>

          <div>

            <span>Total Products</span>

            <strong>
              {products.length}
            </strong>

          </div>

        </div>

        {/* LOW STOCK */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon warning">
            <AlertCircle size={20} />
          </div>

          <div>

            <span>Low Stock</span>

            <strong>
              {
                products.filter(
                  (product) => {
                    const stock =
                      getStock(product)

                    return (
                      stock > 0 &&
                      stock <= 5
                    )
                  }
                ).length
              }
            </strong>

          </div>

        </div>

        {/* OUT OF STOCK */}

        <div className="admin-summary-card">

          <div className="admin-summary-icon danger">
            <AlertCircle size={20} />
          </div>

          <div>

            <span>Out of Stock</span>

            <strong>
              {
                products.filter(
                  (product) =>
                    getStock(product) <= 0
                ).length
              }
            </strong>

          </div>

        </div>

      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="admin-products-toolbar">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products, category or fabric..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="admin-clear-search"
              onClick={() =>
                setSearch('')
              }
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={fetchProducts}
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? 'admin-spin'
                : ''
            }
          />

          Refresh

        </button>

      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="admin-products-error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError('')
            }
            aria-label="Close error"
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =========================
          PRODUCT CARD
      ========================= */}

      <div className="admin-products-card">

        <div className="admin-products-card-header">

          <div>

            <h2>
              Product Catalogue
            </h2>

            <p>
              {filteredProducts.length}{' '}
              product
              {filteredProducts.length !== 1
                ? 's'
                : ''}
              {search
                ? ' found'
                : ''}
            </p>

          </div>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="admin-products-loading">

            <RefreshCw
              size={26}
              className="admin-spin"
            />

            <p>
              Loading products...
            </p>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */

          <div className="admin-products-empty">

            <div className="admin-empty-icon">
              <Package size={30} />
            </div>

            <h3>
              {search
                ? 'No products found'
                : 'No products available'}
            </h3>

            <p>
              {search
                ? 'Try another search term.'
                : 'Add your first saree to the catalogue.'}
            </p>

            {!search && (
              <Link
                to="/admin/products/add"
                className="admin-empty-add-btn"
              >
                <Plus size={17} />
                Add Product
              </Link>
            )}

          </div>

        ) : (

          /* =========================
             TABLE
          ========================= */

          <div className="admin-table-wrapper">

            <table className="admin-products-table">

              <thead>

                <tr>

                  <th>
                    PRODUCT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    PRICE
                  </th>

                  <th>
                    STOCK
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      getStock(product)

                    const price =
                      getPrice(product)

                    const status =
                      getStatus(product)

                    return (

                      <tr
                        key={product.id}
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="admin-product-cell">

                            <div className="admin-product-image">

                              <img
                                src={getImage(
                                  product
                                )}
                                alt={
                                  product.name ||
                                  'Product'
                                }
                                onError={(e) => {
                                  e.currentTarget.src =
                                    '/logo.png'
                                }}
                              />

                            </div>

                            <div className="admin-product-name">

                              <strong>
                                {product.name ||
                                  'Unnamed Product'}
                              </strong>

                              {product.fabric && (
                                <span>
                                  {
                                    product.fabric
                                  }
                                </span>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="admin-category">
                            {product.category ||
                              '—'}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td>

                          <strong className="admin-product-price">
                            ₹
                            {price.toLocaleString(
                              'en-IN'
                            )}
                          </strong>

                        </td>

                        {/* STOCK */}

                        <td>

                          <span
                            className={
                              stock <= 0
                                ? 'admin-stock out'
                                : stock <= 5
                                  ? 'admin-stock low'
                                  : 'admin-stock'
                            }
                          >
                            {stock}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`admin-status ${status
                              .toLowerCase()
                              .replaceAll(
                                ' ',
                                '-'
                              )}`}
                          >

                            <span className="admin-status-dot" />

                            {status}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-product-actions">

                            {/* EDIT */}

                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="admin-action-btn edit"
                              title="Edit product"
                            >
                              <Edit3 size={16} />
                            </Link>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="admin-action-btn delete"
                              title="Delete product"
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              disabled={
                                deleting ===
                                product.id
                              }
                            >

                              {deleting ===
                              product.id ? (
                                <RefreshCw
                                  size={16}
                                  className="admin-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}