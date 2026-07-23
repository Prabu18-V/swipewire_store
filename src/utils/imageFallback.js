// Inline SVG placeholder (data URI) shown when a product image fails to load.
// Kept as a data URI so it works fully offline — no network request.
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#e2e8f0"/>
      <g fill="none" stroke="#94a3b8" stroke-width="8">
        <rect x="180" y="120" width="240" height="160" rx="12"/>
        <circle cx="245" cy="180" r="22"/>
        <path d="M180 250l70-60 55 45 60-55 55 50v50a12 12 0 0 1-12 12H192a12 12 0 0 1-12-12z" fill="#94a3b8" stroke="none"/>
      </g>
      <text x="300" y="330" font-family="system-ui, sans-serif" font-size="22" fill="#64748b" text-anchor="middle">Image unavailable</text>
    </svg>`,
  )

/**
 * onError handler for <img>. Swaps to the placeholder once, and guards
 * against an infinite loop if the placeholder itself somehow errors.
 */
export const handleImgError = (e) => {
  if (e.currentTarget.dataset.fallback) return
  e.currentTarget.dataset.fallback = 'true'
  e.currentTarget.src = PLACEHOLDER_IMAGE
}
