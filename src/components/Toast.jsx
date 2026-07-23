// Minimal global toast — dispatches via a window event so any module
// (services, slices, components) can trigger feedback without prop drilling.
//
//   import { toast } from './components/Toast'
//   toast('Added to cart', 'success')

import { useEffect, useState } from 'react'

export function toast(message, type = 'info') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))
}

const STYLES = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-slate-800',
}

export default function Toast() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let counter = 0
    const handler = (e) => {
      const id = ++counter
      setItems((prev) => [...prev, { id, ...e.detail }])
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2600)
    }
    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`${STYLES[t.type] || STYLES.info} rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg animate-fadeIn`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
