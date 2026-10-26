"use client";

import { ReactNode, useEffect, useRef } from "react";
import { inView, useReducedMotion } from "motion/react";
import { animate } from "motion/mini";

interface HangProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once in view, so neighbouring strands drop in turn. */
  delay?: number;
}

// Lowers its content from above the first time it scrolls into view, then
// lets it sway to rest like an ornament, swinging from its top centre. Like
// FadeIn, the server HTML shows it in place, so nothing is hidden without
// JavaScript, and it only moves if it starts below the fold.
export function Hang({ children, className, delay = 0 }: HangProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const outer = ref.current;
    const strand = outer?.firstElementChild as HTMLElement | null;
    if (!outer || !strand || reduceMotion) return;
    if (outer.getBoundingClientRect().top < window.innerHeight) return;

    strand.style.transform = "translateY(-105%)";
    // Watches the wrapper, not the strand: the strand starts above the edge
    // of its section, which clips it out of the observer's sight.
    const stop = inView(
      outer,
      () => {
        animate(
          strand,
          {
            transform: [
              "translateY(-105%) rotate(0deg)",
              "translateY(3%) rotate(5deg)",
              "translateY(0) rotate(-3.5deg)",
              "translateY(0) rotate(2deg)",
              "translateY(0) rotate(-1deg)",
              "none",
            ],
          },
          { duration: 1.8, delay, times: [0, 0.35, 0.55, 0.72, 0.87, 1], ease: [0.45, 0, 0.55, 1] }
        );
        stop();
      },
      { amount: 0.3 }
    );
    return stop;
  }, [delay, reduceMotion]);

  return (
    <div ref={ref} className={className}>
      <div className="origin-top">{children}</div>
    </div>
  );
}
