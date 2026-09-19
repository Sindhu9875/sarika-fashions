import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Checkout from './pages/Checkout.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

import TrackOrder from './pages/TrackOrder.jsx'
import ShippingReturns from './pages/ShippingReturns.jsx'
import FAQs from './pages/FAQs.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Terms from './pages/Terms.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import ShippingPolicy from './pages/ShippingPolicy.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminAddProduct from './pages/admin/AdminAddProduct.jsx'
import AdminInfo from './pages/admin/AdminInfo.jsx'


function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* =====================================================
            PUBLIC WEBSITE
        ====================================================== */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/track-order"
            element={<TrackOrder />}
          />

          <Route
            path="/shipping-returns"
            element={<ShippingReturns />}
          />

          <Route
            path="/faqs"
            element={<FAQs />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

          <Route
            path="/refund-policy"
            element={<RefundPolicy />}
          />

          <Route
            path="/shipping-policy"
            element={<ShippingPolicy />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>


        {/* =====================================================
            ADMIN LOGIN
            PUBLIC, BUT ONLY THIS ADMIN PAGE IS PUBLIC
        ====================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =====================================================
            PROTECTED ADMIN AREA
        ====================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="products/add"
              element={<AdminAddProduct />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="customers"
              element={<AdminInfo />}
            />

            <Route
              path="categories"
              element={<AdminInfo />}
            />

          </Route>

        </Route>

      </Routes>
    </>
  )
}

export default App