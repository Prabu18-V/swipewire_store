// App-wide constants

// Tax rate applied at checkout (e.g. GST/VAT). 18% GST.
export const TAX_RATE = 0.18

// Base URL of the real product API (DummyJSON). Overridable via a .env var.
export const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL || 'https://dummyjson.com'

export const LS_KEYS = {
  TOKEN: 'sw_token',
  USER: 'sw_user',
  CART: 'sw_cart',
  PRODUCTS: 'sw_products',
  USERS: 'sw_users',
  SEED_VERSION: 'sw_seed_version',
}

// Bump this whenever SEED_PRODUCTS changes so the mock backend re-seeds
// the catalog automatically (no manual localStorage clearing needed).
export const SEED_VERSION = 2

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
]
