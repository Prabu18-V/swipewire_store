// Reusable confirmation modal. Renders nothing when `open` is false.
// Handles Escape-to-cancel, backdrop click, focus, and body-scroll lock.
//
// Rendered via a portal into document.body so it's positioned relative to
// the viewport — NOT trapped inside an ancestor that has a `transform`,
// `filter`, or `backdrop-filter` (e.g. the Navbar's backdrop-blur), which
// would otherwise become the containing block for our `position: fixed`.

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary', // 'primary' | 'danger'
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    confirmRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500'

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 60,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
        style={{ position: 'absolute', inset: 0 }}
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-scaleIn">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
              variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 id="confirm-title" className="text-base font-semibold text-slate-900">
              {title}
            </h2>
            {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
