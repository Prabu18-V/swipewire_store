// Coupon entry + applied-coupon display. Wires into the cart's coupon logic.
// Local multi-step form state (idle → validating → applied/error) is managed
// with a useReducer via the useCouponForm custom hook.

import { useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { useCouponForm } from '../hooks/useCouponForm'
import { formatCurrency } from '../utils/format'

export default function CouponInput() {
  const { coupon, couponError, applyCode, removeCode, totals } = useCart()
  const { state, setCode, startValidating, markApplied, markError } = useCouponForm()

  // Reflect the cart's validation result back into the local reducer state.
  useEffect(() => {
    if (coupon) markApplied()
    else if (couponError) markError(couponError)
  }, [coupon, couponError, markApplied, markError])

  const handleApply = (e) => {
    e.preventDefault()
    startValidating()
    applyCode(state.code.trim())
  }

  if (coupon) {
    return (
      <div className="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Coupon “{coupon.code}” applied
            </p>
            <p className="text-xs text-emerald-700">
              You saved {formatCurrency(totals.discount)}
            </p>
          </div>
          <button
            onClick={removeCode}
            className="text-xs font-medium text-emerald-700 underline hover:text-emerald-900"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <label htmlFor="coupon" className="label">
        Have a coupon?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={state.code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. WELCOME10"
          className="input uppercase"
        />
        <button
          type="submit"
          className="btn-secondary shrink-0"
          disabled={!state.code.trim() || state.status === 'validating'}
        >
          {state.status === 'validating' ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {(state.error || couponError) && (
        <p className="text-xs text-red-600">{state.error || couponError}</p>
      )}
      <p className="text-xs text-slate-400">
        Try: WELCOME10, FLAT200, ELECTRO15 (or EXPIRED to see validation).
      </p>
    </form>
  )
}
