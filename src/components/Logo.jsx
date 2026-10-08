function MPLogoSVG({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* Background rounded square with brand color */}
      <rect width="40" height="40" rx="10" fill="currentColor" className="text-brand-600" />

      {/* Stylized Shopping Bag Handle */}
      <path
        d="M16 13V11C16 9.89543 16.8954 9 18 9H22C23.1046 9 24 9.89543 24 11V13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Shopping Bag Body */}
      <path
        d="M13 13H27V31C27 32.1046 26.1046 33 25 33H15C13.8954 33 13 32.1046 13 31V13Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* MP Text centrally placed */}
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fill="white"
        style={{
          fontSize: '10px',
          fontWeight: '800',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        MP
      </text>
    </svg>
  )
}

export default function Logo({ size = 40 }) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-xl shadow-sm"
      style={{ height: size, width: size }}
    >
      <MPLogoSVG size={size} />
    </span>
  )
}

