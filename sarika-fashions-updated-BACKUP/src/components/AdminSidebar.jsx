// import React from 'react'
// import { NavLink, useNavigate } from 'react-router-dom'
// import {
//   LayoutDashboard,
//   Package,
//   ClipboardList,
//   Users,
//   Tags,
//   Settings,
//   LogOut,
//   X,
// } from 'lucide-react'
// import './AdminSidebar.css'

// const LINKS = [
//   { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
//   { to: '/admin/products', label: 'Products', icon: Package },
//   { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
//   { to: '/admin/customers', label: 'Customers', icon: Users },
//   { to: '/admin/categories', label: 'Categories', icon: Tags },
//   { to: '/admin/settings', label: 'Settings', icon: Settings },
// ]

// export default function AdminSidebar({ open, onClose }) {
//   const navigate = useNavigate()
//   return (
//     <>
//       <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
//         <div className="admin-sidebar-header">
//           <span className="navbar-logo-main">Sarika</span>
//           <button className="mobile-only admin-sidebar-close" onClick={onClose} aria-label="Close menu">
//             <X size={20} />
//           </button>
//         </div>
//         <nav className="admin-sidebar-nav">
//           {LINKS.map(({ to, label, icon: Icon, end }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={end}
//               onClick={onClose}
//               className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
//             >
//               <Icon size={18} />
//               <span>{label}</span>
//             </NavLink>
//           ))}
//         </nav>
//         <button className="admin-nav-link admin-logout" onClick={() => navigate("/")}>
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </aside>
//       {open && <div className="admin-sidebar-overlay mobile-only" onClick={onClose} />}
//     </>
//   )
// }


import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Tags,
  Settings,
  Store,
  X,
} from 'lucide-react'
import './AdminSidebar.css'

const LINKS = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: ClipboardList,
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    icon: Tags,
  },
]

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate()

  const handleStore = () => {
    navigate('/')
    onClose?.()
  }

  return (
    <>
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>

        {/* HEADER */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <span className="navbar-logo-main">Sarika</span>
            <span className="admin-sidebar-label">ADMIN PANEL</span>
          </div>

          <button
            type="button"
            className="mobile-only admin-sidebar-close"
            onClick={onClose}
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-sidebar-nav">

          <p className="admin-sidebar-heading">
            MANAGEMENT
          </p>

          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

        </nav>

        {/* BOTTOM */}
        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-store-link"
            onClick={handleStore}
          >
            <Store size={18} />
            <span>View Store</span>
          </button>

        </div>

      </aside>

      {open && (
        <div
          className="admin-sidebar-overlay mobile-only"
          onClick={onClose}
        />
      )}
    </>
  )
}