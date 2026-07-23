// Custom hook: infinite scroll via IntersectionObserver.
//
// Returns a ref to attach to a "sentinel" element placed at the bottom of the
// list. When that element scrolls into view, `onLoadMore` fires — but only if
// `hasMore` is true and we're not already loading. This is how Flipkart /
// Instagram load the next page automatically as you scroll.

import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll({ hasMore, loading, onLoadMore }) {
  const sentinelRef = useRef(null)
  // Keep the latest callback without re-creating the observer each render.
  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  const canLoad = hasMore && !loading

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        // When the sentinel becomes visible and we're allowed to load, fire.
        if (entries[0].isIntersecting && canLoad) {
          onLoadMoreRef.current()
        }
      },
      {
        // Start loading a bit BEFORE the sentinel is fully visible, so the next
        // page is ready by the time the user reaches the bottom.
        rootMargin: '300px',
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [canLoad])

  return sentinelRef
}
