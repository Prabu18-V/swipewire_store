// Checkout & order summary — protected route.
// Itemized list, shipping form (React Hook Form), applied discount, taxes,
// final payable amount, and order placement.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import OrderSummary from '../components/OrderSummary'
import { EmptyState } from '../components/ui'
import { formatCurrency } from '../utils/format'
import { handleImgError } from '../utils/imageFallback'
import { toast } from '../components/Toast'

export default function CheckoutPage() {
  const { items, totals, coupon, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const onSubmit = async (data) => {
    // Simulate order placement.
    await new Promise((res) => setTimeout(res, 700))
    const order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      totals,
      coupon: coupon?.code || null,
      shipping: data,
    }
    setPlaced(order)
    clear()
    toast('Order placed successfully!', 'success')
  }

  // Empty cart guard (unless we just placed an order).
  if (items.length === 0 && !placed) {
    return (
      <EmptyState
        title="Nothing to check out"
        subtitle="Your cart is empty."
        action={
          <Link to="/products" className="btn-primary">
            Browse products
          </Link>
        }
      />
    )
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Order confirmed!</h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-semibold text-slate-700">{placed.id}</span> — thank you for your purchase.
        </p>
        <div className="card mt-6 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Amount paid</span>
            <span className="text-lg font-bold text-slate-900">{formatCurrency(placed.totals.total)}</span>
          </div>
        </div>
        <Link to="/products" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping form + itemized list */}
        <div className="space-y-6 lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-5" id="checkout-form">
            <h2 className="text-sm font-semibold text-slate-800">Shipping details</h2>

            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input
                id="name"
                className="input"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="address">Address</label>
              <textarea
                id="address"
                rows={3}
                className="input"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="city">City</label>
                <input id="city" className="input" {...register('city', { required: 'Required' })} />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="pincode">PIN code</label>
                <input
                  id="pincode"
                  className="input"
                  {...register('pincode', {
                    required: 'Required',
                    pattern: { value: /^\d{6}$/, message: '6-digit PIN' },
                  })}
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode.message}</p>}
              </div>
            </div>
          </form>

          {/* Itemized list */}
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Order items</h2>
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" onError={handleImgError} className="h-12 w-12 rounded object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary + place order */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Payable</h2>
            <OrderSummary />
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="btn-primary mt-5 w-full"
            >
              {isSubmitting ? 'Placing order…' : `Pay ${formatCurrency(totals.total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
