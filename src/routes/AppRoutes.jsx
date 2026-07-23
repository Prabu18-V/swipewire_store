// Central route definitions — includes dynamic routes (/product/:id)
// and protected routes (/checkout, /admin).

import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import ProductsPage from '../pages/ProductsPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import AdminProductsPage from '../pages/AdminProductsPage'
import ProductFormPage from '../pages/ProductFormPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected: checkout requires authentication */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Protected admin CRUD area */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute>
            <ProductFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/edit"
        element={
          <ProtectedRoute>
            <ProductFormPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
