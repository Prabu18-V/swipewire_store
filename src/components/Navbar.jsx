// Responsive top navigation with cart badge + auth-aware actions.

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import ConfirmDialog from './ConfirmDialog'
import Logo from './Logo'
import { toast } from './Toast'

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function Navbar() {
  const { count } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  // Open the confirmation dialog (and close the mobile menu).
  const requestLogout = () => {
    setOpen(false)
    setConfirmLogout(true)
  }

  // Actually log out after the user confirms.
  const handleLogout = () => {
    logout()
    setConfirmLogout(false)
    toast('You have been logged out', 'info')
    navigate('/products')
  }

  const NavLinks = ({ onClick }) => (
    <>
      <NavLink to="/products" className={linkClass} onClick={onClick}>
        Products
      </NavLink>
      {isAuthenticated && (
        <NavLink to="/admin/products" className={linkClass} onClick={onClick}>
          Manage
        </NavLink>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      {/* Thin electric accent line at the very top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: logo + primary nav grouped together */}
        <div className="flex items-center gap-6">
          <Link to="/products" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ink-900">
            <Logo />
            <span>
              Swipe<span className="text-brand-600">wire</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Cart"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <span className="max-w-[140px] truncate text-sm text-slate-600" title={user.name}>
                  Hi, <span className="font-medium text-slate-800">{user.name}</span>
                </span>
                <button onClick={requestLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-1 border-t border-slate-200 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLinks onClick={() => setOpen(false)} />
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
            {isAuthenticated ? (
              <>
                <span className="px-1 text-sm text-slate-600">Signed in as {user.name}</span>
                <button onClick={requestLogout} className="btn-secondary w-full">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary w-full" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Yes, log out"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  )
}

const CartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-.534 2.28-2.036 2.686-3.253l1.087-3.256a.75.75 0 00-.717-.988H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
  </svg>
)
