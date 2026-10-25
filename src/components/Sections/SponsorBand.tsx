import Image from "next/image";
import { Sponsors } from "@/lib/content";
import { Sponsor, Tier } from "@/utils/Types";

interface SponsorBandProps {
  sponsors: Sponsors;
  /** Slide right instead of left, so neighbouring bands alternate. */
  reverse?: boolean;
  /**
   * A repeat of the first band further down the page. Screen readers and the
   * keyboard skip it, so they get the sponsor list once.
   */
  repeat?: boolean;
}

// Bigger sponsors get bigger logos.
const TIER_SIZE: Record<Tier, string> = {
  [Tier.PEARL]: "h-14 w-44",
  [Tier.GOLD]: "h-12 w-36",
  [Tier.SILVER]: "h-10 w-28",
  [Tier.CUSTOM]: "h-12 w-32",
};

// Logos per half of the sliding track: enough that one half is wider than a
// desktop screen, so the loop never shows a gap.
const LOGOS_PER_HALF = 12;

// Airmail envelope edging: diagonal red and navy stripes on paper.
const AIRMAIL =
  "bg-[repeating-linear-gradient(-45deg,theme(colors.postal.red.DEFAULT)_0_12px,theme(colors.postal.paper)_12px_24px,theme(colors.postal.navy.DEFAULT)_24px_36px,theme(colors.postal.paper)_36px_48px)]";

// A strip between sections with sponsor logos sliding past, edged like an
// airmail envelope. The motion is a CSS animation, so it costs no JavaScript.
// It pauses on hover or focus, and with reduced motion it stands still and
// scrolls sideways instead.
export function SponsorBand({ sponsors, reverse = false, repeat = false }: SponsorBandProps) {
  const count = sponsors.items.length;
  const copies = Math.max(1, Math.ceil(LOGOS_PER_HALF / count));
  const half = Array.from({ length: copies }, () => sponsors.items).flat();
  const Band = repeat ? "div" : "section";

  return (
    <Band
      id={repeat ? undefined : "sponsors"}
      aria-label={repeat ? undefined : sponsors.title}
      aria-hidden={repeat || undefined}
      className="w-full scroll-mt-16 bg-postal-paper text-postal-navy"
    >
      <div aria-hidden="true" className={`h-2 ${AIRMAIL}`} />
      <div className="flex">
        <p className="flex shrink-0 items-center bg-postal-navy px-3 font-sans text-xs font-bold uppercase tracking-[0.15em] text-postal-paper sm:px-4 sm:text-sm md:px-6 md:tracking-[0.2em]">
          {sponsors.title}
        </p>
        <div className="min-w-0 flex-1 overflow-hidden py-5 motion-reduce:overflow-x-auto">
          <div
            className={`flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none ${
              reverse ? "[animation-direction:reverse]" : ""
            }`}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-10 pl-10">
                {half.map((sponsor, index) => {
                  // Only the first band's first pass through the list is for
                  // screen readers and the keyboard; the rest is repetition.
                  const echo = repeat || copy > 0 || index >= count;
                  return (
                    <li key={`${sponsor.name}-${index}`} aria-hidden={echo || undefined}>
                      <SponsorLogo sponsor={sponsor} focusable={!echo} />
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={`h-2 ${AIRMAIL}`} />
    </Band>
  );
}

interface SponsorLogoProps {
  sponsor: Sponsor;
  focusable: boolean;
}

// Links to the sponsor when there's a URL. Sponsors without a logo yet show
// their name in a dashed placeholder box.
function SponsorLogo({ sponsor, focusable }: SponsorLogoProps) {
  const size = TIER_SIZE[sponsor.tier];
  const logo = sponsor.img_url ? (
    <span className={`relative block ${size}`}>
      <Image src={sponsor.img_url} alt={sponsor.name} fill className="object-contain" />
    </span>
  ) : (
    <span
      className={`flex items-center justify-center rounded-xl border-2 border-dashed border-postal-navy/40 bg-black/5 px-2 text-sm font-bold ${size}`}
    >
      {sponsor.name}
    </span>
  );

  if (!sponsor.url) return logo;
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={focusable ? undefined : -1}
      className="block"
    >
      {logo}
    </a>
  );
}
