"use client";

import * as m from "motion/react-m";
import { MotionValue, useTransform } from "motion/react";

interface MailboxProps {
  /** Door angle in degrees: 0 closed, negative swings it down toward the viewer. */
  door: MotionValue<number>;
  /** Puts the door above the letter while closed and below it once open. */
  doorZ: MotionValue<number>;
  /** Flag angle in degrees: 0 raised, -90 lowered along the side. */
  flag: MotionValue<number>;
  /** Fades the mailbox back once the envelope is out. */
  opacity: MotionValue<number>;
}

// The art is drawn in a 400×520 box. Its door is centered at (140, 190), so
// the frame is shifted to put that point on its parent's center, where the
// envelope sits. The street behind it is drawn in the same box.
export const SCENE_FRAME =
  "absolute left-1/2 top-1/2 aspect-[400/520] w-[80%] -translate-x-[35%] -translate-y-[36.54%]";

// The door is a separate layer so the envelope can sit between the inside of
// the mailbox and its door. Both layers share the same frame and fade.
export function Mailbox({ door, doorZ, flag, opacity }: MailboxProps) {
  // The door swings flat, not in 3D, so every browser draws it the same: it
  // shrinks toward its hinge, then grows back mirrored below it with its
  // inside showing.
  const doorScale = useTransform(door, (angle) => Math.cos((angle * Math.PI) / 180));
  const doorOutside = useTransform(doorScale, (scale) => (scale > 0 ? 1 : 0));
  const doorInside = useTransform(doorScale, (scale) => (scale > 0 ? 0 : 1));

  return (
    <>
      <m.div style={{ opacity }} className="absolute inset-0 z-0">
        <div className={SCENE_FRAME}>
          <svg viewBox="0 0 400 520" overflow="visible" className="absolute inset-0 h-full w-full">
            {/* Post, running off the bottom of the stage. */}
            <rect x="182" y="280" width="44" height="1200" strokeWidth="4" className="fill-postal-tan-deep stroke-postal-navy" />
            <rect x="212" y="280" width="14" height="1200" className="fill-postal-navy/20" />
            {/* Body seen at three quarters: the curved top, then the right side.
                Outlined in navy, like the mascot art, so it stands off the street. */}
            <g strokeWidth="5" strokeLinejoin="round" className="stroke-postal-navy">
              <path d="M110.6 84.4A100 100 0 0 1 240 180L370 140A100 100 0 0 0 240.6 44.4Z" className="fill-postal-blue-light" />
              <path d="M240 180L370 140V260L240 300Z" className="fill-postal-blue-dark" />
            </g>
            {/* Rim and the dark inside, seen once the door opens. */}
            <path d="M40 300V180A100 100 0 0 1 240 180V300Z" className="fill-postal-navy" />
            <path d="M50 292V180A90 90 0 0 1 230 180V292Z" className="fill-postal-navy-dark" />
          </svg>
          {/* Pivots at the bottom of its pole, on the side of the box. */}
          <m.div
            style={{ rotate: flag }}
            className="absolute bottom-[56.7%] left-[80.5%] h-[21%] w-[1.6%] origin-bottom rounded-full bg-postal-navy"
          >
            <div className="absolute left-full top-0 h-[32%] w-[720%] rounded-r-sm bg-postal-red" />
          </m.div>
        </div>
      </m.div>

      <m.div style={{ opacity, zIndex: doorZ }} className="absolute inset-0">
        <div className={SCENE_FRAME}>
          <m.div
            style={{ scaleY: doorScale }}
            className="absolute left-[10%] top-[15.38%] h-[42.31%] w-1/2 origin-bottom"
          >
            <m.div
              style={{ opacity: doorOutside }}
              className="absolute inset-0 border-[3px] border-postal-navy bg-postal-blue [border-top-left-radius:50%_45.45%] [border-top-right-radius:50%_45.45%]"
            >
              <div className="absolute left-1/2 top-[10%] h-[7%] w-[16%] -translate-x-1/2 rounded-full bg-postal-navy" />
            </m.div>
            {/* Seen once the door hangs open; the mirroring puts its curve at the bottom. */}
            <m.div
              style={{ opacity: doorInside }}
              className="absolute inset-0 border-[3px] border-postal-navy bg-postal-blue-dark [border-top-left-radius:50%_45.45%] [border-top-right-radius:50%_45.45%]"
            />
          </m.div>
        </div>
      </m.div>
    </>
  );
}
