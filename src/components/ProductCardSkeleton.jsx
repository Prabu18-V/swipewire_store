// Loading placeholder that mirrors ProductCard's layout, with a shimmer sweep.
// Shown while products load so the page doesn't "jump" when data arrives
// (prevents layout shift) — the pattern Flipkart / YouTube / LinkedIn use.

// A single shimmering block. `aria-hidden` because it's decorative — screen
// readers are told the list is "busy" at the grid level instead.
function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70" aria-hidden="true">
      <Shimmer className="aspect-[4/3] w-full" />
      <div className="space-y-3 p-4">
        <Shimmer className="h-3 w-1/3 rounded" />
        <Shimmer className="h-4 w-4/5 rounded" />
        <Shimmer className="h-3 w-1/2 rounded" />
        <div className="flex items-center justify-between pt-2">
          <Shimmer className="h-6 w-20 rounded" />
          <Shimmer className="h-9 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Convenience: render a full grid of skeletons.
export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading products…</span>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
