import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'

import FilterSidebar from '../components/FilterSidebar.jsx'
import ProductCard from '../components/ProductCard.jsx'

import './Shop.css'

export default function Shop() {
  const [searchParams] = useSearchParams()

  const initialCategory = searchParams.get('category')
  const searchQuery =
    searchParams.get('search')?.toLowerCase() || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    colors: [],
    minprice:0,
    maxPrice: 1000,
  })

  const [sortBy, setSortBy] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // =========================
  // LOAD PRODUCTS FROM FLASK
  // =========================

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        return response.json()
      })
      .then((data) => {
        console.log('PRODUCTS FROM BACKEND:', data.products)
        const formattedProducts = data.products.map((product) => ({
          ...product,

          id: product.id,

          price: Number(product.price),

          originalPrice: Number(product.old_price),

          rating: Number(product.rating) || 0,

          reviews: 0,

          stock:
            product.stock === null
              ? null
              : Number(product.stock),

          discount:
            Number(product.old_price) > Number(product.price)
              ? Math.round(
                  (
                    (Number(product.old_price) -
                      Number(product.price)) /
                    Number(product.old_price)
                  ) * 100
                )
              : 0,

          fabric: product.category,

          images: [
            product.image,
            product.image2,
            product.image3,
            product.image4,
          ].filter(Boolean),

          variant: 0,

          colors: [],
        }))

        setProducts(formattedProducts)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Product loading error:', error)
        setError('Unable to load products.')
        setLoading(false)
      })
  }, [])

  // =========================
  // FILTERS
  // =========================

  const toggleCategory = (id) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }))

  const toggleColor = (id) =>
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(id)
        ? f.colors.filter((c) => c !== id)
        : [...f.colors, id],
    }))

  const clearFilters = () =>
    setFilters({
      categories: [],
      colors: [],
      minprice:0,
      maxPrice:399,
    })

  // =========================
  // FILTER + SORT
  // =========================

  const filtered = useMemo(() => {

    let result = products.filter((p) => {

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(p.category)

      const matchesColor =
        filters.colors.length === 0 ||
        (p.colors || []).some((c) =>
          filters.colors.includes(c)
        )

      const matchesPrice =
  !filters.maxPrice || Number(p.price) <= Number(filters.maxPrice)

      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery)

      return (
        matchesCategory &&
        matchesColor &&
        matchesPrice &&
        matchesSearch
      )
    })

    switch (sortBy) {

      case 'price-low':
        result = [...result].sort(
          (a, b) => a.price - b.price
        )
        break

      case 'price-high':
        result = [...result].sort(
          (a, b) => b.price - a.price
        )
        break

      case 'rating':
        result = [...result].sort(
          (a, b) => b.rating - a.rating
        )
        break

      default:
        result = [...result].sort(
          (a, b) => b.id - a.id
        )
    }

    return result

  }, [products, filters, sortBy, searchQuery])

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h2>Loading sarees...</h2>
      </div>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div
        className="container"
        style={{
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h2>{error}</h2>

        <p style={{ marginTop: '10px' }}>
          Make sure the Flask backend is running.
        </p>
      </div>
    )
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="container shop-page">

      <div className="shop-header">

        <div>

          <h1 className="section-title">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : 'Shop All Sarees'}
          </h1>

          <p className="shop-count">
            Showing {filtered.length} of {products.length} results
          </p>

        </div>

        <div className="shop-header-actions">

          <button
            className="btn btn-outline btn-sm mobile-only"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <select
            className="shop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">
              Sort by: Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Rating
            </option>
          </select>

        </div>

      </div>

      <div className="shop-layout">

        <FilterSidebar
          filters={filters}
          onCategoryToggle={toggleCategory}
          onColorToggle={toggleColor}
          onPriceChange={(v) =>
            setFilters((f) => ({
              ...f,
              maxPrice: v,
            }))
          }
          onClear={clearFilters}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() =>
            setMobileFiltersOpen(false)
          }
        />

        <div className="shop-grid">

          {filtered.length === 0 ? (

            <p className="shop-empty">
              No sarees match your filters.
              Try adjusting them.
            </p>

          ) : (

            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))

          )}

        </div>

      </div>

    </div>
  )
}