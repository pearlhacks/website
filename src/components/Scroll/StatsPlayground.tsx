"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { LazyMotion, inView, useReducedMotion } from "motion/react";
import { animate } from "motion/mini";
import { PopIn } from "@/components/Scroll/PopIn";
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

// The cards turn face up one after the other; the stat bubbles pop in once
// the last one has turned.
const FLIP_DURATION = 0.8;
const FLIP_STAGGER = 0.2;

export function StatsPlayground({ stats }: StatsPlaygroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Phones and touch screens tap instead of drag, so a swipe still scrolls the page.
  const canDrag = useMediaQuery("(min-width: 768px) and (pointer: fine)");
  // Card indexes from back to front.
  const [order, setOrder] = useState(() => stats.photos.map((_, index) => index));
  const front = order[order.length - 1];
  const cardsRef = useRef<HTMLDivElement>(null);

  // The first time the cards scroll into view, they turn over from face down.
  // Like FadeIn, the server HTML shows them face up, and they only turn if
  // they start below the fold. The turn is on an inner layer, so it doesn't
  // fight motion over the card's own transform (tilt, drag and scale).
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || reduceMotion) return;
    if (cards.getBoundingClientRect().top < window.innerHeight) return;

    const flippers = Array.from(cards.querySelectorAll<HTMLElement>("[data-flip]"));
    for (const flipper of flippers) flipper.style.transform = "perspective(1000px) rotateY(180deg)";
    const stop = inView(
      cards,
      () => {
        flippers.forEach((flipper, index) =>
          animate(
            flipper,
            { transform: ["perspective(1000px) rotateY(180deg)", "none"] },
            { duration: FLIP_DURATION, delay: index * FLIP_STAGGER, ease: [0.22, 1, 0.36, 1] }
          )
        );
        stop();
      },
      { amount: 0.35 }
    );
    return stop;
  }, [reduceMotion]);

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
            <div ref={cardsRef} className="relative mx-auto h-64 w-full max-w-md sm:h-80">
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
                    className={`absolute w-3/5 ${card.position} ${
                      canDrag ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                  >
                    <div data-flip className="relative [transform-style:preserve-3d]">
                      <div className="rounded-2xl bg-white p-2 shadow-lg [backface-visibility:hidden]">
                        <Image
                          src={`/art/stats/photo-${index + 1}.webp`}
                          alt={photo.alt}
                          width={1200}
                          height={900}
                          draggable={false}
                          className="h-auto w-full rounded-xl"
                        />
                      </div>
                      <CardBack />
                    </div>
                  </m.button>
                );
              })}
            </div>
          </LazyMotion>
          <PopIn delay={FLIP_DURATION + FLIP_STAGGER * (stats.photos.length - 1)}>
            <ul className="grid grid-cols-2 gap-4">
              {stats.items.map((stat) => (
                <li
                  key={stat.label}
                  data-pop
                    className="flex aspect-square flex-col items-center justify-center rounded-full bg-postal-paper p-4 text-center shadow-md"
                >
                  <p className="font-sans text-2xl font-bold break-words md:text-3xl">{stat.value}</p>
                  <p className="text-sm font-normal break-words">{stat.label}</p>
                </li>
              ))}
            </ul>
          </PopIn>
        </div>
      </div>
    </section>
  );
}

// The back of a photo card, seen while it lies face down: navy, with a
// postmark in the middle.
function CardBack() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center rounded-2xl bg-postal-navy shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
    >
      <svg viewBox="0 0 120 60" className="w-1/2 text-postal-sky">
        <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="30" y="35" textAnchor="middle" fontSize="13" fill="currentColor" className="font-sans font-bold">
          PH27
        </text>
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M62 18q7-6 14 0t14 0 14 0 14 0" />
          <path d="M62 30q7-6 14 0t14 0 14 0 14 0" />
          <path d="M62 42q7-6 14 0t14 0 14 0 14 0" />
        </g>
      </svg>
    </div>
  );
}
