import Image from "next/image";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Sponsors as SponsorsContent } from "@/lib/content";
import { Sponsor, Tier } from "@/utils/Types";

interface SponsorsProps {
  sponsors: SponsorsContent;
}

const TIER_SIZE: Record<Tier, string> = {
  [Tier.PEARL]: "h-24 w-56",
  [Tier.GOLD]: "h-20 w-48",
  [Tier.SILVER]: "h-12 w-32",
  [Tier.CUSTOM]: "h-16 w-40",
};

export function Sponsors({ sponsors }: SponsorsProps) {
  return (
    <section id="sponsors" aria-labelledby="sponsors-heading" className="w-full bg-postal-paper text-postal-navy">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <SectionHeading id="sponsors-heading" title={sponsors.title} />
        <FadeIn>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {sponsors.items.map((sponsor) => (
              <li key={sponsor.name}>
                {sponsor.url ? (
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="block">
                    <SponsorLogo sponsor={sponsor} />
                  </a>
                ) : (
                  <SponsorLogo sponsor={sponsor} />
                )}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const size = TIER_SIZE[sponsor.tier];

  if (!sponsor.img_url) {
    return (
      <span
        className={`flex items-center justify-center rounded-xl border-2 border-dashed border-postal-navy/40 bg-black/5 px-2 text-sm font-bold ${size}`}
      >
        {sponsor.name}
      </span>
    );
  }

  return (
    <span className={`relative block ${size}`}>
      <Image src={sponsor.img_url} alt={sponsor.name} fill className="object-contain" />
    </span>
  );
}
