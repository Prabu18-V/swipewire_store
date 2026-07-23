import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/products" className="btn-primary mt-6">
        Back to products
      </Link>
    </div>
  )
}
