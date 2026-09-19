import React, { useEffect, useState } from 'react'
import OrderTable from '../../components/OrderTable.jsx'
import Modal from '../../components/Modal.jsx'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.status === 401) {
        throw new Error(
          'Admin authentication required. Please login again.'
        )
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()

      if (data.status !== 'success') {
        throw new Error(
          data.message || 'Failed to fetch orders'
        )
      }

      setOrders(data.orders || [])

    } catch (err) {
      console.error('Fetch orders error:', err)
      setError(
        err.message || 'Unable to load orders'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-orders-page">

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >

        <h1
          className="section-title"
          style={{ marginBottom: 0 }}
        >
          Orders
        </h1>

        <button
          onClick={fetchOrders}
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>

      </div>

      {loading && (
        <div style={{ padding: '30px 0' }}>
          Loading orders...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            background: '#fff1f1',
            color: '#c62828',
          }}
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#777',
            }}
          >
            No orders yet.
          </div>
        )}

      {!loading &&
        !error &&
        orders.length > 0 && (
          <OrderTable
            orders={orders}
            onView={setSelectedOrder}
          />
        )}

      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.id || 'Order Details'}
      >

        {selectedOrder && (

          <div
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.8,
            }}
          >

            <p>
              <strong>Order ID:</strong>{' '}
              {selectedOrder.id}
            </p>

            <p>
              <strong>Customer:</strong>{' '}
              {selectedOrder.customer || 'N/A'}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {selectedOrder.email || 'N/A'}
            </p>

            <p>
              <strong>Phone:</strong>{' '}
              {selectedOrder.phone || 'N/A'}
            </p>

            <p>
              <strong>Address:</strong>{' '}
              {selectedOrder.address || 'N/A'}
            </p>

            <p>
              <strong>City:</strong>{' '}
              {selectedOrder.city || 'N/A'}
            </p>

            <p>
              <strong>State:</strong>{' '}
              {selectedOrder.state || 'N/A'}
            </p>

            <p>
              <strong>Pincode:</strong>{' '}
              {selectedOrder.pincode || 'N/A'}
            </p>

            <p>
              <strong>Amount:</strong>{' '}
              ₹
              {Number(
                selectedOrder.amount || 0
              ).toLocaleString('en-IN')}
            </p>

            <p>
              <strong>Payment:</strong>{' '}
              {selectedOrder.paymentStatus || 'N/A'}
            </p>

            <p>
              <strong>Order Status:</strong>{' '}
              {selectedOrder.status || 'N/A'}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {selectedOrder.date || 'N/A'}
            </p>

            {selectedOrder.razorpayOrderId && (
              <p>
                <strong>Razorpay Order:</strong>{' '}
                {selectedOrder.razorpayOrderId}
              </p>
            )}

            {selectedOrder.razorpayPaymentId && (
              <p>
                <strong>Razorpay Payment:</strong>{' '}
                {selectedOrder.razorpayPaymentId}
              </p>
            )}

            {selectedOrder.items &&
              selectedOrder.items.length > 0 && (

                <div style={{ marginTop: 20 }}>

                  <h3 style={{ marginBottom: 10 }}>
                    Order Items
                  </h3>

                  {selectedOrder.items.map(
                    (item, index) => (

                      <div
                        key={index}
                        style={{
                          padding: '10px 0',
                          borderBottom:
                            '1px solid #eee',
                        }}
                      >

                        <div>
                          <strong>
                            {item.name ||
                              item.title ||
                              'Product'}
                          </strong>
                        </div>

                        <div>
                          Quantity:{' '}
                          {item.quantity || 1}
                        </div>

                        <div>
                          Price: ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString('en-IN')}
                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

          </div>

        )}

      </Modal>

    </div>
  )
}