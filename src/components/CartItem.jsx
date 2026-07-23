// A single line item in the cart with quantity controls + remove.

import { memo } from 'react'
import { Link } from 'react-router-dom'
import QuantityStepper from './QuantityStepper'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'
import { handleImgError } from '../utils/imageFallback'

function CartItem({ item }) {
  const { setQty, remove } = useCart()

  return (
    <div className="flex gap-4 py-4">
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          onError={handleImgError}
          className="h-20 w-20 rounded-lg object-cover ring-1 ring-slate-200"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/product/${item.id}`} className="text-sm font-semibold text-slate-800 hover:text-brand-700">
              {item.name}
            </Link>
            <p className="text-xs text-slate-500">{item.category}</p>
          </div>
          <button
            onClick={() => remove(item.id)}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => setQty(item.id, q)}
            size="sm"
          />
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <p className="text-xs text-slate-500">{formatCurrency(item.price)} each</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CartItem)
