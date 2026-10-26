"use client";

import { ReactNode, useEffect, useRef } from "react";
import { inView, useReducedMotion } from "motion/react";
import { animate } from "motion/mini";

interface PopInProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once in view before the first item pops. */
  delay?: number;
}

// The gap between one item popping and the next.
const STAGGER = 0.07;

// Pops every [data-pop] element inside it into place, one after another, the
// first time it scrolls into view: each grows from 60% with a small
// overshoot. Like FadeIn, the server HTML shows everything, so nothing is
// hidden without JavaScript, and it only moves if it starts below the fold.
export function PopIn({ children, className, delay = 0 }: PopInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const items = Array.from(element.querySelectorAll<HTMLElement>("[data-pop]"));
    for (const item of items) {
      item.style.opacity = "0";
      item.style.transform = "scale(0.6)";
    }
    const stop = inView(
      element,
      () => {
        items.forEach((item, index) =>
          animate(
            item,
            { opacity: [0, 1, 1], transform: ["scale(0.6)", "scale(1.08)", "none"] },
            { duration: 0.5, delay: delay + index * STAGGER, times: [0, 0.65, 1] }
          )
        );
        stop();
      },
      { amount: 0.2 }
    );
    return stop;
  }, [delay, reduceMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
