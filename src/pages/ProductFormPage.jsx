// Product create/edit form — the "Create" + "Update" side of CRUD.
// Same component handles both /admin/products/new and /:id/edit.
// Uses React Hook Form with full validation.

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  createProduct,
  updateProduct,
  fetchProducts,
  selectProductById,
  selectProductStatus,
  selectMutationError,
} from '../redux/productSlice'
import { PRODUCT_CATEGORIES } from '../utils/constants'
import { toast } from '../components/Toast'
import { Spinner } from '../components/ui'

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const existing = useSelector(selectProductById(id))
  const status = useSelector(selectProductStatus)
  const mutationError = useSelector(selectMutationError)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      price: '',
      category: PRODUCT_CATEGORIES[0],
      description: '',
      image: '',
      stock: '',
    },
  })

  // Ensure products are loaded (for direct navigation / refresh on edit).
  useEffect(() => {
    if (isEdit && status === 'idle') dispatch(fetchProducts())
  }, [isEdit, status, dispatch])

  // Populate form when editing.
  useEffect(() => {
    if (isEdit && existing) {
      reset({
        name: existing.name,
        price: existing.price,
        category: existing.category,
        description: existing.description,
        image: existing.image,
        stock: existing.stock,
      })
    }
  }, [isEdit, existing, reset])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    }
    const action = isEdit
      ? updateProduct({ id, data: payload })
      : createProduct(payload)
    const result = await dispatch(action)

    const matcher = isEdit ? updateProduct.fulfilled : createProduct.fulfilled
    if (matcher.match(result)) {
      toast(isEdit ? 'Product updated' : 'Product created', 'success')
      navigate('/admin/products')
    } else {
      toast('Something went wrong', 'error')
    }
  }

  if (isEdit && status === 'loading' && !existing) return <Spinner />

  if (isEdit && status === 'succeeded' && !existing) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Product not found.</p>
        <Link to="/admin/products" className="btn-secondary mt-4">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/products" className="mb-4 inline-block text-sm text-brand-700 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {isEdit ? 'Edit product' : 'New product'}
      </h1>

      {mutationError && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {mutationError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            className="input"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="price">Price (₹)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              className="input"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Must be greater than 0' },
              })}
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              className="input"
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Cannot be negative' },
              })}
            />
            {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" className="input" {...register('category', { required: true })}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="image">Image URL</label>
          <input
            id="image"
            className="input"
            placeholder="https://…"
            {...register('image', {
              required: 'Image URL is required',
              pattern: { value: /^https?:\/\/.+/i, message: 'Enter a valid URL' },
            })}
          />
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            className="input"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'At least 10 characters' },
            })}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <Link to="/admin/products" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
