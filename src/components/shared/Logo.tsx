import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { height: 28, width: 88 },
  md: { height: 36, width: 112 },
  lg: { height: 48, width: 152 },
};

const sizeClasses = {
  sm: "w-[88px] max-h-7",
  md: "w-[112px] max-h-9",
  lg: "w-[152px] max-h-12",
};

export default function Logo({
  variant = "light",
  className = "",
  size = "md",
}: LogoProps) {
  const { height, width } = sizes[size];

  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label="RampRate"
    >
      <Image
        src="/ramprate-logo.png"
        alt="RampRate"
        width={width}
        height={height}
        className={`h-auto object-contain ${sizeClasses[size]} ${variant === "light" ? "brightness-0 invert" : ""}`}
        priority
      />
    </span>
  );
}
