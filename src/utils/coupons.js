// Coupon / discount code catalog + validation logic.
// Kept as pure functions so they can be unit-tested and reused
// by both the cart slice and any component-level derivations.

import { round2 } from './format'

/**
 * Coupon shape:
 *  code           - the code the user types (case-insensitive match)
 *  type           - 'percent' | 'flat'
 *  value          - percent (0-100) or flat amount
 *  minCartValue   - minimum subtotal required to be eligible
 *  expiresAt      - ISO date string; coupon invalid on/after this date
 *  categories     - optional array; if set, discount applies only to
 *                   the portion of the subtotal from these categories
 *  maxDiscount    - optional cap on the discount amount (for percent coupons)
 */
export const COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minCartValue: 500,
    expiresAt: '2030-12-31',
    maxDiscount: 2000,
  },
  {
    code: 'FLAT200',
    type: 'flat',
    value: 200,
    minCartValue: 1000,
    expiresAt: '2030-12-31',
  },
  {
    code: 'ELECTRO15',
    type: 'percent',
    value: 15,
    minCartValue: 0,
    expiresAt: '2030-12-31',
    categories: ['Electronics'],
    maxDiscount: 5000,
  },
  {
    code: 'EXPIRED',
    type: 'percent',
    value: 50,
    minCartValue: 0,
    expiresAt: '2020-01-01', // intentionally expired — for demoing validation
  },
]

const findCoupon = (code) =>
  COUPONS.find((c) => c.code.toUpperCase() === String(code || '').trim().toUpperCase())

/**
 * Validate a coupon against the current cart.
 * @returns { valid: boolean, error?: string, coupon?: object }
 */
export function validateCoupon(code, { subtotal, items }) {
  const trimmed = String(code || '').trim()

  // Format check
  if (!trimmed) return { valid: false, error: 'Please enter a coupon code.' }
  if (!/^[A-Z0-9]{4,20}$/i.test(trimmed))
    return { valid: false, error: 'Invalid coupon format.' }

  const coupon = findCoupon(trimmed)
  if (!coupon) return { valid: false, error: 'This coupon code does not exist.' }

  // Expiry check
  const expiry = new Date(coupon.expiresAt)
  if (Date.now() >= expiry.getTime())
    return { valid: false, error: 'This coupon has expired.' }

  // Minimum cart value
  if (subtotal < coupon.minCartValue)
    return {
      valid: false,
      error: `Add items worth at least ₹${coupon.minCartValue} to use this coupon.`,
    }

  // Category eligibility — must have at least one eligible item
  if (coupon.categories?.length) {
    const eligible = (items || []).some((i) => coupon.categories.includes(i.category))
    if (!eligible)
      return {
        valid: false,
        error: `This coupon applies only to: ${coupon.categories.join(', ')}.`,
      }
  }

  return { valid: true, coupon }
}

/**
 * Compute the discount amount for an already-validated coupon.
 * Category coupons only discount the eligible portion of the subtotal.
 */
export function computeDiscount(coupon, { subtotal, items }) {
  if (!coupon) return 0

  // Base amount the discount applies to
  let base = subtotal
  if (coupon.categories?.length) {
    base = (items || [])
      .filter((i) => coupon.categories.includes(i.category))
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
  }

  let discount = coupon.type === 'percent' ? (base * coupon.value) / 100 : coupon.value

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)

  // Never discount more than the subtotal
  discount = Math.min(discount, subtotal)

  return round2(Math.max(0, discount))
}
