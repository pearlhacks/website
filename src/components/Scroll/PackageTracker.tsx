"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { playOnView } from "@/components/Scroll/playOnView";
import { Weekend, WeekendStep } from "@/lib/content";

interface PackageTrackerProps {
  tracking: Weekend["tracking"];
  steps: WeekendStep[];
  className?: string;
}

// How long the line takes to run from one checkpoint to the next.
const STEP_MS = 600;

// The weekend as a parcel-tracking page: a status headline over checkpoints
// joined by a line, down the card on phones and across it on desktop. As it
// scrolls into view the parcel "ships": the checkpoints tick off one after
// another, the headline follows along, and a Delivered stamp lands on the
// last one. See playOnView for when it plays and replays.
export function PackageTracker({ tracking, steps, className = "" }: PackageTrackerProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  // How many checkpoints are ticked off. Starts at all of them, matching the
  // server HTML.
  const [reached, setReached] = useState(steps.length);

  useEffect(() => {
    const list = ref.current;
    if (!list || reduceMotion) return;

    let timer: number | undefined;
    const stop = playOnView(list, {
      hide: () => {
        window.clearTimeout(timer);
        setReached(0);
      },
      play: () => {
        let count = 0;
        const advance = () => {
          count += 1;
          setReached(count);
          if (count < steps.length) timer = window.setTimeout(advance, STEP_MS);
        };
        advance();
      },
      amount: 0.4,
    });
    return () => {
      stop();
      window.clearTimeout(timer);
    };
  }, [reduceMotion, steps.length]);

  const delivered = reached === steps.length;
  const status = steps[Math.max(reached, 1) - 1].status;

  return (
    <div className={`rounded-2xl border border-postal-navy/15 bg-postal-paper p-6 shadow-lg md:p-8 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-postal-navy/15 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-postal-navy/60">{tracking.label}</p>
          {/* Repeats a status from the list below, so screen readers skip it.
              The key makes each new status rise into place. */}
          <p
            key={status}
            aria-hidden="true"
            className="mt-1 animate-rise font-sans text-3xl font-bold motion-reduce:animate-none md:text-4xl"
          >
            {status}
          </p>
        </div>
        <dl className="flex gap-8 text-sm">
          <div>
            <dt className="text-postal-navy/60">Carrier</dt>
            <dd className="font-bold">{tracking.carrier}</dd>
          </div>
          <div>
            <dt className="text-postal-navy/60">Tracking ID</dt>
            <dd className="font-mono font-bold">{tracking.id}</dd>
          </div>
        </dl>
      </div>

      <ol ref={ref} className="mt-8 space-y-8 md:flex md:space-y-0">
        {steps.map((step, index) => {
          const done = index < reached;
          const current = index === reached - 1;
          const last = index === steps.length - 1;
          return (
            <li
              key={step.title}
              className="relative flex gap-5 md:flex-1 md:flex-col md:items-center md:gap-4 md:px-3 md:text-center"
            >
              {/* The line on to the next checkpoint: from this circle's
                  centre down to the next on phones, across on desktop. It
                  fills on its way there, and the next circle ticks off as it
                  arrives. */}
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-14 left-6 top-6 w-0.5 -translate-x-1/2 bg-postal-navy/15 md:bottom-auto md:left-1/2 md:h-0.5 md:w-full md:translate-x-0 md:-translate-y-1/2"
                >
                  <span
                    style={{ transitionDuration: `${STEP_MS}ms` }}
                    className={`block h-full w-full origin-top bg-postal-navy transition-transform ease-linear motion-reduce:transition-none md:origin-left ${
                      done ? "" : "scale-y-0 md:scale-x-0 md:scale-y-100"
                    }`}
                  />
                </span>
              )}
              <span
                aria-hidden="true"
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-sans font-bold transition duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] motion-reduce:transition-none ${
                  done
                    ? "bg-postal-navy text-postal-paper"
                    : "scale-75 border-2 border-postal-navy/20 bg-postal-paper text-postal-navy/40"
                }`}
              >
                {done ? <Check /> : String(index + 1).padStart(2, "0")}
              </span>
              <div className={`transition-opacity duration-300 ${done ? "" : "opacity-50"}`}>
                <p
                  className={`text-sm font-bold uppercase tracking-wider ${
                    current ? "text-postal-red-dark" : "text-postal-navy/60"
                  }`}
                >
                  {step.status}
                </p>
                <h3 className="font-sans text-xl font-bold">{step.title}</h3>
                <p className="mt-1 leading-relaxed">{step.body}</p>
                {last && <DeliveredStamp label={step.status} landed={delivered} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// A red rubber stamp under the last step. It slams down from 1.5x, a moment
// after the last checkpoint ticks off.
function DeliveredStamp({ label, landed }: { label: string; landed: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-4 inline-block -rotate-6 rounded-md border-[3px] border-postal-red px-3 py-1 text-center font-sans font-bold uppercase leading-tight text-postal-red transition duration-300 ease-[cubic-bezier(0.3,1.4,0.6,1)] motion-reduce:transition-none ${
        landed ? "delay-200" : "scale-150 opacity-0"
      }`}
    >
      <span className="block text-lg tracking-widest">{label}</span>
      <span className="block text-xs tracking-wider">PH27</span>
    </span>
  );
}
