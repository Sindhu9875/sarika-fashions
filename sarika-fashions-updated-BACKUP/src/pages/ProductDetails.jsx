import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Send,
  X,
} from 'lucide-react'

import ProductGallery from '../components/ProductGallery.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

import './ProductDetails.css'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =====================================================
  // REVIEWS
  // =====================================================

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const [showReviewForm, setShowReviewForm] = useState(false)

  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE}/products`
        )

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data = await response.json()

        if (!data.products) {
          throw new Error('Invalid product data')
        }

        const foundProduct = data.products.find(
          (item) =>
            String(item.id) === String(id)
        )

        if (!foundProduct) {
          setError('Product not found')
          setLoading(false)
          return
        }

        // =================================================
        // FORMAT PRODUCT
        // =================================================

        const formattedProduct = {
          ...foundProduct,

          id: foundProduct.id,

          price: Number(foundProduct.price),

          originalPrice:
            foundProduct.old_price !== null &&
            foundProduct.old_price !== undefined
              ? Number(foundProduct.old_price)
              : Number(foundProduct.price),

          rating:
            foundProduct.rating !== null &&
            foundProduct.rating !== undefined
              ? Number(foundProduct.rating)
              : 0,

          // ⭐ NOW COMES FROM BACKEND
          reviews:
            foundProduct.reviews !== null &&
            foundProduct.reviews !== undefined
              ? Number(foundProduct.reviews)
              : 0,

          stock:
            foundProduct.stock === null ||
            foundProduct.stock === undefined
              ? null
              : Number(foundProduct.stock),

          discount:
            Number(foundProduct.old_price) >
            Number(foundProduct.price)
              ? Math.round(
                  ((Number(foundProduct.old_price) -
                    Number(foundProduct.price)) /
                    Number(foundProduct.old_price)) *
                    100
                )
              : 0,

          fabric: foundProduct.category,

          // ⭐ ALL FOUR CLOUDINARY IMAGES
          images: [
            foundProduct.image,
            foundProduct.image2,
            foundProduct.image3,
            foundProduct.image4,
          ].filter(Boolean),

          variant: 0,

          colors: [],
        }

        setProduct(formattedProduct)

        // =================================================
        // RELATED PRODUCTS
        // =================================================

        const related = data.products
          .filter(
            (item) =>
              item.category ===
                foundProduct.category &&
              String(item.id) !==
                String(foundProduct.id)
          )
          .slice(0, 4)
          .map((item) => ({
            ...item,

            id: item.id,

            price: Number(item.price),

            originalPrice:
              item.old_price !== null &&
              item.old_price !== undefined
                ? Number(item.old_price)
                : Number(item.price),

            rating:
              item.rating !== null &&
              item.rating !== undefined
                ? Number(item.rating)
                : 0,

            // ⭐ REVIEW COUNT FROM BACKEND
            reviews:
              item.reviews !== null &&
              item.reviews !== undefined
                ? Number(item.reviews)
                : 0,

            stock:
              item.stock === null ||
              item.stock === undefined
                ? null
                : Number(item.stock),

            discount:
              Number(item.old_price) >
              Number(item.price)
                ? Math.round(
                    ((Number(item.old_price) -
                      Number(item.price)) /
                      Number(item.old_price)) *
                      100
                  )
                : 0,

            fabric: item.category,

            images: [
              item.image,
              item.image2,
              item.image3,
              item.image4,
            ].filter(Boolean),

            variant: 0,

            colors: [],
          }))

        setRelatedProducts(related)

        setLoading(false)

      } catch (err) {
        console.error(
          'Product loading error:',
          err
        )

        setError(
          'Unable to load product. Make sure the Flask backend is running.'
        )

        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = async () => {
    if (!id) return

    try {
      setReviewsLoading(true)

      const response = await fetch(
        `${API_BASE}/reviews/${id}`
      )

      if (!response.ok) {
        throw new Error(
          'Failed to load reviews'
        )
      }

      const data = await response.json()

      if (data.success) {
        setReviews(data.reviews || [])

        // ⭐ UPDATE PRODUCT RATING + COUNT
        if (data.summary) {
          setProduct((currentProduct) => {
            if (!currentProduct) {
              return currentProduct
            }

            return {
              ...currentProduct,

              rating: Number(
                data.summary.rating || 0
              ),

              reviews: Number(
                data.summary.reviews || 0
              ),
            }
          })
        }
      }

    } catch (err) {
      console.error(
        'Reviews loading error:',
        err
      )
    } finally {
      setReviewsLoading(false)
    }
  }

  // =====================================================
  // LOAD REVIEWS WHEN PRODUCT LOADS
  // =====================================================

  useEffect(() => {
    if (product) {
      loadReviews()
    }
  }, [product?.id])

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    setReviewError('')
    setReviewMessage('')

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!reviewName.trim()) {
      setReviewError(
        'Please enter your name.'
      )
      return
    }

    if (reviewRating < 1) {
      setReviewError(
        'Please select a rating.'
      )
      return
    }

    if (!reviewText.trim()) {
      setReviewError(
        'Please write your review.'
      )
      return
    }

    try {
      setReviewSubmitting(true)

      const response = await fetch(
        `${API_BASE}/reviews`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            product_id: Number(id),

            customer_name:
              reviewName.trim(),

            rating: reviewRating,

            review_text:
              reviewText.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Failed to submit review'
        )
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setReviewMessage(
        'Thank you! Your review has been added. ♡'
      )

      setReviewName('')
      setReviewRating(0)
      setReviewText('')

      // ⭐ UPDATE RATING + REVIEW COUNT
      if (data.summary) {
        setProduct((currentProduct) => {
          if (!currentProduct) {
            return currentProduct
          }

          return {
            ...currentProduct,

            rating: Number(
              data.summary.rating || 0
            ),

            reviews: Number(
              data.summary.reviews || 0
            ),
          }
        })
      }

      // ⭐ GET NEW REVIEW LIST
      await loadReviews()

      // Close form after a short delay
      setTimeout(() => {
        setShowReviewForm(false)
        setReviewMessage('')
      }, 1500)

    } catch (err) {
      console.error(
        'Review submission error:',
        err
      )

      setReviewError(
        err.message ||
          'Unable to submit review. Please try again.'
      )
    } finally {
      setReviewSubmitting(false)
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h2>
          Loading product...
        </h2>
      </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <div
        className="container"
        style={{
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h2>
          {error ||
            'Product not found'}
        </h2>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate('/shop')
          }
          style={{
            marginTop: '20px',
          }}
        >
          Back to Shop
        </button>
      </div>
    )
  }

  const wishlisted =
    isWishlisted(product.id)

  // =====================================================
  // QUANTITY
  // =====================================================

  const increaseQuantity = () => {
    if (
      product.stock !== null &&
      quantity >= product.stock
    ) {
      return
    }

    setQuantity((q) => q + 1)
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) return

    setQuantity((q) => q - 1)
  }

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = () => {
    toggleWishlist(product)
  }

  // =====================================================
  // REVIEW FORM
  // =====================================================

  const openReviewForm = () => {
    setReviewError('')
    setReviewMessage('')
    setShowReviewForm(true)
  }

  const closeReviewForm = () => {
    if (reviewSubmitting) return

    setShowReviewForm(false)

    setReviewError('')
    setReviewMessage('')
  }

  return (
    <div className="container product-details-page">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        className="product-details-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* =================================================
          PRODUCT SECTION
      ================================================= */}

      <div className="product-details-layout">

        {/* LEFT - IMAGE GALLERY */}

        <div className="product-details-gallery">

          <ProductGallery
            images={product.images}
          />

        </div>

        {/* RIGHT - PRODUCT INFO */}

        <div className="product-details-info">

          {/* CATEGORY */}

          {product.category && (
            <p className="product-details-category">
              {product.category
                .replace(/-/g, ' ')
                .toUpperCase()}
            </p>
          )}

          {/* NAME */}

          <h1 className="product-details-name">
            {product.name}
          </h1>

          {/* =================================================
              RATING
          ================================================= */}

          <div className="product-details-rating">

            <span className="rating-star">
              ★
            </span>

            <span>
              {Number(
                product.rating || 0
              ).toFixed(1)}
            </span>

            <span className="rating-divider">
              |
            </span>

            <span>
              {Number(
                product.reviews || 0
              )}{' '}
              Reviews
            </span>

          </div>

          {/* PRICE */}

          <div className="product-details-prices">

            <span className="product-details-price">
              ₹
              {Number(
                product.price
              ).toLocaleString(
                'en-IN'
              )}
            </span>

            {Number(
              product.originalPrice
            ) >
              Number(
                product.price
              ) && (
              <>
                <span className="product-details-original">
                  ₹
                  {Number(
                    product.originalPrice
                  ).toLocaleString(
                    'en-IN'
                  )}
                </span>

                <span className="product-details-discount">
                  {product.discount}% OFF
                </span>
              </>
            )}

          </div>

          {/* DIVIDER */}

          <div className="product-details-divider" />

          {/* DESCRIPTION */}

          {product.description && (
            <div className="product-details-description">

              <h3>
                Description
              </h3>

              <p>
                {product.description}
              </p>

            </div>
          )}

          {/* FABRIC */}

          {product.fabric && (
            <div className="product-details-meta">

              <span className="meta-label">
                Category
              </span>

              <span className="meta-value">
                {product.fabric.replace(
                  /-/g,
                  ' '
                )}
              </span>

            </div>
          )}

          {/* STOCK */}

          {product.stock !== null && (
            <div className="product-details-stock">

              {product.stock > 0 ? (
                <>
                  <span className="stock-dot" />
                  {product.stock}{' '}
                  available
                </>
              ) : (
                <span>
                  Out of stock
                </span>
              )}

            </div>
          )}

          {/* QUANTITY */}

          <div className="product-details-quantity">

            <span className="quantity-label">
              Quantity
            </span>

            <div className="quantity-control">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  product.stock !==
                    null &&
                  quantity >=
                    product.stock
                }
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="product-details-actions">

            <button
              className="btn btn-primary product-add-cart"
              onClick={
                handleAddToCart
              }
              disabled={
                product.stock !==
                  null &&
                product.stock <= 0
              }
            >
              <ShoppingBag
                size={18}
              />

              Add to Cart
            </button>

            <button
              className={`product-details-wishlist ${
                wishlisted
                  ? 'is-active'
                  : ''
              }`}
              onClick={
                handleWishlist
              }
              aria-label="Toggle wishlist"
            >
              <Heart
                size={20}
                fill={
                  wishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>

          </div>

          {/* BUY NOW */}

          <button
            className="btn btn-outline btn-block product-buy-now"
            onClick={
              handleBuyNow
            }
            disabled={
              product.stock !==
                null &&
              product.stock <= 0
            }
          >
            Buy Now
          </button>

          {/* DELIVERY INFO */}

          <div className="product-details-benefits">

            <div className="benefit-item">
              <span>🚚</span>

              <div>
                <strong>
                  Easy Delivery
                </strong>

                <p>
                  Fast and reliable
                  delivery
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>↩️</span>

              <div>
                <strong>
                  Easy Returns
                </strong>

                <p>
                  Simple return
                  process
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>✓</span>

              <div>
                <strong>
                  Quality Assured
                </strong>

                <p>
                  Carefully selected
                  sarees
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          REVIEWS SECTION
      ================================================= */}

      <section className="product-reviews-section">

        <div className="product-reviews-header">

          <div>

            <p className="section-eyebrow">
              CUSTOMER LOVE
            </p>

            <h2 className="section-title">
              Reviews & Ratings
            </h2>

            <div className="reviews-summary">

              <div className="reviews-average">

                <span className="reviews-big-rating">
                  {Number(
                    product.rating || 0
                  ).toFixed(1)}
                </span>

                <div className="reviews-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={17}
                        fill={
                          star <=
                          Math.round(
                            Number(
                              product.rating ||
                                0
                            )
                          )
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    )
                  )}

                </div>

                <span className="reviews-total">
                  {Number(
                    product.reviews || 0
                  )}{' '}
                  review
                  {Number(
                    product.reviews || 0
                  ) === 1
                    ? ''
                    : 's'}
                </span>

              </div>

              <button
                type="button"
                className="review-write-button"
                onClick={
                  openReviewForm
                }
              >
                <Star size={17} />
                Write a Review
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            REVIEW FORM
        ================================================= */}

        {showReviewForm && (
          <div className="review-form-card">

            <div className="review-form-header">

              <div>
                <p className="review-form-eyebrow">
                  SHARE YOUR EXPERIENCE
                </p>

                <h3>
                  How did you like this saree?
                </h3>
              </div>

              <button
                type="button"
                className="review-form-close"
                onClick={
                  closeReviewForm
                }
                disabled={
                  reviewSubmitting
                }
                aria-label="Close review form"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmitReview
              }
            >

              {/* NAME */}

              <div className="review-form-field">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  value={
                    reviewName
                  }
                  onChange={(e) =>
                    setReviewName(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                  maxLength={100}
                  disabled={
                    reviewSubmitting
                  }
                />

              </div>

              {/* RATING */}

              <div className="review-form-field">

                <label>
                  Your Rating
                </label>

                <div className="review-star-selector">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        className={
                          star <=
                          reviewRating
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          setReviewRating(
                            star
                          )
                        }
                        disabled={
                          reviewSubmitting
                        }
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          size={28}
                          fill={
                            star <=
                            reviewRating
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>
                    )
                  )}

                </div>

                {reviewRating > 0 && (
                  <span className="selected-rating-text">
                    {reviewRating === 1 &&
                      'Not great'}
                    {reviewRating === 2 &&
                      'Could be better'}
                    {reviewRating === 3 &&
                      'It was good'}
                    {reviewRating === 4 &&
                      'Loved it'}
                    {reviewRating === 5 &&
                      'Absolutely loved it!'}
                  </span>
                )}

              </div>

              {/* REVIEW TEXT */}

              <div className="review-form-field">

                <label>
                  Your Review
                </label>

                <textarea
                  value={
                    reviewText
                  }
                  onChange={(e) =>
                    setReviewText(
                      e.target.value
                    )
                  }
                  placeholder="Tell us what you loved about this saree..."
                  rows={5}
                  maxLength={2000}
                  disabled={
                    reviewSubmitting
                  }
                />

                <span className="review-character-count">
                  {reviewText.length}/2000
                </span>

              </div>

              {/* ERROR */}

              {reviewError && (
                <div className="review-form-error">
                  {reviewError}
                </div>
              )}

              {/* SUCCESS */}

              {reviewMessage && (
                <div className="review-form-success">
                  {reviewMessage}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="review-submit-button"
                disabled={
                  reviewSubmitting
                }
              >
                <Send size={17} />

                {reviewSubmitting
                  ? 'Submitting...'
                  : 'Submit Review'}
              </button>

            </form>

          </div>
        )}

        {/* =================================================
            REVIEWS LIST
        ================================================= */}

        <div className="reviews-list">

          {reviewsLoading ? (
            <div className="reviews-loading">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews-card">

              <div className="no-reviews-icon">
                <Star size={24} />
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Be the first to share your
                experience with this saree.
              </p>

              <button
                type="button"
                className="review-write-button"
                onClick={
                  openReviewForm
                }
              >
                <Star size={16} />
                Write the First Review
              </button>

            </div>
          ) : (
            reviews.map((review) => (
              <article
                className="review-card"
                key={review.id}
              >

                <div className="review-card-top">

                  <div className="reviewer-info">

                    <div className="reviewer-avatar">
                      {review.customer_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        'C'}
                    </div>

                    <div>

                      <h4>
                        {review.customer_name}
                      </h4>

                      <span>
                        {review.created_at
                          ? new Date(
                              review.created_at
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : ''}
                      </span>

                    </div>

                  </div>

                  <div className="review-card-stars">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={15}
                          fill={
                            star <=
                            Number(
                              review.rating
                            )
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      )
                    )}

                  </div>

                </div>

                <p className="review-card-text">
                  {review.review_text}
                </p>

              </article>
            ))
          )}

        </div>

      </section>

      {/* =================================================
          RELATED PRODUCTS
      ================================================= */}

      {relatedProducts.length > 0 && (
        <section className="product-related-section">

          <div className="section-heading">

            <div>

              <p className="section-eyebrow">
                YOU MAY ALSO LIKE
              </p>

              <h2 className="section-title">
                Related Sarees
              </h2>

            </div>

          </div>

          <div className="product-related-grid">

            {relatedProducts.map(
              (relatedProduct) => (
                <ProductCard
                  key={
                    relatedProduct.id
                  }
                  product={
                    relatedProduct
                  }
                />
              )
            )}

          </div>

        </section>
      )}

    </div>
  )
}