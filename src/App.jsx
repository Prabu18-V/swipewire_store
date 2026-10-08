// App shell — persistent Navbar + routed page content.

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import Toast from './components/Toast'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AppRoutes />
      </main>
      <footer className="mt-8 bg-ink-900 py-8 text-center text-sm text-slate-400">
        <p className="font-semibold text-white">
          MP <span className="text-brand-400">Store</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          A React + Redux Toolkit + Tailwind demo store.
        </p>
      </footer>
      <Toast />
    </div>
  )
}
