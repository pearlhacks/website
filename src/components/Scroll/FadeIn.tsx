"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { animate } from "motion/mini";
import { playOnView } from "@/components/Scroll/playOnView";

interface FadeInProps {
  children: ReactNode;
  className?: string;
}

// Fades and rises 24px as it scrolls into view. See playOnView for when it
// plays and replays.
export function FadeIn({ children, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;

    return playOnView(element, {
      hide: () => {
        element.style.opacity = "0";
        element.style.transform = "translateY(24px)";
      },
      play: () =>
        animate(
          element,
          { opacity: [0, 1], transform: ["translateY(24px)", "none"] },
          { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        ),
      amount: 0.2,
    });
  }, [reduceMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
