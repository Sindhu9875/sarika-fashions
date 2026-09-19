# Sarika Fashions — Frontend

Premium Indian saree e-commerce storefront + admin panel, built with **React + Vite** (JavaScript, no TypeScript). Frontend-only — works completely without a backend, using mock data and `localStorage`.

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Dependencies

- `react`, `react-dom`
- `react-router-dom` — routing
- `axios` — API service layer (`src/services/api.js`), not required for the app to run
- `lucide-react` — icons

All installed automatically by `npm install`.

## Project structure

```
src/
  components/     Reusable UI: Navbar, Footer, ProductCard, CartItem, AdminSidebar, etc.
  layouts/        MainLayout (storefront) and AdminLayout (admin panel)
  pages/          One file per route, plus pages/admin/ for the admin panel
  context/        CartContext & WishlistContext (state + localStorage persistence)
  data/           Mock products.js and orders.js — swap for real API data later
  services/       api.js — Axios instance pointed at http://localhost:8000/api
  index.css       Design tokens (colors, type, spacing) + global styles
```

## Connecting the real backend later

- Replace the arrays in `src/data/products.js` / `src/data/orders.js` with calls to `productsApi` / `ordersApi` from `src/services/api.js`.
- Swap the placeholder payment step in `src/pages/Checkout.jsx` for Razorpay's checkout script once the backend issues an order ID.
- Wire `Login.jsx` / `Register.jsx` to `authApi.login` / `authApi.register` and store the returned token (the Axios interceptor already looks for `localStorage['sarika_token']`).

## Images

No photography is bundled. Every product/hero image is currently a generated `<SareeArt>` SVG placeholder (`src/components/SareeArt.jsx`) so nothing ever shows a broken image icon. Drop real photos into `public/images/` (e.g. `saree1.jpg` … `saree12.jpg` to match `src/data/products.js`) and swap `<SareeArt variant={...} />` for a plain `<img src={product.image} />` wherever you'd like real photos to appear.

## Routes

```
/                     Home
/shop                 Shop (filters, sort, search via ?search=)
/product/:id          Product details
/cart                 Cart
/wishlist             Wishlist
/checkout             Checkout (shipping → payment → review)
/login
/register

/admin                Admin dashboard
/admin/products       Manage products (edit/delete)
/admin/products/add   Add product
/admin/orders         Orders
```
