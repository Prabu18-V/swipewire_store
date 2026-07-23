// Formatting helpers

/** Format a number as INR currency. */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)

/** Round to 2 decimals as a number (avoids floating point noise in totals). */
export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100

/** Percentage discount from an original price → current price (integer %). */
export const discountPercent = (original, price) => {
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}
