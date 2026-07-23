// A tiny in-browser mock backend.
// Simulates a REST API backed by localStorage, with fake JWT issuance.
// This lets the whole app run standalone with zero external setup, while
// the components/services still use realistic async CRUD + auth flows.

import { LS_KEYS, SEED_VERSION } from '../utils/constants'

// ---------- helpers ----------

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms))

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

// Fake JWT: base64url header.payload.signature — NOT cryptographically secure.
// Purely to demonstrate token storage / decode / expiry handling on the client.
const b64url = (obj) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const makeToken = (user, ttlSeconds = 60 * 60) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + ttlSeconds,
  }
  return `${b64url(header)}.${b64url(payload)}.mock-signature`
}

// ---------- seed data ----------

const img = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop`

const SEED_PRODUCTS = [
  // ---- Electronics ----
  {
    id: 'p1',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 8999,
    originalPrice: 11999,
    category: 'Electronics',
    description:
      'Immersive sound with active noise cancellation, 30-hour battery life, and plush memory-foam earcups.',
    image: img('1505740420928-5e560c06d30e'),
    stock: 24,
    rating: 4.6,
    reviews: 214,
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard (RGB)',
    price: 4499,
    originalPrice: 5499,
    category: 'Electronics',
    description: 'Hot-swappable switches, per-key RGB, and an aircraft-grade aluminium frame.',
    image: img('1587829741301-dc798b83add3'),
    stock: 40,
    rating: 4.4,
    reviews: 98,
  },
  {
    id: 'p3',
    name: 'Smart Fitness Watch',
    price: 6499,
    originalPrice: 7999,
    category: 'Electronics',
    description: 'AMOLED display, heart-rate & SpO2 tracking, GPS, and 7-day battery life.',
    image: img('1523275335684-37898b6baf30'),
    stock: 33,
    rating: 4.5,
    reviews: 176,
  },
  {
    id: 'p4',
    name: 'True Wireless Earbuds',
    price: 2999,
    originalPrice: 3999,
    category: 'Electronics',
    description: 'Crisp audio, low-latency gaming mode, and a compact wireless charging case.',
    image: img('1590658268037-6bf12165a8df'),
    stock: 60,
    rating: 4.2,
    reviews: 142,
  },

  // ---- Clothing ----
  {
    id: 'p5',
    name: 'Classic Cotton T-Shirt',
    price: 799,
    originalPrice: 1199,
    category: 'Clothing',
    description: '100% organic combed cotton. Breathable, pre-shrunk, and built to last.',
    image: img('1521572163474-6864f9cf17ab'),
    stock: 120,
    rating: 4.3,
    reviews: 305,
  },
  {
    id: 'p6',
    name: 'Everyday Running Sneakers',
    price: 3499,
    originalPrice: 4499,
    category: 'Clothing',
    description: 'Lightweight knit upper, responsive foam midsole, and a grippy rubber outsole.',
    image: img('1542291026-7eec264c27ff'),
    stock: 45,
    rating: 4.5,
    reviews: 189,
  },

  // ---- Home & Kitchen ----
  {
    id: 'p7',
    name: 'Stainless Steel Cookware Set',
    price: 6299,
    originalPrice: 8499,
    category: 'Home & Kitchen',
    description: 'Tri-ply 8-piece set with even heat distribution and ergonomic handles.',
    image: img('1556909212-d5b604d0c90d'),
    stock: 15,
    rating: 4.7,
    reviews: 64,
  },
  {
    id: 'p8',
    name: 'Drip Coffee Maker',
    price: 3799,
    originalPrice: 4599,
    category: 'Home & Kitchen',
    description: 'Programmable 12-cup brewer with a reusable filter and keep-warm plate.',
    image: img('1517668808822-9ebb02f2a0e6'),
    stock: 28,
    rating: 4.4,
    reviews: 87,
  },

  // ---- Books ----
  {
    id: 'p9',
    name: 'The Pragmatic Programmer',
    price: 1299,
    originalPrice: 1699,
    category: 'Books',
    description: 'A timeless classic on software craftsmanship and pragmatic engineering.',
    image: img('1544716278-ca5e3f4abd8c'),
    stock: 60,
    rating: 4.8,
    reviews: 421,
  },
  {
    id: 'p10',
    name: 'Atomic Habits',
    price: 899,
    originalPrice: 1299,
    category: 'Books',
    description: 'An easy & proven way to build good habits and break bad ones.',
    image: img('1512820790803-83ca734da794'),
    stock: 90,
    rating: 4.9,
    reviews: 612,
  },

  // ---- Sports ----
  {
    id: 'p11',
    name: 'Yoga Mat (6mm, Non-Slip)',
    price: 1099,
    originalPrice: 1499,
    category: 'Sports',
    description: 'Extra-thick, eco-friendly TPE mat with a textured non-slip surface.',
    image: img('1601925260368-ae2f83cf8b7f'),
    stock: 80,
    rating: 4.3,
    reviews: 118,
  },
  {
    id: 'p12',
    name: 'Adjustable Dumbbell (Pair)',
    price: 5499,
    originalPrice: 6999,
    category: 'Sports',
    description: 'Space-saving dumbbells with a quick-select weight dial, 2.5–24 kg per hand.',
    image: img('1571019614242-c5c5dee9f50b'),
    stock: 22,
    rating: 4.6,
    reviews: 73,
  },

  // ---- Beauty ----
  {
    id: 'p13',
    name: 'Signature Eau de Parfum',
    price: 2499,
    originalPrice: 3299,
    category: 'Beauty',
    description: 'A warm, long-lasting fragrance with notes of amber, vanilla, and cedarwood.',
    image: img('1541643600914-78b084683601'),
    stock: 50,
    rating: 4.5,
    reviews: 134,
  },
  {
    id: 'p14',
    name: 'Vitamin C Skincare Set',
    price: 1899,
    originalPrice: 2599,
    category: 'Beauty',
    description: 'Brightening serum, moisturizer, and cleanser for a radiant everyday glow.',
    image: img('1556228578-0d85b1a4d571'),
    stock: 42,
    rating: 4.4,
    reviews: 158,
  },
]

// FALLBACK ONLY. Real authentication is handled by Supabase (see authService.js
// + supabaseClient.js). This mock user list is used ONLY when Supabase
// credentials are absent from the environment (no .env), so the app still runs
// for someone who clones it without keys. When Supabase is configured (the
// normal case), NONE of this is used and no plaintext password is ever checked.
const SEED_USERS = [
  {
    id: 'u1',
    name: 'Demo User',
    email: 'demo@swipewire.com',
    password: 'password123', // FALLBACK demo only — real passwords are bcrypt-hashed by Supabase
    role: 'admin',
  },
]

// Initialize storage. Re-seeds the product catalog whenever SEED_VERSION
// changes, so updates to the demo data show up without the user having to
// manually clear localStorage. (Users/cart are left intact.)
function ensureSeeded() {
  const storedVersion = Number(localStorage.getItem(LS_KEYS.SEED_VERSION))
  const needsReseed = storedVersion !== SEED_VERSION

  if (needsReseed || !localStorage.getItem(LS_KEYS.PRODUCTS)) {
    write(LS_KEYS.PRODUCTS, SEED_PRODUCTS)
    write(LS_KEYS.SEED_VERSION, SEED_VERSION)
  }
  if (!localStorage.getItem(LS_KEYS.USERS)) write(LS_KEYS.USERS, SEED_USERS)
}
ensureSeeded()

// ---------- product "endpoints" ----------

export const mockApi = {
  async listProducts() {
    await delay()
    return read(LS_KEYS.PRODUCTS, [])
  },

  async getProduct(id) {
    await delay(200)
    const product = read(LS_KEYS.PRODUCTS, []).find((p) => p.id === id)
    if (!product) throw { response: { status: 404, data: { message: 'Product not found' } } }
    return product
  },

  async createProduct(data) {
    await delay()
    const products = read(LS_KEYS.PRODUCTS, [])
    const product = { id: uid(), stock: 0, ...data, price: Number(data.price) }
    products.unshift(product)
    write(LS_KEYS.PRODUCTS, products)
    return product
  },

  async updateProduct(id, data) {
    await delay()
    const products = read(LS_KEYS.PRODUCTS, [])
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1)
      throw { response: { status: 404, data: { message: 'Product not found' } } }
    products[idx] = { ...products[idx], ...data, price: Number(data.price) }
    write(LS_KEYS.PRODUCTS, products)
    return products[idx]
  },

  async deleteProduct(id) {
    await delay()
    const products = read(LS_KEYS.PRODUCTS, [])
    const next = products.filter((p) => p.id !== id)
    if (next.length === products.length)
      throw { response: { status: 404, data: { message: 'Product not found' } } }
    write(LS_KEYS.PRODUCTS, next)
    return { id }
  },

  // ---------- auth "endpoints" ----------

  async login({ email, password }) {
    await delay(500)
    const users = read(LS_KEYS.USERS, [])
    const user = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password,
    )
    if (!user)
      throw { response: { status: 401, data: { message: 'Invalid email or password.' } } }
    const { password: _pw, ...safeUser } = user
    return { user: safeUser, token: makeToken(user) }
  },

  async signup({ name, email, password }) {
    await delay(500)
    const users = read(LS_KEYS.USERS, [])
    if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase()))
      throw {
        response: { status: 409, data: { message: 'An account with this email already exists.' } },
      }
    const user = { id: uid(), name, email, password, role: 'customer' }
    users.push(user)
    write(LS_KEYS.USERS, users)
    const { password: _pw, ...safeUser } = user
    return { user: safeUser, token: makeToken(user) }
  },
}
