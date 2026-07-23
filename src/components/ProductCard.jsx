// Product card for the listing grid. Memoized to avoid re-renders when
// sibling cards / cart state change.

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCurrency, discountPercent } from '../utils/format'
import { handleImgError } from '../utils/imageFallback'
import StarRating from './StarRating'
import { toast } from './Toast'

function ProductCard({ product }) {
  const { add, isInCart } = useCart()
  const inCart = isInCart(product.id)
  const off = discountPercent(product.originalPrice, product.price)

  const handleAdd = (e) => {
    e.preventDefault()
    add(product)
    toast(`${product.name} added to cart`, 'success')
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImgError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            −{off}%
          </span>
        )}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-brand-700">
          {product.name}
        </h3>

        {product.rating != null && (
          <div className="mt-2">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
            {off > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              inCart
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
                : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {inCart ? '✓ In cart' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default memo(ProductCard)
