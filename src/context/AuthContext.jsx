// AuthContext — satisfies the useContext requirement and centralizes the
// auto-logout-on-token-expiry behavior. It reads from the Redux auth slice
// (single source of truth) and exposes a clean context API to components,
// plus it listens for the global 'auth:logout' event fired by the Axios
// response interceptor / withAuth guard on a 401 or expired token.

import { createContext, useContext, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  login as loginThunk,
  signup as signupThunk,
  logout as logoutAction,
  selectUser,
  selectAuthStatus,
  selectAuthError,
} from '../redux/authSlice'
import { getToken, isTokenExpired } from '../services/token'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)

  const logout = useCallback(() => {
    // End the Supabase session too (no-op when using the local mock).
    authService.logout?.()
    dispatch(logoutAction())
  }, [dispatch])
  const login = useCallback((creds) => dispatch(loginThunk(creds)).unwrap(), [dispatch])
  const signup = useCallback((data) => dispatch(signupThunk(data)).unwrap(), [dispatch])

  // Listen for forced logout from the API interceptor (401 / expired token).
  useEffect(() => {
    const handler = () => dispatch(logoutAction())
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [dispatch])

  // Periodically check for token expiry to auto-logout mid-session.
  useEffect(() => {
    if (!user) return
    const check = () => {
      const token = getToken()
      if (!token || isTokenExpired(token)) dispatch(logoutAction())
    }
    check()
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [user, dispatch])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    status,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider')
  return ctx
}
