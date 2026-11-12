// Stand-in for the Dot mascot art: a simple head in a postal cap, carrying
// an envelope. Swap for the real illustration (e.g. an <Image> of
// public/art/route/dot.webp) at the same size.
export function DotPlaceholder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <g className="fill-postal-tan-dark stroke-postal-navy" strokeWidth="3">
        <ellipse cx="24" cy="54" rx="11" ry="21" transform="rotate(18 24 54)" />
        <ellipse cx="76" cy="54" rx="11" ry="21" transform="rotate(-18 76 54)" />
      </g>
      <circle cx="50" cy="56" r="27" strokeWidth="3" className="fill-postal-tan stroke-postal-navy" />
      <rect x="29" y="18" width="42" height="17" rx="4" className="fill-postal-navy" />
      <rect x="23" y="32" width="54" height="8" rx="4" strokeWidth="2.5" className="fill-postal-blue stroke-postal-navy" />
      <g className="fill-postal-navy">
        <circle cx="41" cy="55" r="2.8" />
        <circle cx="59" cy="55" r="2.8" />
        <ellipse cx="50" cy="63" rx="3.6" ry="2.6" />
      </g>
      <g transform="rotate(-12 70 76)">
        <rect x="55" y="66" width="30" height="20" rx="2" strokeWidth="2.5" className="fill-postal-paper stroke-postal-navy" />
        <path d="M55 66l15 11 15-11" fill="none" strokeWidth="2.5" className="stroke-postal-navy" />
        <circle cx="70" cy="77" r="3" className="fill-postal-red" />
      </g>
    </svg>
  );
}
