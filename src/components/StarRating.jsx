// Compact star-rating display (read-only). Renders full/half/empty stars.

function Star({ fill }) {
  // fill: 1 = full, 0.5 = half, 0 = empty
  const id = `half-${Math.random().toString(36).slice(2, 8)}`
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
      {fill === 0.5 && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z"
        fill={fill === 1 ? '#f59e0b' : fill === 0.5 ? `url(#${id})` : '#e2e8f0'}
      />
    </svg>
  )
}

export default function StarRating({ rating = 0, reviews, size = 'sm' }) {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    if (rating >= n) return 1
    if (rating >= n - 0.5) return 0.5
    return 0
  })

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((f, i) => (
          <Star key={i} fill={f} />
        ))}
      </div>
      <span className={`font-medium text-slate-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>
      {reviews != null && (
        <span className={`text-slate-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviews})
        </span>
      )}
    </div>
  )
}
