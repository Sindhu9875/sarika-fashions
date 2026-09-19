import React from 'react'

/**
 * SareeArt renders a lightweight, elegant SVG illustration used as a stand-in
 * product/hero image. This guarantees the storefront never shows a broken
 * image icon before real product photography (e.g. /images/saree1.jpg) is
 * dropped into /public/images by the backend team.
 *
 * `variant` picks a colour-way so cards don't all look identical.
 */
const PALETTES = [
  ['#8E1748', '#C79A5B'],
  ['#651038', '#E4C79A'],
  ['#3E2635', '#C79A5B'],
  ['#8E1748', '#F7E8EA'],
  ['#5B1030', '#D9B27C'],
  ['#7A1440', '#E8C48F'],
]

export default function SareeArt({ variant = 0, className = '', rounded = true }) {
  const [c1, c2] = PALETTES[variant % PALETTES.length]
  const gradId = `sareeGrad-${variant}`

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      style={{ width: '100%', height: '100%', borderRadius: rounded ? 'inherit' : 0 }}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Saree illustration"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#FFF9F0" />
      <rect width="400" height="500" fill={`url(#${gradId})`} opacity="0.14" />
      {/* draped figure silhouette */}
      <path
        d="M200 90c-20 0-36 16-36 36 0 14 7 26 18 33-30 12-52 40-58 74l-14 150c-2 14 9 27 24 27h132c15 0 26-13 24-27l-14-150c-6-34-28-62-58-74 11-7 18-19 18-33 0-20-16-36-36-36z"
        fill={c1}
        opacity="0.85"
      />
      {/* pallu drape accent */}
      <path
        d="M150 150c-24 30-40 70-40 130s26 110 26 110h20s-22-56-22-110 20-96 36-118z"
        fill={c2}
        opacity="0.55"
      />
      {/* border pattern lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="90"
          y1={410 + i * 16}
          x2="310"
          y2={410 + i * 16}
          stroke={c2}
          strokeWidth="2"
          opacity="0.5"
        />
      ))}
      {/* motif dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={110 + i * 36} cy="470" r="4" fill={c2} opacity="0.7" />
      ))}
    </svg>
  )
}
