// Auth API service — login / signup.
//
// Uses REAL Supabase authentication when credentials are configured (.env),
// otherwise falls back to the local mock backend so the app still runs with
// zero setup. Both paths return the SAME shape — { user, token } — so nothing
// downstream (authSlice, AuthContext, components) needs to change.

import { mockApi } from './mockBackend'
import { supabase, isSupabaseConfigured } from './supabaseClient'

// Map a Supabase user + session into our app's { user, token } shape.
function mapSupabase(data) {
  const sbUser = data.user
  const session = data.session
  if (!sbUser || !session) {
    // e.g. Supabase email-confirmation flows return no session until confirmed.
    throw {
      response: {
        status: 400,
        data: { message: 'Check your email to confirm your account, then log in.' },
      },
    }
  }
  return {
    user: {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || sbUser.email.split('@')[0],
      email: sbUser.email,
      role: sbUser.user_metadata?.role || 'customer',
    },
    token: session.access_token, // a REAL, signed JWT issued by Supabase
  }
}

// Normalize Supabase errors into the { response: { status, data.message } }
// shape the rest of the app already expects.
function toApiError(error, fallbackStatus = 401) {
  throw {
    response: {
      status: error?.status || fallbackStatus,
      data: { message: error?.message || 'Authentication failed.' },
    },
  }
}

export const authService = {
  async login({ email, password }) {
    if (!isSupabaseConfigured) return mockApi.login({ email, password })

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toApiError(error, 401)
    return mapSupabase(data)
  },

  async signup({ name, email, password }) {
    if (!isSupabaseConfigured) return mockApi.signup({ name, email, password })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'customer' } },
    })
    if (error) toApiError(error, 409)
    return mapSupabase(data)
  },

  async logout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
  },
}
