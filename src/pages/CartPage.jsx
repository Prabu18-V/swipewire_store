// Shopping cart page — line items, coupon entry, live totals, checkout CTA.

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import CartItem from '../components/CartItem'
import CouponInput from '../components/CouponInput'
import OrderSummary from '../components/OrderSummary'
import { EmptyState } from '../components/ui'

export default function CartPage() {
  const { items, clear } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const goToCheckout = () => {
    // Checkout is protected; ProtectedRoute will redirect to login if needed,
    // but we can send them straight to login with a return path for a smoother flow.
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        subtitle="Looks like you haven't added anything yet."
        action={
          <Link to="/products" className="btn-primary">
            Browse products
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
        <button onClick={clear} className="text-sm font-medium text-red-600 hover:text-red-700">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="card divide-y divide-slate-100 px-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <CouponInput />
          </div>
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Order Summary</h2>
            <OrderSummary />
            <button onClick={goToCheckout} className="btn-primary mt-5 w-full">
              Proceed to checkout
            </button>
            <Link
              to="/products"
              className="mt-2 block text-center text-sm text-brand-700 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
