import React from 'react'
import { X } from 'lucide-react'
import { categories, colors } from '../data/products.js'
import './FilterSidebar.css'

export default function FilterSidebar({
  filters,
  onCategoryToggle,
  onColorToggle,
  onPriceChange,
  onClear,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      <aside className={`filter-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="filter-sidebar-mobile-header mobile-only">
          <h3>Filters</h3>
          <button onClick={onCloseMobile} aria-label="Close filters">
            <X size={20} />
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-group-header">
            <h4>Category</h4>
            <button className="filter-clear" onClick={onClear}>Clear all</button>
          </div>
          {categories.map((cat) => (
            <label key={cat.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => onCategoryToggle(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Price</h4>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={filters.maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="filter-price-slider"
          />
          <div className="filter-price-labels">
            <span>₹1,000</span>
            <span>₹{filters.maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="filter-group">
          <h4>Color</h4>
          <div className="filter-colors">
            {colors.map((c) => (
              <button
                key={c.id}
                className={`filter-color-swatch ${filters.colors.includes(c.id) ? 'is-active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => onColorToggle(c.id)}
                aria-label={c.name}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-block mobile-only" onClick={onCloseMobile}>
          Apply Filters
        </button>
      </aside>
      {mobileOpen && <div className="filter-sidebar-overlay mobile-only" onClick={onCloseMobile} />}
    </>
  )
}
