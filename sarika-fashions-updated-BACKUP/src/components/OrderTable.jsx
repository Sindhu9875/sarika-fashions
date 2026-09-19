import React from 'react'
import { Eye } from 'lucide-react'
import './ProductTable.css'
import './OrderTable.css'

const BADGE_CLASS = {
  Pending: 'badge-pending',
  Processing: 'badge-processing',
  Shipped: 'badge-shipped',
  Delivered: 'badge-delivered',
  Cancelled: 'badge-cancelled',
}

export default function OrderTable({ orders, onView }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td data-label="Order ID" className="order-table-id">{o.id}</td>
              <td data-label="Customer">{o.customer}</td>
              <td data-label="Amount">₹{o.amount.toLocaleString('en-IN')}</td>
              <td data-label="Status">
                <span className={`badge ${BADGE_CLASS[o.status]}`}>{o.status}</span>
              </td>
              <td data-label="Date">{o.date}</td>
              <td data-label="Actions">
                <button className="btn-icon" onClick={() => onView?.(o)} aria-label="View order">
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
