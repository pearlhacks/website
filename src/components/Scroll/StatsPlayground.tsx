"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { LazyMotion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/components/Scroll/useMediaQuery";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Stats } from "@/lib/content";

interface StatsPlaygroundProps {
  stats: Stats;
}

// Where each photo card starts, and its tilt in degrees.
const CARDS = [
  { position: "left-0 top-0", rotate: -6 },
  { position: "right-0 bottom-0", rotate: 3 },
];

const loadDragFeatures = () => import("./dragFeatures").then((mod) => mod.default);

export function StatsPlayground({ stats }: StatsPlaygroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Phones and touch screens tap instead of drag, so a swipe still scrolls the page.
  const canDrag = useMediaQuery("(min-width: 768px) and (pointer: fine)");
  // Card indexes from back to front.
  const [order, setOrder] = useState(() => stats.photos.map((_, index) => index));
  const front = order[order.length - 1];

  const bringToFront = (index: number) =>
    setOrder((current) =>
      current[current.length - 1] === index
        ? current
        : [...current.filter((i) => i !== index), index]
    );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="w-full overflow-clip bg-postal-sky-dark text-postal-navy"
    >
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading id="stats-heading" title={stats.title} />
        <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
          <LazyMotion features={loadDragFeatures}>
            <div className="relative mx-auto h-64 w-full max-w-md sm:h-80">
              {stats.photos.map((photo, index) => {
                const card = CARDS[index % CARDS.length];
                // Click, tap, Enter and Space all bring a card to the front;
                // on desktop it can also be dragged anywhere in the section.
                return (
                  <m.button
                    key={index}
                    type="button"
                    drag={canDrag}
                    dragConstraints={sectionRef}
                    dragElastic={reduceMotion ? 0 : 0.2}
                    dragMomentum={!reduceMotion}
                    onPointerDown={() => bringToFront(index)}
                    onClick={() => bringToFront(index)}
                    animate={{ scale: index === front ? 1.04 : 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    style={{ rotate: card.rotate, zIndex: order.indexOf(index) }}
                    className={`absolute w-3/5 rounded-2xl bg-white p-2 shadow-lg ${card.position} ${
                      canDrag ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                  >
                    <Image
                      src={`/art/stats/photo-${index + 1}.webp`}
                      alt={photo.alt}
                      width={1200}
                      height={900}
                      draggable={false}
                      className="h-auto w-full rounded-xl"
                    />
                  </m.button>
                );
              })}
            </div>
          </LazyMotion>
          <ul className="grid grid-cols-2 gap-4">
            {stats.items.map((stat) => (
              <li
                key={stat.label}
                className="flex aspect-square flex-col items-center justify-center rounded-full bg-postal-paper p-4 text-center shadow-md"
              >
                <p className="font-sans text-2xl font-bold break-words md:text-3xl">{stat.value}</p>
                <p className="text-sm font-normal break-words">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
