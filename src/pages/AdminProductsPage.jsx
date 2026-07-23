// Admin product management — the "Read" + "Delete" side of CRUD.
// Lists all products with edit/delete actions and a link to create.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  deleteProduct,
  selectProducts,
  selectProductStatus,
} from '../redux/productSlice'
import { Spinner } from '../components/ui'
import { formatCurrency } from '../utils/format'
import { handleImgError } from '../utils/imageFallback'
import { toast } from '../components/Toast'

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const status = useSelector(selectProductStatus)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const handleDelete = async (id, name) => {
    const result = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(result)) {
      toast(`Deleted “${name}”`, 'success')
    } else {
      toast('Failed to delete product', 'error')
    }
    setConfirmId(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
          <p className="text-sm text-slate-500">Create, edit, and delete catalog items.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          + New product
        </Link>
      </div>

      {status === 'loading' && products.length === 0 ? (
        <Spinner />
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm sm:table">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" onError={handleImgError} className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="btn-secondary !px-3 !py-1 text-xs">
                        Edit
                      </Link>
                      {confirmId === p.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="btn-danger !px-3 !py-1 text-xs"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-xs text-slate-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmId(p.id)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 sm:hidden">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <img src={p.image} alt="" onError={handleImgError} className="h-14 w-14 rounded object-cover ring-1 ring-slate-200" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.category} · {formatCurrency(p.price)} · stock {p.stock}
                  </p>
                  <div className="mt-2 flex gap-3">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-xs font-medium text-brand-700">
                      Edit
                    </Link>
                    {confirmId === p.id ? (
                      <>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-xs font-medium text-red-600">
                          Confirm delete
                        </button>
                        <button onClick={() => setConfirmId(null)} className="text-xs text-slate-500">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmId(p.id)} className="text-xs font-medium text-red-600">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
