// Product API service — the single entry point the rest of the app uses for
// product data. It talks to the REAL DummyJSON API (as requested), and falls
// back to the local mock backend if the network/API is unavailable, so the app
// never shows an empty screen during a demo.
//
// Mutations are wrapped with `withAuth` to require a valid JWT, mirroring a
// protected backend.

import { dummyJsonService } from './dummyJsonService'
import { mockApi } from './mockBackend'
import { withAuth } from './apiClient'

// Run the primary (real API) function; if it throws (network/API error),
// log a warning and run the fallback (local mock) instead.
async function withFallback(primary, fallback, label) {
  try {
    return await primary()
  } catch (err) {
    console.warn(`[productService] ${label} — real API failed, using local fallback.`, err?.message)
    return fallback()
  }
}

// Fallback paginator: the mock returns the whole array, so we slice it locally
// to mimic the server's paginated { products, total } response.
async function mockGetPage({ page = 1, pageSize = 12, query = '', category = 'All' }) {
  let all = await mockApi.listProducts()
  if (query.trim()) {
    const q = query.trim().toLowerCase()
    all = all.filter((p) => p.name.toLowerCase().includes(q))
  } else if (category && category !== 'All') {
    all = all.filter((p) => p.category === category)
  }
  const start = (page - 1) * pageSize
  return { products: all.slice(start, start + pageSize), total: all.length }
}

export const productService = {
  // Paginated products (server-side on the real API; sliced locally in fallback).
  getPage: (opts) =>
    withFallback(() => dummyJsonService.getPage(opts), () => mockGetPage(opts), 'getPage'),

  getAll: () => withFallback(() => dummyJsonService.getAll(), () => mockApi.listProducts(), 'getAll'),

  getById: (id) =>
    withFallback(() => dummyJsonService.getById(id), () => mockApi.getProduct(id), 'getById'),

  getCategories: () =>
    withFallback(() => dummyJsonService.getCategories(), () => Promise.resolve(null), 'getCategories'),

  create: withAuth((data) =>
    withFallback(() => dummyJsonService.create(data), () => mockApi.createProduct(data), 'create'),
  ),

  update: withAuth((id, data) =>
    withFallback(() => dummyJsonService.update(id, data), () => mockApi.updateProduct(id, data), 'update'),
  ),

  remove: withAuth((id) =>
    withFallback(() => dummyJsonService.remove(id), () => mockApi.deleteProduct(id), 'remove'),
  ),
}
