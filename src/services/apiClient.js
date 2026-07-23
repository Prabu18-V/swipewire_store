// Axios instance with JWT request interceptor + auto-logout response interceptor.
//
// NOTE: In this project the actual data layer is a localStorage-backed mock
// (see mockBackend.js). This Axios client demonstrates the real-world wiring —
// interceptors, base URL, auth headers, centralized error handling — that you
// would use against a live backend. The service modules call the mock directly,
// but every request is still routed through `withAuth` so the interceptor
// pattern is exercised. Swap `mockApi.*` for `api.get/post/...` to go live.

import axios from 'axios'
import { getToken, clearToken, isTokenExpired } from './token'
import { LS_KEYS } from '../utils/constants'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — auto logout on 401 / expired token.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken()
      localStorage.removeItem(LS_KEYS.USER)
      // Let the app react (AuthContext listens for this).
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  },
)

/**
 * Guard wrapper used by services that require authentication.
 * Mirrors what the response interceptor would do for a live 401:
 * if the token is missing/expired, fail fast and trigger logout.
 */
export function withAuth(fn) {
  return async (...args) => {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
      clearToken()
      localStorage.removeItem(LS_KEYS.USER)
      window.dispatchEvent(new CustomEvent('auth:logout'))
      throw { response: { status: 401, data: { message: 'Session expired. Please log in again.' } } }
    }
    return fn(...args)
  }
}
