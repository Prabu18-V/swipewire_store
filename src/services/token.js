// JWT token helpers — storage + decode + expiry check.

import { LS_KEYS } from '../utils/constants'

export const getToken = () => localStorage.getItem(LS_KEYS.TOKEN)
export const setToken = (token) => localStorage.setItem(LS_KEYS.TOKEN, token)
export const clearToken = () => localStorage.removeItem(LS_KEYS.TOKEN)

/** Decode the payload of a JWT (no verification — client-side only). */
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** True if the token is missing or past its exp claim. */
export function isTokenExpired(token) {
  const payload = decodeToken(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}
