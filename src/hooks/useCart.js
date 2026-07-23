// Custom hook: reusable cart logic.
// Wraps Redux cart selectors + dispatchers, and uses useMemo/useCallback
// so consumers get memoized totals and stable action handlers.

import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  selectCartItems,
  selectCoupon,
  selectCouponError,
  selectCartCount,
} from '../redux/cartSlice'
import { calcTotals } from '../utils/cartCalculations'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const coupon = useSelector(selectCoupon)
  const couponError = useSelector(selectCouponError)
  const count = useSelector(selectCartCount)

  // Derived pricing — memoized so it only recomputes when items/coupon change.
  const totals = useMemo(() => calcTotals(items, coupon), [items, coupon])

  // Stable callbacks — prevent needless re-renders of child components.
  const add = useCallback((product, qty = 1) => dispatch(addToCart({ ...product, quantity: qty })), [dispatch])
  const remove = useCallback((id) => dispatch(removeFromCart(id)), [dispatch])
  const setQty = useCallback((id, quantity) => dispatch(setQuantity({ id, quantity })), [dispatch])
  const increment = useCallback((id) => dispatch(incrementQuantity(id)), [dispatch])
  const decrement = useCallback((id) => dispatch(decrementQuantity(id)), [dispatch])
  const applyCode = useCallback((code) => dispatch(applyCoupon(code)), [dispatch])
  const removeCode = useCallback(() => dispatch(removeCoupon()), [dispatch])
  const clear = useCallback(() => dispatch(clearCart()), [dispatch])

  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items])

  return {
    items,
    coupon,
    couponError,
    count,
    totals,
    add,
    remove,
    setQty,
    increment,
    decrement,
    applyCode,
    removeCode,
    clear,
    isInCart,
  }
}
