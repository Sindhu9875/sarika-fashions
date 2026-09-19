
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Truck,
} from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">

      {/* =========================
          MAIN FOOTER
      ========================== */}
      <div className="container footer-grid">

        {/* BRAND */}
        <div className="footer-brand">
          <h3 className="footer-logo">Sarika Fashions</h3>

          <p className="footer-tagline">
            Elegance Woven Into Every Thread
          </p>

          <p className="footer-description">
            Discover timeless sarees crafted to bring elegance,
            tradition, and beauty to every occasion.
          </p>

          {/* SOCIAL */}
          <div className="footer-social">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={17} />
            </a>

            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={17} />
            </a>
          </div>
        </div>


        {/* SHOP */}
        <div className="footer-column">
          <h4>Shop</h4>

          <ul>
            <li>
              <Link to="/shop">All Sarees</Link>
            </li>

            <li>
              <Link to="/shop?category=silk">
                Silk Sarees
              </Link>
            </li>

            <li>
              <Link to="/shop?category=khadi-cotton">
                Khadi Cotton
              </Link>
            </li>

            <li>
              <Link to="/shop?category=mini-checks">
                Mini Checks
              </Link>
            </li>
          </ul>
        </div>


        {/* CUSTOMER HELP */}
        <div className="footer-column">
          <h4>Customer Care</h4>

          <ul>
            <li>
              <Link to="/track-order">
                Track Order
              </Link>
            </li>

            <li>
              <Link to="/shipping-returns">
                Shipping & Returns
              </Link>
            </li>

            <li>
              <Link to="/faqs">
                FAQs
              </Link>
            </li>

            <li>
              <Link to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>


        {/* CONTACT */}
        <div className="footer-column">
          <h4>Get in Touch</h4>

          <ul className="footer-contact">

            <li>
              <Phone size={15} />
              <a href="tel:+919100389240">
                +91 9100389240
              </a>
            </li>

            <li>
              <Mail size={15} />
              <a href="mailto:madhusarika2005@gmail.com">
                madhusarika2005@gmail.com
              </a>
            </li>

            <li>
              <MapPin size={15} />
              <span>
                Hyderabad, Telangana, India
              </span>
            </li>

          </ul>
        </div>

      </div>


      {/* =========================
          TRUST / PAYMENT SECTION
      ========================== */}
      <div className="footer-trust">

        <div className="container footer-trust-grid">

          {/* SECURE PAYMENT */}
          <div className="footer-trust-item">
            <ShieldCheck size={22} />

            <div>
              <strong>Secure Payments</strong>
              <span>
                Safe & secure online payments
              </span>
            </div>
          </div>


          {/* RAZORPAY */}
          <div className="footer-trust-item">
            <CreditCard size={22} />

            <div>
              <strong>Powered by Razorpay</strong>
              <span>
                Secure payment processing
              </span>
            </div>
          </div>


          {/* SHIPPING */}
          <div className="footer-trust-item">
            <Truck size={22} />

            <div>
              <strong>Reliable Delivery</strong>
              <span>
                Carefully packed & shipped
              </span>
            </div>
          </div>

        </div>

      </div>


      {/* =========================
          POLICIES
      ========================== */}
      <div className="footer-policy">

        <div className="container footer-policy-inner">

          <div className="footer-policy-links">

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <span>•</span>

            <Link to="/terms">
              Terms & Conditions
            </Link>

            <span>•</span>

            <Link to="/refund-policy">
              Refund & Cancellation
            </Link>

            <span>•</span>

            <Link to="/shipping-policy">
              Shipping Policy
            </Link>

          </div>

        </div>

      </div>


      {/* =========================
          COPYRIGHT
      ========================== */}
      <div className="footer-bottom">

        <div className="container">

          <p>
            © {new Date().getFullYear()} Sarika Fashions.
            All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  )
}
