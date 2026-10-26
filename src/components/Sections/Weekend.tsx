import { PackageTracker } from "@/components/Scroll/PackageTracker";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Weekend as WeekendContent } from "@/lib/content";

interface WeekendProps {
  weekend: WeekendContent;
}

// The shape of the weekend at a glance, told as a parcel's tracking page on
// a manila background. Times live on the event portal, not here.
export function Weekend({ weekend }: WeekendProps) {
  return (
    <section
      id="weekend"
      aria-labelledby="weekend-heading"
      className="w-full scroll-mt-16 bg-postal-tan-light text-postal-navy"
    >
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading id="weekend-heading" title={weekend.title} />
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{weekend.intro}</p>
        <PackageTracker tracking={weekend.tracking} steps={weekend.steps} className="mt-12" />
      </div>
    </section>
  );
}
