export type PracticeIconKind =
  | "impact"
  | "syzygy"
  | "sourcing"
  | "advisory"
  | "stratum"
  | "biochain";

// transform-box defaults to the SVG viewport, not the shape itself - fill-box
// re-centers scale/rotate transforms on the shape so they animate in place
// instead of swinging around the icon's corner.
const shapeStyle = { transformBox: "fill-box" as const, transformOrigin: "center" as const };

export default function PracticeIcon({
  kind,
  color,
}: {
  kind: PracticeIconKind;
  color: string;
}) {
  switch (kind) {
    // A single point sends out two fading ripple rings on hover - impact
    // spreading outward.
    case "impact":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
          <circle cx="12" cy="12" r="2" fill={color} style={shapeStyle} />
          <circle cx="12" cy="12" r="2" fill="none" stroke={color} strokeWidth="1.4" className="practice-ripple" style={shapeStyle} />
          <circle cx="12" cy="12" r="2" fill="none" stroke={color} strokeWidth="1.4" className="practice-ripple practice-ripple-delay" style={shapeStyle} />
        </svg>
      );

    // Three bodies at scattered heights drift onto one line on hover - the
    // literal astronomical definition of syzygy.
    case "syzygy":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
          <circle cx="5" cy="8" r="2" fill={color} opacity="0.5" style={shapeStyle} className="translate-y-0 transition-transform duration-500 ease-out group-hover:translate-y-[3px]" />
          <circle cx="12" cy="16" r="2.8" fill={color} style={shapeStyle} className="translate-y-0 transition-transform duration-500 ease-out delay-75 group-hover:-translate-y-[5px]" />
          <circle cx="19" cy="6" r="1.6" fill={color} opacity="0.5" style={shapeStyle} className="translate-y-0 transition-transform duration-500 ease-out delay-150 group-hover:translate-y-[5px]" />
        </svg>
      );

    // Scattered nodes light up and their connecting lines draw in on hover -
    // sourcing as a network converging on a match.
    case "sourcing":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line pathLength={1} x1="6" y1="6" x2="12" y2="18" className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 group-hover:[stroke-dashoffset:0]" />
          <line pathLength={1} x1="18" y1="6" x2="12" y2="18" className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 delay-100 group-hover:[stroke-dashoffset:0]" />
          <line pathLength={1} x1="6" y1="6" x2="18" y2="6" className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 delay-200 group-hover:[stroke-dashoffset:0]" />
          <circle cx="6" cy="6" r="1.8" fill={color} stroke="none" style={shapeStyle} className="scale-75 transition-transform duration-300 group-hover:scale-100" />
          <circle cx="18" cy="6" r="1.8" fill={color} stroke="none" style={shapeStyle} className="scale-75 transition-transform duration-300 delay-150 group-hover:scale-100" />
          <circle cx="12" cy="18" r="2.2" fill={color} stroke="none" style={shapeStyle} className="scale-75 transition-transform duration-300 delay-300 group-hover:scale-100" />
        </svg>
      );

    // An open envelope flap drops and seals shut on hover, a small seal
    // appearing once closed - discretion, not flash.
    case "advisory":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 6 L12 1.5 L21 6" style={shapeStyle} className="opacity-100 translate-y-0 transition-all duration-300 group-hover:translate-y-[4px] group-hover:opacity-0" />
          <path d="M3 7 L12 13 L21 7" className="opacity-0 transition-all duration-300 delay-150 group-hover:opacity-100" />
          <circle cx="12" cy="10.5" r="1.4" fill={color} stroke="none" style={shapeStyle} className="scale-50 opacity-0 transition-all duration-300 delay-300 group-hover:scale-100 group-hover:opacity-100" />
        </svg>
      );

    // Three misaligned layers snap into a flush stack on hover - Stratum
    // means "layer," and it doubles as blockchain blocks locking into place.
    case "stratum":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
          <rect x="3" y="4" width="18" height="4" rx="1" fill={color} opacity="0.55" style={shapeStyle} className="-translate-x-0.75 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100" />
          <rect x="3" y="10" width="18" height="4" rx="1" fill={color} opacity="0.55" style={shapeStyle} className="translate-x-0.75 transition-all duration-400 delay-100 group-hover:translate-x-0 group-hover:opacity-100" />
          <rect x="3" y="16" width="18" height="4" rx="1" fill={color} opacity="0.55" style={shapeStyle} className="-translate-x-0.75 transition-all duration-400 delay-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </svg>
      );

    // Two open link-halves slide together and interlock on hover - chain of
    // custody, closing.
    case "biochain":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
          <rect x="2.5" y="9" width="8" height="8" rx="4" style={shapeStyle} className="-translate-x-0.75 transition-transform duration-400 ease-out group-hover:translate-x-px" />
          <rect x="13.5" y="7" width="8" height="8" rx="4" style={shapeStyle} className="translate-x-0.75 transition-transform duration-400 ease-out group-hover:-translate-x-px" />
        </svg>
      );
  }
}
