// Login page — React Hook Form validation + JWT auth via Redux thunk.
// Redirects back to the intended route (or /products) after success.

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import PasswordInput from '../components/PasswordInput'
import { clearAuthError, selectAuthError, selectAuthStatus } from '../redux/authSlice'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const error = useSelector(selectAuthError)
  const status = useSelector(selectAuthStatus)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/products'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } })

  // Clear any stale error on mount.
  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  // Redirect after successful login.
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  const onSubmit = async (data) => {
    try {
      await login(data)
      // navigation handled by the effect above
    } catch {
      // error surfaced via Redux state
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to continue to checkout.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Secured by Supabase authentication.
        </p>
      </div>
    </div>
  )
}
