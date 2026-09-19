import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Gem,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

import FeatureCard from '../components/FeatureCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import { categories } from '../data/products.js'

import heroSaree from '../assets/hero-saree.jpg'
import heroSaree2 from '../assets/hero-saree-2.jpg'
import heroSaree3 from '../assets/hero-saree-3.jpg'
import heroSaree4 from '../assets/hero-saree-4.jpg'
import editorialImage from '../assets/editorial.jpg'

import './Home.css'

/* =========================================
   FEATURES
   ========================================= */
const FEATURES = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', text: '7 days return policy' },
  { icon: ShieldCheck, title: 'Secure Payment', text: '100% protected checkout' },
  { icon: Gem, title: 'Premium Quality', text: 'Handpicked with care' },
]

/* =========================================
   HERO SLIDES
   ========================================= */
const HERO_SLIDES = [heroSaree, heroSaree2, heroSaree3, heroSaree4]

/* =========================================
   HOME COMPONENT
   ========================================= */
export default function Home() {
  const categoryScroller = useRef(null)
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 320, behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">

      {/* =========================================
          HERO
          ========================================= */}
      <section className="hero hero-fullscreen">
        <div className="hero-background" style={{ backgroundImage: `url(${HERO_SLIDES[heroSlide]})` }} />
        <div className="hero-gradient" />
        <div className="container hero-inner hero-full-inner">
          <div className="hero-copy">
            <div className="hero-kicker"><Sparkles size={15} /><span>NEW COLLECTION • 2026</span></div>
            <p className="hero-overline">SARIKA FASHIONS</p>
            <h1 className="hero-title">Andham<em>.Aathmiyatha.</em><br />Sarika Fashions.</h1>
            <p className="hero-text">Every Saree Has a Story,<br />Start Yours with Sarika Fashions.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary hero-primary">Shop The Collection <ArrowUpRight size={16} /></Link>
              <Link to="/shop" className="hero-text-button">Explore Sarees <span>→</span></Link>
            </div>
            <div className="hero-mini-stats">
              <div><strong>100+</strong><span>Happy Customers</span></div>
              <div><strong>100+</strong><span>Curated Designs</span></div>
              <div><strong>4.5/5</strong><span>Loved By Shoppers</span></div>
            </div>
          </div>
        </div>

        <div className="hero-slider-controls">
          <button type="button" className="hero-slider-arrow" onClick={() => setHeroSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}><ChevronLeft size={18} /></button>
          <div className="hero-slider-dots">
            {HERO_SLIDES.map((_, index) => (
              <button key={index} type="button" className={`hero-slider-dot ${heroSlide === index ? 'active' : ''}`} onClick={() => setHeroSlide(index)} />
            ))}
          </div>
          <button type="button" className="hero-slider-arrow" onClick={() => setHeroSlide((heroSlide + 1) % HERO_SLIDES.length)}><ChevronRight size={18} /></button>
        </div>
      </section>

      {/* =========================================
          FEATURES
          ========================================= */}
      <section className="section features-section">
        <div className="container features-grid">
          {FEATURES.map((feature, index) => (
            <div className="reveal" style={{ '--delay': `${index * 70}ms` }} key={feature.title}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          CATEGORY
          ========================================= */}
      <section className="section home-section-soft">
        <div className="container">
          <div className="section-header">
            <div><span className="eyebrow">Discover Your Style</span><h2 className="section-title">Shop <em>by Category</em></h2></div>
            <Link to="/shop" className="section-link">View All <ArrowUpRight size={15} /></Link>
          </div>
          <div className="scroller-wrap">
            <button type="button" className="scroller-arrow scroller-arrow-left desktop-only" onClick={() => scroll(categoryScroller, -1)}><ChevronLeft size={18} /></button>
            <div className="category-scroller" ref={categoryScroller}>
              {categories.map((category) => (<CategoryCard key={category.id} category={category} />))}
            </div>
            <button type="button" className="scroller-arrow scroller-arrow-right desktop-only" onClick={() => scroll(categoryScroller, 1)}><ChevronRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* =========================================
          EDITORIAL
          ========================================= */}
      <section className="editorial-home" style={{ backgroundImage: `url(${editorialImage})` }}>
        <div className="editorial-image-overlay" />
        <div className="container editorial-full-content">
          <div className="editorial-copy">
            <span className="eyebrow">The Art of Tradition</span>
            <h2>The Art <em>of Draping.</em></h2>
            <p>Every saree carries a story of heritage, artistry and generations of timeless craftsmanship.</p>
            <Link to="/about" className="btn btn-outline editorial-story-button">Discover Our Story <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FESTIVE SECTION - NEW HORIZONTAL
          ========================================= */}
      <section className="section festive-section-bg">
        <div className="container">
          <div className="festive-horizontal-card">
            <div className="festive-horizontal-content">
              <span className="eyebrow" style={{ color: '#E8C39E', letterSpacing: '0.2em' }}>FESTIVE EDIT</span>
              <h2>Sarees for Every Celebration</h2>
              <p>From intimate pujas to grand weddings, find the drape that matches the occasion.</p>
              <Link to="/shop" className="btn btn-gold">SHOP FESTIVE COLLECTION</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}