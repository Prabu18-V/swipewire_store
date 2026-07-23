// Reusable quantity control with +/- and a direct input.
// Enforces a valid integer range [min, max] — no zero/negative values.

export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  const handleInput = (e) => {
    const raw = parseInt(e.target.value, 10)
    if (Number.isNaN(raw)) return
    onChange(Math.min(max, Math.max(min, raw)))
  }

  const btn =
    size === 'sm'
      ? 'h-7 w-7 text-sm'
      : 'h-9 w-9 text-base'

  return (
    <div className="inline-flex items-center rounded-lg ring-1 ring-slate-300">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className={`${btn} grid place-items-center rounded-l-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
        className="w-12 border-x border-slate-300 py-1 text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className={`${btn} grid place-items-center rounded-r-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
