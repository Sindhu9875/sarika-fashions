import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import SareeArt from './SareeArt.jsx'
import './ProductTable.css'

function stockBadge(stock) {
  if (stock === 0) return <span className="badge badge-outofstock">Out of Stock</span>
  if (stock <= 10) return <span className="badge badge-lowstock">Low Stock</span>
  return <span className="badge badge-instock">In Stock</span>
}

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td data-label="Image">
                <div className="admin-table-thumb">
                  <SareeArt variant={p.variant} />
                </div>
              </td>
              <td data-label="Name" className="admin-table-name">{p.name}</td>
              <td data-label="Category" className="admin-table-category">{p.category}</td>
              <td data-label="Price">₹{p.price.toLocaleString('en-IN')}</td>
              <td data-label="Stock">{p.stock}</td>
              <td data-label="Status">{stockBadge(p.stock)}</td>
              <td data-label="Actions">
                <div className="admin-table-actions">
                  <button className="btn-icon" onClick={() => onEdit?.(p)} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="btn-icon admin-table-delete" onClick={() => onDelete?.(p)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
