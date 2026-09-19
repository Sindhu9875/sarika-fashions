import React from 'react'
import { Link } from 'react-router-dom'
import './CategoryCard.css'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="category-card"
    >
      <div className="category-card-image">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-img"
        />
      </div>

      <span className="category-card-name">
        {category.name}
      </span>
    </Link>
  )
}