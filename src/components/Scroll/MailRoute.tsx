"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import {
  LazyMotion,
  MotionValue,
  domMin,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { DotPlaceholder } from "@/components/Scroll/DotPlaceholder";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Program, Programs } from "@/lib/content";

interface MailRouteProps {
  programs: Programs;
}

interface Point {
  x: number;
  y: number;
}

interface Route {
  /** SVG path through every stop, in px relative to the route box. */
  d: string;
  width: number;
  height: number;
  /** Each stop's height as a share of the route, where Dot reaches it. */
  stops: number[];
}

// Points sampled along the path, so placing Dot on scroll never touches the DOM.
interface Sample extends Point {
  length: number;
}

const SAMPLES = 240;

// A smooth curve through the points that leaves and enters each one vertically,
// so it crosses between stops halfway down the gap between their cards.
function routePath(points: Point[]) {
  const [first, ...rest] = points;
  let d = `M${first.x} ${first.y}`;
  let previous = first;
  for (const point of rest) {
    const half = (point.y - previous.y) / 2;
    d += `C${previous.x} ${previous.y + half} ${point.x} ${point.y - half} ${point.x} ${point.y}`;
    previous = point;
  }
  return d;
}

// The stops are server-rendered cards, so they read fine without JavaScript.
// After hydration a dotted route is drawn through them, and Dot carries the
// envelope along it, staying level with the middle of the screen. With
// reduced motion the route is drawn in full and Dot stays out of the way.
export function MailRoute({ programs }: MailRouteProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const samples = useRef<Sample[]>([]);
  const reduceMotion = useReducedMotion();
  const [route, setRoute] = useState<Route | null>(null);

  // 0 when the top of the route reaches the middle of the screen, 1 at the bottom.
  const { scrollYProgress: progress } = useScroll({
    target: boxRef,
    offset: ["start center", "end center"],
  });
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const facing = useMotionValue(1);
  const trail = useMotionValue(0);

  // The route always heads down, so the sample level with the scroll position
  // can be found by height.
  const place = useCallback(
    (p: number) => {
      const points = samples.current;
      if (points.length < 2) return;
      const total = points[points.length - 1];
      const target = p * total.y;
      let high = points.findIndex((point) => point.y >= target);
      if (high <= 0) high = high === 0 ? 1 : points.length - 1;
      const a = points[high - 1];
      const b = points[high];
      const t = b.y === a.y ? 0 : Math.min(Math.max((target - a.y) / (b.y - a.y), 0), 1);
      dotX.set(a.x + (b.x - a.x) * t);
      dotY.set(a.y + (b.y - a.y) * t);
      trail.set((a.length + (b.length - a.length) * t) / total.length);
      if (Math.abs(b.x - a.x) > 0.5) facing.set(b.x > a.x ? 1 : -1);
    },
    [dotX, dotY, facing, trail]
  );

  useMotionValueEvent(progress, "change", place);

  // Route through the middle of each stop's marker, from the top of the box to
  // the bottom. Redrawn whenever the box resizes.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const bounds = box.getBoundingClientRect();
      const markers = Array.from(box.querySelectorAll<HTMLElement>("[data-stop-marker]"));
      if (markers.length === 0) return;
      const points = markers.map((marker) => {
        const rect = marker.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - bounds.left,
          y: rect.top + rect.height / 2 - bounds.top,
        };
      });
      const first = points[0];
      const last = points[points.length - 1];
      setRoute({
        d: routePath([{ x: first.x, y: 0 }, ...points, { x: last.x, y: bounds.height }]),
        width: bounds.width,
        height: bounds.height,
        stops: points.map((point) => point.y / bounds.height),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Sample the new path once it's in the DOM, then put Dot where it belongs.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !route) return;
    const length = path.getTotalLength();
    samples.current = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const at = (i / SAMPLES) * length;
      const { x, y } = path.getPointAtLength(at);
      return { x, y, length: at };
    });
    place(progress.get());
  }, [route, place, progress]);

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="w-full scroll-mt-16 overflow-clip bg-postal-sky text-postal-navy"
    >
      <div className="mx-auto max-w-5xl px-4 py-20">
        <SectionHeading id="programs-heading" title={programs.title} />
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{programs.intro}</p>
        <LazyMotion features={domMin}>
          <div ref={boxRef} className="relative mt-12">
            {route && (
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${route.width} ${route.height}`}
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              >
                {/* The whole route, faint, with the travelled part drawn over it. */}
                <path
                  d={route.d}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1 11"
                  className="stroke-postal-navy/40"
                />
                {/* pathLength moves the stroke's dash, which only repaints this path. */}
                <m.path
                  ref={pathRef}
                  d={route.d}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ pathLength: reduceMotion ? 1 : trail }}
                  className="stroke-postal-navy"
                />
              </svg>
            )}

            <ol className="relative space-y-16 md:space-y-24">
              {programs.items.map((program, index) => (
                <Stop
                  key={program.title}
                  program={program}
                  index={index}
                  progress={progress}
                  at={route?.stops[index] ?? null}
                />
              ))}
            </ol>

            {route && !reduceMotion && (
              // A zero-size anchor on the route; Dot is centred on it.
              <m.div style={{ x: dotX, y: dotY }} className="pointer-events-none absolute left-0 top-0">
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <m.div style={{ scaleX: facing }}>
                    <DotPlaceholder className="h-14 w-14 drop-shadow-md md:h-24 md:w-24" />
                  </m.div>
                </div>
              </m.div>
            )}
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}

interface StopProps {
  program: Program;
  index: number;
  progress: MotionValue<number>;
  /** Share of the route where Dot reaches this stop; null until measured. */
  at: number | null;
}

// Cards alternate sides on desktop, with the marker in the middle of the empty
// half beside them. On phones the markers run down the left edge.
function Stop({ program, index, progress, at }: StopProps) {
  const [reached, setReached] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setReached(at !== null && p >= at));
  const right = index % 2 === 1;

  return (
    <li className={`relative pl-16 md:w-1/2 md:pl-0 ${right ? "md:ml-auto" : ""}`}>
      {/* Stamped with a postmark once Dot gets here. */}
      <div
        data-stop-marker
        aria-hidden="true"
        className={`absolute left-6 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-postal-navy bg-postal-paper font-sans font-bold ${
          right ? "md:left-[-50%]" : "md:left-[150%]"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
        {/* Without Dot travelling (reduced motion), every stop starts delivered.
            Done in CSS so the server and browser render the same markup. */}
        <span
          className={`absolute inset-[-3px] flex items-center justify-center rounded-full bg-postal-red text-postal-paper transition duration-300 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
            reached ? "scale-100 opacity-100" : "scale-150 opacity-0"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <FadeIn>
        <article className="rounded-3xl bg-postal-paper p-6 shadow-md md:p-8">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-postal-red-dark">
            Stop {String(index + 1).padStart(2, "0")} · {program.label}
          </p>
          <h3 className="mt-1 font-sans text-2xl font-bold">{program.title}</h3>
          <p className="mt-3 leading-relaxed">{program.body}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {program.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </FadeIn>
    </li>
  );
}
