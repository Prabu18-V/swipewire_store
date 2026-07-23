// Product slice — fetch + cache products, and CRUD thunks.
// Demonstrates loading states, error handling, and product caching in the store.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../services/productService'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll()
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load products.')
    }
  },
)

// Paginated fetch. `mode: 'replace'` swaps in a fresh page (page 1 / new filter);
// `mode: 'append'` adds the next page onto the existing list (infinite scroll).
export const fetchProductsPage = createAsyncThunk(
  'products/fetchPage',
  async (
    { page = 1, pageSize = 12, query = '', category = 'All', mode = 'replace' } = {},
    { rejectWithValue },
  ) => {
    try {
      const { products, total } = await productService.getPage({ page, pageSize, query, category })
      return { products, total, page, mode }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load products.')
    }
  },
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (data, { rejectWithValue }) => {
    try {
      return await productService.create(data)
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to create product.')
    }
  },
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await productService.update(id, data)
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update product.')
    }
  },
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.remove(id)
      return id
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete product.')
    }
  },
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle', // status for create/update/delete
  mutationError: null,
  // pagination
  page: 1,
  pageSize: 12,
  total: 0,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearMutationState: (state) => {
      state.mutationStatus = 'idle'
      state.mutationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // paginated fetch (supports append for infinite scroll)
      .addCase(fetchProductsPage.pending, (state, action) => {
        // First page / new filter → full 'loading'; further pages → 'loadingMore'
        state.status = action.meta.arg?.mode === 'append' ? 'loadingMore' : 'loading'
        state.error = null
      })
      .addCase(fetchProductsPage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.total = action.payload.total
        state.page = action.payload.page
        if (action.payload.mode === 'append') {
          // Guard against duplicate ids (React key safety).
          const existing = new Set(state.items.map((p) => p.id))
          state.items.push(...action.payload.products.filter((p) => !existing.has(p.id)))
        } else {
          state.items = action.payload.products
        }
      })
      .addCase(fetchProductsPage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // create
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload
      })
      // update
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        const idx = state.items.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload
      })
      // delete
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = 'loading'
        state.mutationError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload
      })
  },
})

export const { clearMutationState } = productSlice.actions

export const selectProducts = (state) => state.products.items
export const selectProductStatus = (state) => state.products.status
export const selectProductError = (state) => state.products.error
export const selectProductById = (id) => (state) =>
  state.products.items.find((p) => p.id === id)
export const selectMutationStatus = (state) => state.products.mutationStatus
export const selectMutationError = (state) => state.products.mutationError
// pagination selectors
export const selectPage = (state) => state.products.page
export const selectPageSize = (state) => state.products.pageSize
export const selectTotal = (state) => state.products.total
export const selectTotalPages = (state) =>
  Math.max(1, Math.ceil(state.products.total / state.products.pageSize))

export default productSlice.reducer
