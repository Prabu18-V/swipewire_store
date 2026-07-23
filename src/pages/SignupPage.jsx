// Signup page — React Hook Form with password confirmation.

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import PasswordInput from '../components/PasswordInput'
import { clearAuthError, selectAuthError, selectAuthStatus } from '../redux/authSlice'

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const error = useSelector(selectAuthError)
  const status = useSelector(selectAuthStatus)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) navigate('/products', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async ({ name, email, password }) => {
    try {
      await signup({ name, email, password })
    } catch {
      // error surfaced via Redux state
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">It only takes a moment.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              className="input"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Too short' },
              })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

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

          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <PasswordInput
              id="confirm"
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>}
          </div>

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
