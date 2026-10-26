"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { animate } from "motion/mini";
import { playOnView } from "@/components/Scroll/playOnView";

interface PopInProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once in view before the first item pops. */
  delay?: number;
}

// The gap between one item popping and the next.
const STAGGER = 0.07;

// Pops every [data-pop] element inside it into place, one after another, as
// it scrolls into view: each grows from 60% with a small overshoot. See
// playOnView for when it plays and replays.
export function PopIn({ children, className, delay = 0 }: PopInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;

    const items = Array.from(element.querySelectorAll<HTMLElement>("[data-pop]"));
    return playOnView(element, {
      hide: () => {
        for (const item of items) {
          item.style.opacity = "0";
          item.style.transform = "scale(0.6)";
        }
      },
      play: () =>
        items.forEach((item, index) =>
          animate(
            item,
            { opacity: [0, 1, 1], transform: ["scale(0.6)", "scale(1.08)", "none"] },
            { duration: 0.5, delay: delay + index * STAGGER, times: [0, 0.65, 1] }
          )
        ),
      amount: 0.2,
    });
  }, [delay, reduceMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
