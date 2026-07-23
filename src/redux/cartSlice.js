// Cart slice — the core business logic of the app.
// Handles add/remove/quantity, coupon application, and persists to localStorage.
// Totals themselves are computed via pure functions + memoized selectors so
// the pricing math lives in one place (utils/cartCalculations).

import { createSlice } from '@reduxjs/toolkit'
import { LS_KEYS } from '../utils/constants'
import { calcSubtotal, calcItemCount, calcTotals } from '../utils/cartCalculations'
import { validateCoupon } from '../utils/coupons'

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.CART)) || { items: [], coupon: null }
  } catch {
    return { items: [], coupon: null }
  }
}

const persist = (state) =>
  localStorage.setItem(LS_KEYS.CART, JSON.stringify({ items: state.items, coupon: state.coupon }))

const MAX_QTY = 99

const initialState = {
  ...loadCart(),
  couponError: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const qty = product.quantity || 1
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity = Math.min(MAX_QTY, existing.quantity + qty)
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: Math.min(MAX_QTY, qty),
        })
      }
      revalidateCoupon(state)
      persist(state)
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
      revalidateCoupon(state)
      persist(state)
    },

    // Set an absolute quantity, clamped to [1, MAX_QTY].
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (!item) return
      const q = Number(quantity)
      // Guard against invalid quantities (NaN, negative, zero).
      if (!Number.isFinite(q) || q <= 0) return
      item.quantity = Math.min(MAX_QTY, Math.floor(q))
      revalidateCoupon(state)
      persist(state)
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity = Math.min(MAX_QTY, item.quantity + 1)
      revalidateCoupon(state)
      persist(state)
    },

    decrementQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (!item) return
      // Never allow quantity below 1 — removal is an explicit action.
      item.quantity = Math.max(1, item.quantity - 1)
      revalidateCoupon(state)
      persist(state)
    },

    applyCoupon: (state, action) => {
      const code = action.payload
      const subtotal = calcSubtotal(state.items)
      const result = validateCoupon(code, { subtotal, items: state.items })
      if (!result.valid) {
        state.couponError = result.error
        return
      }
      state.coupon = result.coupon
      state.couponError = null
      persist(state)
    },

    removeCoupon: (state) => {
      state.coupon = null
      state.couponError = null
      persist(state)
    },

    clearCart: (state) => {
      state.items = []
      state.coupon = null
      state.couponError = null
      persist(state)
    },
  },
})

// If cart contents change, an applied coupon may no longer be valid
// (e.g. subtotal drops below the minimum). Re-check and drop if invalid.
function revalidateCoupon(state) {
  if (!state.coupon) return
  const subtotal = calcSubtotal(state.items)
  const result = validateCoupon(state.coupon.code, { subtotal, items: state.items })
  if (!result.valid) {
    state.coupon = null
    state.couponError = `Coupon removed: ${result.error}`
  }
}

export const {
  addToCart,
  removeFromCart,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions

// ---- selectors ----
export const selectCartItems = (state) => state.cart.items
export const selectCoupon = (state) => state.cart.coupon
export const selectCouponError = (state) => state.cart.couponError
export const selectCartCount = (state) => calcItemCount(state.cart.items)
export const selectCartTotals = (state) => calcTotals(state.cart.items, state.cart.coupon)

export default cartSlice.reducer
