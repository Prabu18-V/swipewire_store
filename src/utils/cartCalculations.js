// Pure cart math — single source of truth for pricing.
// Used by the cart slice, the useCart hook, and useMemo derivations.

import { TAX_RATE } from './constants'
import { round2 } from './format'
import { computeDiscount } from './coupons'

/** Sum of price * quantity across all cart items. */
export const calcSubtotal = (items = []) =>
  round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0))

/** Total number of units in the cart (for the navbar badge). */
export const calcItemCount = (items = []) =>
  items.reduce((sum, i) => sum + i.quantity, 0)

/**
 * Full cart totals breakdown.
 * discount is computed on the pre-tax subtotal; tax is applied to
 * the discounted (taxable) amount.
 */
export function calcTotals(items = [], coupon = null) {
  const subtotal = calcSubtotal(items)
  const discount = computeDiscount(coupon, { subtotal, items })
  const taxable = Math.max(0, subtotal - discount)
  const tax = round2(taxable * TAX_RATE)
  const total = round2(taxable + tax)

  return { subtotal, discount, taxable, tax, total }
}
