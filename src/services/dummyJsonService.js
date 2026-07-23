// Real product API integration (DummyJSON — https://dummyjson.com/products).
//
// The recruiter asked us to use this API. It provides ~194 real products with
// images, categories, ratings and discounts. We use Axios here with the same
// interceptor-ready pattern as apiClient.js.
//
// DummyJSON's response shape differs from our app's internal Product shape, so
// `normalize()` maps their fields → ours. This keeps every downstream consumer
// (Redux, ProductCard, cart, etc.) unchanged — a classic "anti-corruption layer".
//
// Note on CRUD: DummyJSON's POST/PUT/DELETE endpoints *simulate* a response but
// do not actually persist on their server. We still call them (so the real HTTP
// round-trip and interceptors are exercised) and reflect the change locally in
// the Redux store, which is enough for the demo.

import axios from 'axios'
import { PRODUCT_API_URL } from '../utils/constants'
import { round2 } from '../utils/format'

const http = axios.create({
  baseURL: PRODUCT_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ---- shape mapping: DummyJSON product -> our internal product ----

// DummyJSON prices are in USD; our store displays INR (₹). Convert on the way in
// so all downstream pricing/tax math stays in a single currency.
const USD_TO_INR = 83

// Turn "home-decoration" into "Home Decoration" for display.
const titleCase = (slug = '') =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

function normalize(p) {
  // DummyJSON gives a `discountPercentage`; we derive an originalPrice from it
  // so our existing "−X%" badge + strikethrough pricing keeps working.
  const price = round2(p.price * USD_TO_INR)
  const originalPrice =
    p.discountPercentage > 0 ? round2(price / (1 - p.discountPercentage / 100)) : undefined

  return {
    id: String(p.id),
    name: p.title,
    price,
    originalPrice,
    category: titleCase(p.category),
    description: p.description,
    image: p.thumbnail || p.images?.[0] || '',
    stock: p.stock ?? 0,
    rating: p.rating ?? 0,
    reviews: Array.isArray(p.reviews) ? p.reviews.length : undefined,
  }
}

// ---- API methods ----

// Slugify a display category name back to the API's slug, e.g.
// "Home Decoration" -> "home-decoration". Used for the category endpoint.
const slugify = (name = '') => name.trim().toLowerCase().replace(/\s+/g, '-')

export const dummyJsonService = {
  // Paginated, server-side fetch. `page` is 1-based. Optionally filtered by a
  // search query or category — all done on the server (limit/skip/search/
  // category endpoints) so the browser never holds the entire catalog.
  //
  // Returns { products, total } so the UI can compute the page count.
  async getPage({ page = 1, pageSize = 12, query = '', category = 'All' } = {}) {
    const skip = (page - 1) * pageSize
    const params = `limit=${pageSize}&skip=${skip}`

    let url
    if (query.trim()) {
      url = `/products/search?q=${encodeURIComponent(query.trim())}&${params}`
    } else if (category && category !== 'All') {
      url = `/products/category/${slugify(category)}?${params}`
    } else {
      url = `/products?${params}`
    }

    const { data } = await http.get(url)
    return {
      products: (data.products || []).map(normalize),
      total: data.total ?? 0,
    }
  },

  // Kept for the fallback path / any consumer that wants everything at once.
  async getAll() {
    const { data } = await http.get('/products?limit=0')
    return (data.products || []).map(normalize)
  },

  async getById(id) {
    const { data } = await http.get(`/products/${id}`)
    return normalize(data)
  },

  async getCategories() {
    const { data } = await http.get('/products/category-list')
    // data is an array of slugs; return display names.
    return (data || []).map(titleCase)
  },

  async create(product) {
    // POST /products/add — simulated by DummyJSON.
    const { data } = await http.post('/products/add', {
      title: product.name,
      price: Number(product.price),
      description: product.description,
      category: product.category,
      thumbnail: product.image,
      stock: Number(product.stock),
    })
    // Merge the API's returned id with our own field values.
    return { ...product, id: String(data.id) }
  },

  async update(id, product) {
    const { data } = await http.put(`/products/${id}`, {
      title: product.name,
      price: Number(product.price),
      description: product.description,
      category: product.category,
      thumbnail: product.image,
      stock: Number(product.stock),
    })
    return { ...product, id: String(data.id ?? id) }
  },

  async remove(id) {
    await http.delete(`/products/${id}`)
    return { id }
  },
}
