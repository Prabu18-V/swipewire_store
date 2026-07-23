// Reusable price breakdown block used by the cart and checkout pages.

import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'
import { TAX_RATE } from '../utils/constants'

export default function OrderSummary({ showCoupon = true }) {
  const { totals, coupon } = useCart()

  return (
    <div className="space-y-3">
      <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
      {showCoupon && totals.discount > 0 && (
        <Row
          label={`Discount${coupon ? ` (${coupon.code})` : ''}`}
          value={`− ${formatCurrency(totals.discount)}`}
          className="text-emerald-700"
        />
      )}
      <Row label={`Tax (GST ${Math.round(TAX_RATE * 100)}%)`} value={formatCurrency(totals.tax)} />
      <div className="border-t border-slate-200 pt-3">
        <Row
          label="Total"
          value={formatCurrency(totals.total)}
          className="text-base font-bold text-slate-900"
        />
      </div>
    </div>
  )
}

function Row({ label, value, className = '' }) {
  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
