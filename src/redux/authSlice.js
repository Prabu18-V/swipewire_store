// Auth slice — login/signup thunks, session persistence, auto-logout.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'
import { setToken, clearToken, getToken, isTokenExpired } from '../services/token'
import { LS_KEYS } from '../utils/constants'

const loadUser = () => {
  try {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
      clearToken()
      localStorage.removeItem(LS_KEYS.USER)
      return null
    }
    return JSON.parse(localStorage.getItem(LS_KEYS.USER)) || null
  } catch {
    return null
  }
}

const persistSession = ({ user, token }) => {
  setToken(token)
  localStorage.setItem(LS_KEYS.USER, JSON.stringify(user))
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials)
    persistSession(data)
    return data.user
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Login failed. Please try again.')
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.signup(payload)
    persistSession(data)
    return data.user
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Signup failed. Please try again.')
  }
})

const initialState = {
  user: loadUser(),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.status = 'idle'
      state.error = null
      clearToken()
      localStorage.removeItem(LS_KEYS.USER)
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => Boolean(state.auth.user)
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
