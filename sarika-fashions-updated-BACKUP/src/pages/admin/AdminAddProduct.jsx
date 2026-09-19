import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, X } from 'lucide-react'
import { categories, colors } from '../../data/products.js'
import './AdminAddProduct.css'

const API_BASE = 'http://127.0.0.1:5000/api'

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  color: '',
  fabric: '',
  discount: '',
}

export default function AdminAddProduct() {
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])

    if (!files.length) return

    const remainingSlots = 4 - images.length

    if (remainingSlots <= 0) {
      setError('You can upload a maximum of 4 images.')
      return
    }

    const selectedFiles = files.slice(0, remainingSlots)

    const newImages = selectedFiles.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])
    setError('')

    e.target.value = ''
  }

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index]

      if (target?.url) {
        URL.revokeObjectURL(target.url)
      }

      return prev.filter((_, i) => i !== index)
    })
  }

  // =========================
  // CLEANUP PREVIEW URLS
  // =========================

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url) {
          URL.revokeObjectURL(img.url)
        }
      })
    }
  }, [])

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    // Validation

    if (!form.name.trim()) {
      setError('Please enter the product name.')
      return
    }

    if (!form.category) {
      setError('Please select a category.')
      return
    }

    if (!form.price || Number(form.price) <= 0) {
      setError('Please enter a valid price.')
      return
    }

    if (images.length === 0) {
      setError('Please upload at least one product image.')
      return
    }

    if (images.length > 4) {
      setError('Maximum 4 images are allowed.')
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      // =========================
      // PRODUCT DETAILS
      // =========================

      formData.append('name', form.name.trim())
      formData.append('category', form.category)
      formData.append('price', form.price)

      if (form.originalPrice) {
        formData.append('old_price', form.originalPrice)
      }

      if (form.stock !== '') {
        formData.append('stock', form.stock)
      } else {
        formData.append('stock', '0')
      }

      if (form.description.trim()) {
        formData.append(
          'description',
          form.description.trim()
        )
      }

      /*
        Your current MySQL products table does NOT contain:

        - color
        - fabric
        - discount

        Therefore we do NOT send these fields.
      */

      // =========================
      // IMAGES
      // =========================

      images.forEach((image) => {
        formData.append('images', image.file)
      })

      // =========================
      // SEND TO FLASK BACKEND
      // =========================

      const response = await fetch(
        `${API_BASE}/products`,
        {
          method: 'POST',

          // IMPORTANT:
          // Sends the Flask admin session cookie.
          credentials: 'include',

          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok || data.status !== 'success') {
        throw new Error(
          data.message || 'Failed to add product.'
        )
      }

      // =========================
      // SUCCESS
      // =========================

      setSuccess('Product added successfully!')

      setForm(EMPTY_FORM)

      images.forEach((img) => {
        if (img.url) {
          URL.revokeObjectURL(img.url)
        }
      })

      setImages([])

      setTimeout(() => {
        navigate('/admin/products')
      }, 1000)

    } catch (err) {
      console.error('Add product error:', err)

      setError(
        err.message ||
          'Something went wrong while adding the product.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-add-product-page">

      <h1
        className="section-title"
        style={{ marginBottom: 20 }}
      >
        Add Product
      </h1>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 8,
            background: '#fff1f1',
            color: '#b42318',
            border: '1px solid #f5c2c2',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 8,
            background: '#effaf1',
            color: '#207a35',
            border: '1px solid #b7e3c0',
          }}
        >
          {success}
        </div>
      )}

      <form
        className="admin-form-card"
        onSubmit={handleSubmit}
      >

        {/* PRODUCT INFORMATION */}

        <div className="admin-form-section">

          <h3>Product Information</h3>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>Product Name *</label>

              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Enter product name"
                required
              />

            </div>

            <div className="admin-form-group">

              <label>Category *</label>

              <select
                value={form.category}
                onChange={update('category')}
                required
              >

                <option value="">
                  Select category
                </option>

                {Array.isArray(categories) &&
                  categories.map((category) => {

                    const categoryValue =
                      typeof category === 'object'
                        ? category.name
                        : category

                    const categoryKey =
                      typeof category === 'object'
                        ? category.id
                        : category

                    return (
                      <option
                        key={categoryKey}
                        value={categoryValue}
                      >
                        {categoryValue}
                      </option>
                    )
                  })}

              </select>

            </div>

            <div className="admin-form-group">

              <label>Price *</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={update('price')}
                placeholder="₹0"
                required
              />

            </div>

            <div className="admin-form-group">

              <label>Original Price</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={update('originalPrice')}
                placeholder="₹0"
              />

            </div>

            <div className="admin-form-group">

              <label>Stock</label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={update('stock')}
                placeholder="0"
              />

            </div>

            <div className="admin-form-group">

              <label>Color</label>

              <select
                value={form.color}
                onChange={update('color')}
              >

                <option value="">
                  Select color
                </option>

                {Array.isArray(colors) &&
                  colors.map((color) => {

                    const colorValue =
                      typeof color === 'object'
                        ? color.name
                        : color

                    const colorKey =
                      typeof color === 'object'
                        ? color.id
                        : color

                    return (
                      <option
                        key={colorKey}
                        value={colorValue}
                      >
                        {colorValue}
                      </option>
                    )
                  })}

              </select>

            </div>

            <div className="admin-form-group">

              <label>Fabric</label>

              <input
                type="text"
                value={form.fabric}
                onChange={update('fabric')}
                placeholder="e.g. Silk, Cotton"
              />

            </div>

            <div className="admin-form-group">

              <label>Discount</label>

              <input
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={update('discount')}
                placeholder="0%"
              />

            </div>

          </div>

          <div className="admin-form-group">

            <label>Description</label>

            <textarea
              rows="5"
              value={form.description}
              onChange={update('description')}
              placeholder="Enter product description..."
            />

          </div>

        </div>

        {/* PRODUCT IMAGES */}

        <div className="admin-form-section">

          <h3>Product Images</h3>

          <p
            style={{
              marginTop: -8,
              marginBottom: 16,
              fontSize: 13,
              color: '#777',
            }}
          >
            Upload up to 4 images. They will automatically
            be uploaded to Cloudinary.
          </p>

          <div
            className="admin-image-upload"
            style={{
              border: '2px dashed #ddd',
              borderRadius: 12,
              padding: 24,
              textAlign: 'center',
              cursor:
                images.length >= 4
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                images.length >= 4 ? 0.6 : 1,
            }}
          >

            <UploadCloud
              size={34}
              style={{ marginBottom: 8 }}
            />

            <p style={{ marginBottom: 8 }}>
              Click to upload product images
            </p>

            <span
              style={{
                display: 'block',
                fontSize: 12,
                color: '#888',
                marginBottom: 12,
              }}
            >
              JPG, PNG, WEBP • Maximum 4 images
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={images.length >= 4}
              onChange={handleImageSelect}
              style={{
                width: '100%',
                cursor:
                  images.length >= 4
                    ? 'not-allowed'
                    : 'pointer',
              }}
            />

          </div>

          {images.length > 0 && (

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 14,
                marginTop: 20,
              }}
            >

              {images.map((image, index) => (

                <div
                  key={`${image.name}-${index}`}
                  style={{
                    position: 'relative',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    background: '#fafafa',
                  }}
                >

                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 170,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    aria-label="Remove image"
                    style={{
                      position: 'absolute',
                      top: 7,
                      right: 7,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      border: 'none',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow:
                        '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <X size={16} />
                  </button>

                  <div
                    style={{
                      padding: '8px 10px',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={image.name}
                  >

                    {index === 0 && (
                      <strong>
                        Main Image •{' '}
                      </strong>
                    )}

                    {image.name}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ACTION BUTTONS */}

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
            marginTop: 10,
          }}
        >

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              navigate('/admin/products')
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving}
          >
            {saving
              ? 'Uploading & Saving...'
              : 'Save Product'}
          </button>

        </div>

      </form>

    </div>
  )
}