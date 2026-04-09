import Image from 'next/image'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { height: 28, width: 112 },
  md: { height: 36, width: 144 },
  lg: { height: 48, width: 192 },
}

export default function Logo({ variant = 'light', className = '', size = 'md' }: LogoProps) {
  const { height, width } = sizes[size]

  return (
    <span className={`inline-flex items-center ${className}`} aria-label="RampRate">
      <Image
        src="/ramprate-logo.png"
        alt="RampRate"
        width={width}
        height={height}
        style={{
          height: 'auto',
          width: width,
          maxHeight: height,
          objectFit: 'contain',
          filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
        }}
        priority
      />
    </span>
  )
}
