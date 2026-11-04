import Image from "next/image";
import { Sponsors } from "@/lib/content";
import { AIRMAIL } from "@/components/UI/airmail";
import { SectionHeading } from "@/components/UI/SectionHeading";
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

// Tiers in the order the "tiers" layout lists them, with their headings.
const TIERS: [Tier, string][] = [
  [Tier.PEARL, "Pearl"],
  [Tier.GOLD, "Gold"],
  [Tier.SILVER, "Silver"],
  [Tier.CUSTOM, "Partners"],
];

// A strip between sections with sponsor logos sliding past, edged like an
// airmail envelope. It has no visible title; screen readers hear it named
// after the sponsors title. The motion is a CSS animation, so it costs no
// JavaScript. It pauses on hover or focus, and with reduced motion it stands
// still and scrolls sideways instead.
//
// With the "tiers" layout in site.json, the first band becomes a still
// section grouped by tier, and the repeats disappear.
export function SponsorBand({ sponsors, reverse = false, repeat = false }: SponsorBandProps) {
  if (sponsors.layout === "tiers") return repeat ? null : <SponsorTiers sponsors={sponsors} />;

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
      <div className="overflow-hidden py-5 motion-reduce:overflow-x-auto">
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
      <div aria-hidden="true" className={`h-2 ${AIRMAIL}`} />
    </Band>
  );
}

// Every sponsor once, standing still, under its tier's heading, for when
// sponsors would rather be seen by tier. Same airmail edges as the bands.
function SponsorTiers({ sponsors }: { sponsors: Sponsors }) {
  const groups = TIERS.map(([tier, heading]) => ({
    heading,
    items: sponsors.items.filter((sponsor) => sponsor.tier === tier),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="w-full scroll-mt-16 bg-postal-paper text-postal-navy"
    >
      <div aria-hidden="true" className={`h-2 ${AIRMAIL}`} />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 text-center">
        <SectionHeading id="sponsors-heading" title={sponsors.title} />
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-postal-navy/60">
              {group.heading}
            </h3>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-10">
              {group.items.map((sponsor) => (
                <li key={sponsor.name}>
                  <SponsorLogo sponsor={sponsor} focusable />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className={`h-2 ${AIRMAIL}`} />
    </section>
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
