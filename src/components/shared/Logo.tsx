interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { height: 28, iconScale: 0.7 },
  md: { height: 36, iconScale: 0.85 },
  lg: { height: 48, iconScale: 1 },
}

export default function Logo({ variant = 'light', className = '', size = 'md' }: LogoProps) {
  const { height, iconScale } = sizes[size]
  const textColor = variant === 'light' ? '#ffffff' : '#1a1a2e'
  const purpleColor = '#6B21A8'

  return (
    <span className={`inline-flex items-end gap-0 ${className}`} aria-label="RampRate">
      <svg
        viewBox="0 0 280 68"
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="RampRate logo"
      >
        {/* Chevron / roofline icon */}
        <g transform={`scale(${iconScale}) translate(${(1 - iconScale) * 20}, ${(1 - iconScale) * 10})`}>
          <path
            d="M28 4L48 20L44 24L28 12L12 24L8 20L28 4Z"
            fill={purpleColor}
            transform="translate(-2, -2) scale(1.1)"
          />
        </g>

        {/* "Ramp" in dark/white */}
        <text
          x="8"
          y="58"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="700"
          fontSize="46"
          letterSpacing="-1"
          fill={textColor}
        >
          Ramp
        </text>

        {/* "Rate" in deep purple */}
        <text
          x="140"
          y="58"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="700"
          fontSize="46"
          letterSpacing="-1"
          fill={purpleColor}
        >
          Rate
        </text>

        {/* TM */}
        <text
          x="252"
          y="38"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="400"
          fontSize="10"
          fill={variant === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
        >
          ™
        </text>
      </svg>
    </span>
  )
}
