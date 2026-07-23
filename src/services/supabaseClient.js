// Supabase client — real authentication backend.
//
// Credentials come from environment variables (a .env file at the project root),
// never hardcoded. Vite exposes vars prefixed with VITE_ to the browser.
//
//   .env
//   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//
// The `anon` key is the *public* client key — it's designed to be shipped to the
// browser. Row-Level Security on the Supabase side is what actually protects data.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `isSupabaseConfigured` lets the rest of the app gracefully fall back to the
// local mock auth if no .env credentials are present (e.g. before setup).
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true, // Supabase manages its own session in localStorage
        autoRefreshToken: true, // refreshes the JWT before it expires
      },
    })
  : null
