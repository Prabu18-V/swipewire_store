// Brand logo. Loads the real logo image from src/assets/logo.png; if that
// file isn't present (or fails to load), it falls back to a simple "S" badge
// so the app never shows a broken image.
//
// To use YOUR logo: save it as  src/assets/logo.png
// (or change the filename in `logoUrl` below to match, e.g. logo.svg).
//
// The image is displayed inside a dark rounded frame and `object-contain`
// so the whole mark stays visible and centered regardless of the source
// image's exact dimensions — no manual cropping needed.

import { useState } from 'react'

const logoUrl = new URL('../assets/logo.png', import.meta.url).href

export default function Logo({ size = 40 }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    // Fallback badge (original placeholder) — shown until logo.png exists.
    return (
      <span
        className="grid place-items-center rounded-lg bg-brand-600 font-bold text-white"
        style={{ height: size, width: size }}
      >
        S
      </span>
    )
  }

  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-900 ring-1 ring-ink-800 shadow-sm"
      style={{ height: size, width: size }}
    >
      <img
        src={logoUrl}
        alt="Swipewire"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
