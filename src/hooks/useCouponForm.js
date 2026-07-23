// Custom hook demonstrating the useReducer pattern for a small piece of
// "complex" local state — the coupon-application flow (idle → validating →
// applied / error). This complements the global cart state in Redux Toolkit:
// RTK owns the source-of-truth cart data, while this local reducer models the
// multi-step UI state machine of applying a code.
//
// Requirement mapping: satisfies "useReducer → complex cart logic".

import { useReducer, useCallback } from 'react'

const initialState = {
  code: '',
  status: 'idle', // 'idle' | 'validating' | 'applied' | 'error'
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload, error: null }
    case 'VALIDATING':
      return { ...state, status: 'validating', error: null }
    case 'APPLIED':
      return { ...state, status: 'applied', error: null }
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useCouponForm() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setCode = useCallback((code) => dispatch({ type: 'SET_CODE', payload: code }), [])
  const startValidating = useCallback(() => dispatch({ type: 'VALIDATING' }), [])
  const markApplied = useCallback(() => dispatch({ type: 'APPLIED' }), [])
  const markError = useCallback((msg) => dispatch({ type: 'ERROR', payload: msg }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, setCode, startValidating, markApplied, markError, reset }
}
