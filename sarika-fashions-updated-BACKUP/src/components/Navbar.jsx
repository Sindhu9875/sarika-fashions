import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import TopBar from './TopBar.jsx'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Sarees', to: '/shop' },
  { label: 'Bestsellers', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  {label:'Admin',to:'/admin/products'}
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { itemCount } = useCart()
  const { count } = useWishlist()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()

    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="site-header">

      {/* Top Announcement Bar */}
      <TopBar />

      {/* Main Navbar */}
      <div className="navbar">
        <div className="container navbar-inner">

          {/* Mobile Menu */}
          <button
            className="navbar-menu-btn mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img
              src="/logo.png"
              alt="Sarika Fashions"
            />
          </Link>

          {/* Navigation */}
          <nav className="navbar-links desktop-only">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="navbar-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="navbar-icons">

            {/* Search */}
            <button
              className="btn-icon"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="btn-icon"
              aria-label="Wishlist"
            >
              <Heart size={18} />

              {count > 0 && (
                <span className="navbar-badge">
                  {count}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn-icon"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />

              {itemCount > 0 && (
                <span className="navbar-badge">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="navbar-search-bar">
            <form
              className="container"
              onSubmit={handleSearch}
            >
              <Search size={18} />

              <input
                type="text"
                placeholder="Search for sarees, fabrics, occasions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${
          menuOpen ? 'is-open' : ''
        }`}
      >
        <div className="mobile-drawer-header">

          {/* Mobile Logo */}
          <div className="mobile-logo">
            <img
              src="/logo.png"
              alt="Sarika Fashions"
            />
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        <nav className="mobile-drawer-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

    </header>
  )
}