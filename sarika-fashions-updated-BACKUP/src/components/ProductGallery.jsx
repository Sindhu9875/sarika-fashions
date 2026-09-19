import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ProductGallery.css'

export default function ProductGallery({ images = [] }) {
  const [active, setActive] = useState(0)

  // No images
  if (!images || images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <p>No image available</p>
        </div>
      </div>
    )
  }

  // Go to previous image
  const previousImage = () => {
    setActive((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  // Go to next image
  const nextImage = () => {
    setActive((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  return (
    <div className="product-gallery">

      {/* =========================
          MAIN PRODUCT IMAGE
      ========================= */}
      <div className="product-gallery-main">

        {/* LEFT ARROW */}
        {images.length > 1 && (
          <button
            type="button"
            className="gallery-arrow gallery-arrow-left"
            onClick={previousImage}
            aria-label="Previous saree image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <img
          key={images[active]}
          src={images[active]}
          alt={`Saree ${active + 1}`}
          className="product-main-image product-gallery-main-animated"
          onError={(e) => {
            console.error(
              'Cloudinary image failed:',
              images[active]
            )
          }}
        />

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button
            type="button"
            className="gallery-arrow gallery-arrow-right"
            onClick={nextImage}
            aria-label="Next saree image"
          >
            <ChevronRight size={24} />
          </button>
        )}

      </div>

      {/* =========================
          IMAGE THUMBNAILS
      ========================= */}
      <div className="product-gallery-thumbs">

        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            className={`product-gallery-thumb ${
              active === index ? 'is-active' : ''
            }`}
            onClick={() => setActive(index)}
            aria-label={`View saree image ${index + 1}`}
          >
            <img
              src={image}
              alt={`Saree thumbnail ${index + 1}`}
              className="product-thumbnail-image"
            />
          </button>
        ))}

      </div>

    </div>
  )
}