"use client";

import { FocusEvent, useRef } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { LazyMotion, domMin, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { useMediaQuery } from "@/components/Scroll/useMediaQuery";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Journey, JourneyPanel as JourneyPanelContent } from "@/lib/content";

interface HorizontalJourneyProps {
  journey: Journey;
}

// The server always renders the vertical stack, so phones, reduced motion and
// no-JS all get it. Desktops switch to the pinned strip after hydration; the
// section is below the fold, so the switch is never on screen.
export function HorizontalJourney({ journey }: HorizontalJourneyProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion();
  const pinned = isDesktop && !reduceMotion;

  return (
    <section aria-labelledby="journey-heading" className="w-full bg-postal-sky text-postal-navy">
      <div className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading id="journey-heading" title={journey.title} />
      </div>
      {pinned ? (
        <PinnedStrip panels={journey.panels} />
      ) : (
        <ol className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
          {journey.panels.map((panel, index) => (
            <li key={panel.title}>
              <JourneyPanel panel={panel} index={index} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

interface PinnedStripProps {
  panels: JourneyPanelContent[];
}

// Height of the sticky nav, which the strip pins underneath.
const NAV_HEIGHT = 64;

// Separate component so useScroll mounts with its target already attached.
function PinnedStrip({ panels }: PinnedStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const count = panels.length;
  // Pinning starts when the strip reaches the bottom of the 64px nav.
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${NAV_HEIGHT}px`, "end end"] });
  // Slide until the last panel fills the frame: -75% of the strip for 4 panels.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((count - 1) / count) * 100}%`]);

  // Tabbing to a link in an off-screen panel scrolls the page to the point
  // where that panel fills the frame. Waits a frame so it runs after the
  // browser's own scroll-into-view.
  const showFocusedPanel = (event: FocusEvent<HTMLOListElement>) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    if (!item) return;
    const progress = count > 1 ? Number(item.dataset.panel) / (count - 1) : 0;
    requestAnimationFrame(() => {
      const outer = ref.current;
      if (!outer) return;
      const top = outer.getBoundingClientRect().top + window.scrollY;
      const start = top - NAV_HEIGHT;
      const end = top + outer.offsetHeight - window.innerHeight;
      window.scrollTo({ top: start + progress * (end - start), behavior: "smooth" });
    });
  };

  return (
    <div ref={ref} className="relative" style={{ height: `${count * 100}vh` }}>
      {/* clip, not hidden: a hidden box is still scrollable, and focusing an
          off-screen link would scroll it sideways out of step with the strip. */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-clip">
        {/* domMin supplies the DOM renderer that lets m elements follow MotionValues. */}
        <LazyMotion features={domMin}>
          <m.ol
            onFocus={showFocusedPanel}
            style={{ x, width: `${count * 100}%` }}
            className="flex h-full will-change-transform"
          >
            {panels.map((panel, index) => (
              <li
                key={panel.title}
                data-panel={index}
                className="h-full shrink-0 px-4 py-8"
                style={{ width: `${100 / count}%` }}
              >
                <div className="mx-auto h-full max-w-7xl">
                  <JourneyPanel panel={panel} index={index} fill />
                </div>
              </li>
            ))}
          </m.ol>
        </LazyMotion>
      </div>
    </div>
  );
}

interface JourneyPanelProps {
  panel: JourneyPanelContent;
  index: number;
  /** Fill the pinned frame instead of keeping the art's 16:10 shape. */
  fill?: boolean;
}

// Art is decorative; the panel's words are real HTML on top of it.
function JourneyPanel({ panel, index, fill = false }: JourneyPanelProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl bg-postal-paper ${
        fill ? "h-full" : "md:aspect-[16/10]"
      }`}
    >
      <Image
        src={`/art/journey/panel-${index + 1}.webp`}
        alt=""
        width={1440}
        height={900}
        className="h-auto w-full md:absolute md:inset-0 md:h-full md:object-cover"
      />
      <div className="relative p-6 md:m-10 md:max-w-md md:rounded-3xl md:bg-postal-paper md:p-8 md:shadow-lg">
        <p className="font-sans font-bold">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="font-sans text-2xl font-bold">{panel.title}</h3>
        <p className="mt-3 leading-relaxed">{panel.body}</p>
        {panel.link && (
          <div className="mt-5">
            <SecondaryButton href={panel.link.href} textColor="text-postal-navy">
              {panel.link.label}
            </SecondaryButton>
          </div>
        )}
      </div>
    </article>
  );
}
