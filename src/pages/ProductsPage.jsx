// Product listing page — INFINITE SCROLL (Flipkart / Instagram style).
// Instead of loading the whole catalog OR paging by number, it fetches one page
// at a time and appends the next page automatically as the user scrolls to the
// bottom (via IntersectionObserver). Search + category filtering are done
// server-side. This keeps the app fast no matter how big the catalog is.

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductsPage,
  selectProducts,
  selectProductStatus,
  selectProductError,
  selectPage,
  selectTotal,
  selectTotalPages,
} from '../redux/productSlice'
import { productService } from '../services/productService'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'
import { ErrorState, EmptyState } from '../components/ui'

const PAGE_SIZE = 12

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const status = useSelector(selectProductStatus)
  const error = useSelector(selectProductError)
  const page = useSelector(selectPage)
  const total = useSelector(selectTotal)
  const totalPages = useSelector(selectTotalPages)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])

  const hasMore = page < totalPages
  const isInitialLoading = status === 'loading'
  const isLoadingMore = status === 'loadingMore'

  // Load the full category list once (a single page won't contain every one).
  useEffect(() => {
    let active = true
    productService.getCategories().then((cats) => {
      if (active && cats?.length) setCategories(['All', ...cats])
    })
    return () => {
      active = false
    }
  }, [])

  // Debounce the search box — wait 400ms after typing stops before requesting.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(t)
  }, [query])

  // When the search or category changes, reset the list to page 1 (replace).
  useEffect(() => {
    dispatch(
      fetchProductsPage({
        page: 1,
        pageSize: PAGE_SIZE,
        query: debouncedQuery,
        category,
        mode: 'replace',
      }),
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [dispatch, debouncedQuery, category])

  // Load the NEXT page and append it (called when the sentinel scrolls in).
  const loadMore = useCallback(() => {
    dispatch(
      fetchProductsPage({
        page: page + 1,
        pageSize: PAGE_SIZE,
        query: debouncedQuery,
        category,
        mode: 'append',
      }),
    )
  }, [dispatch, page, debouncedQuery, category])

  // Sentinel ref — attach to the element at the bottom of the grid.
  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading: isInitialLoading || isLoadingMore,
    onLoadMore: loadMore,
  })

  return (
    <div>
      {/* Hero — dark premium, echoing the logo's charcoal + electric accent */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 px-6 py-12 text-white shadow-xl ring-1 ring-white/5 sm:px-10 sm:py-16">
        {/* Electric glow accents */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/30 backdrop-blur">
            🔥 Season Sale — up to 30% off
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Discover products{' '}
            <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              you&apos;ll love
            </span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-300 sm:text-base">
            Electronics, fashion, home essentials & more — curated and delivered fast.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              ✓ Free shipping
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              ✓ Secure checkout
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              ✓ Easy returns
            </span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative sm:max-w-md">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
          </svg>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="input !pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 hover:ring-brand-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {products.length > 0 && total > 0 && (
        <p className="mb-4 text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{products.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{total}</span> products
          {category !== 'All' && <> in <span className="font-semibold text-slate-700">{category}</span></>}
        </p>
      )}

      {/* Initial load (empty list) → skeleton grid (prevents layout shift) */}
      {isInitialLoading && products.length === 0 && <ProductGridSkeleton count={PAGE_SIZE} />}

      {/* Error with nothing loaded → error state with retry */}
      {status === 'failed' && products.length === 0 && (
        <ErrorState
          message={error}
          onRetry={() =>
            dispatch(
              fetchProductsPage({
                page: 1,
                pageSize: PAGE_SIZE,
                query: debouncedQuery,
                category,
                mode: 'replace',
              }),
            )
          }
        />
      )}

      {/* No results after a successful load */}
      {status === 'succeeded' && products.length === 0 && (
        <EmptyState title="No products found" subtitle="Try a different search or category." />
      )}

      {/* The product grid */}
      {products.length > 0 && (
        <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}

      {/* Infinite-scroll sentinel + loading indicator */}
      {products.length > 0 && (
        <div ref={sentinelRef} className="py-8 text-center" role="status" aria-live="polite">
          {isLoadingMore && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <svg
                className="h-5 w-5 animate-spin text-brand-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Loading more…
            </div>
          )}
          {!hasMore && !isLoadingMore && (
            <p className="text-sm text-slate-400">You&apos;ve reached the end — {total} products.</p>
          )}
        </div>
      )}
    </div>
  )
}
