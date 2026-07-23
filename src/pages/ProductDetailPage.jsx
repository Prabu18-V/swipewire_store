// Product detail — dynamic route /product/:id.
// Reads from cache if available, otherwise fetches the single product.

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectProductById } from '../redux/productSlice'
import { productService } from '../services/productService'
import { useCart } from '../hooks/useCart'
import QuantityStepper from '../components/QuantityStepper'
import { Spinner, ErrorState } from '../components/ui'
import { formatCurrency, discountPercent } from '../utils/format'
import { handleImgError } from '../utils/imageFallback'
import StarRating from '../components/StarRating'
import { toast } from '../components/Toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()

  const cached = useSelector(selectProductById(id))
  const [product, setProduct] = useState(cached || null)
  const [status, setStatus] = useState(cached ? 'succeeded' : 'loading')
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (cached) {
      setProduct(cached)
      setStatus('succeeded')
      return
    }
    let active = true
    setStatus('loading')
    productService
      .getById(id)
      .then((p) => {
        if (!active) return
        setProduct(p)
        setStatus('succeeded')
      })
      .catch((err) => {
        if (!active) return
        setError(err?.response?.data?.message || 'Product not found.')
        setStatus('failed')
      })
    return () => {
      active = false
    }
  }, [id, cached])

  if (status === 'loading') return <Spinner label="Loading product…" />
  if (status === 'failed')
    return (
      <ErrorState
        message={error}
        onRetry={() => navigate('/products')}
      />
    )

  const handleAdd = () => {
    add(product, qty)
    toast(`${qty} × ${product.name} added to cart`, 'success')
  }

  const off = discountPercent(product.originalPrice, product.price)

  return (
    <div>
      <Link to="/products" className="mb-4 inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          <img src={product.image} alt={product.name} onError={handleImgError} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>

          {product.rating != null && (
            <div className="mt-2">
              <StarRating rating={product.rating} reviews={product.reviews} size="md" />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
            {off > 0 && (
              <>
                <p className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </p>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200">
                  Save {off}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <p className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="font-medium text-emerald-600">In stock ({product.stock} available)</span>
            ) : (
              <span className="font-medium text-red-600">Out of stock</span>
            )}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
            <button onClick={handleAdd} className="btn-primary flex-1" disabled={product.stock <= 0}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
