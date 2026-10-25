import { CSSProperties } from "react";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Weekend as WeekendContent } from "@/lib/content";

interface WeekendProps {
  weekend: WeekendContent;
}

// The shape of the weekend at a glance: numbered steps joined by a line, down
// the page on phones and across it on desktop. Times live on the event
// portal, not here.
export function Weekend({ weekend }: WeekendProps) {
  // On desktop the line runs from the middle of the first column to the
  // middle of the last.
  const edge = { "--edge": `${50 / weekend.steps.length}%` } as CSSProperties;

  return (
    <section id="weekend" aria-labelledby="weekend-heading" className="w-full scroll-mt-16 bg-postal-paper text-postal-navy">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading id="weekend-heading" title={weekend.title} />
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{weekend.intro}</p>
        <FadeIn className="relative mt-12">
          <div
            aria-hidden="true"
            style={edge}
            className="absolute bottom-6 left-6 top-6 w-0.5 bg-postal-navy/20 md:bottom-auto md:left-[var(--edge)] md:right-[var(--edge)] md:h-0.5 md:w-auto"
          />
          <ol className="relative space-y-8 md:flex md:space-y-0">
            {weekend.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-5 md:flex-1 md:flex-col md:items-center md:gap-4 md:px-3 md:text-center"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-postal-navy font-sans font-bold text-postal-paper">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-xl font-bold">{step.title}</h3>
                  <p className="mt-1 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
