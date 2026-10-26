"use client";

import * as m from "motion/react-m";
import { MotionValue } from "motion/react";
import { DotPlaceholder } from "@/components/Scroll/DotPlaceholder";
import { SCENE_FRAME } from "@/components/Scroll/Mailbox";

interface StreetProps {
  /** Fades the street back once the envelope is out. */
  opacity: MotionValue<number>;
}

// Drawn in the mailbox's 400×520 box (the mailbox spans x 40–370), so the
// street lines up with it at any screen size. It runs far off both sides and
// the bottom; the stage crops it. Distances along y, top to bottom:
const GROUND = 236; // where the houses stand
const ROAD_TOP = 252;
const ROAD_BOTTOM = 326;
const LAWN = 344;

interface House {
  x: number;
  width: number;
  height: number;
  wall: string;
  roof: string;
}

// Across the street, left to right, leaving the stretch behind the mailbox clear.
const HOUSES: House[] = [
  { x: -980, width: 180, height: 120, wall: "fill-postal-tan", roof: "fill-postal-red" },
  { x: -700, width: 200, height: 140, wall: "fill-postal-paper", roof: "fill-postal-navy" },
  { x: -460, width: 170, height: 115, wall: "fill-postal-blue-light", roof: "fill-postal-red" },
  { x: -190, width: 200, height: 135, wall: "fill-postal-tan-light", roof: "fill-postal-navy" },
  { x: 420, width: 190, height: 130, wall: "fill-postal-blue-light", roof: "fill-postal-navy" },
  { x: 700, width: 200, height: 145, wall: "fill-postal-tan", roof: "fill-postal-red" },
  { x: 940, width: 170, height: 118, wall: "fill-postal-paper", roof: "fill-postal-navy" },
  { x: 1150, width: 190, height: 130, wall: "fill-postal-blue-light", roof: "fill-postal-red" },
];

const TREES = [-760, -250, 650, 1120];

// Each cloud is a few overlapping puffs around a centre.
const CLOUDS = [
  { x: -420, y: -90 },
  { x: 640, y: -140 },
  { x: -900, y: -150 },
  { x: 1000, y: -50 },
];

// A suburban street behind the mailbox, with Dot driving a mail truck past.
export function Street({ opacity }: StreetProps) {
  return (
    <m.div style={{ opacity }} aria-hidden="true" className="absolute inset-0 z-0">
      <div className={SCENE_FRAME}>
        <svg viewBox="0 0 400 520" overflow="visible" className="absolute inset-0 h-full w-full">
          {CLOUDS.map(({ x, y }) => (
            <g key={`${x},${y}`} className="fill-postal-paper">
              <ellipse cx={x} cy={y} rx="60" ry="22" />
              <ellipse cx={x - 30} cy={y - 10} rx="30" ry="22" />
              <ellipse cx={x + 22} cy={y - 18} rx="34" ry="26" />
            </g>
          ))}

          {HOUSES.map((house) => (
            <HouseShape key={house.x} {...house} />
          ))}
          {TREES.map((x) => (
            <g key={x}>
              <rect x={x - 5} y={GROUND - 50} width="10" height="50" className="fill-postal-tan-deep" />
              <circle cx={x} cy={GROUND - 78} r="36" className="fill-postal-blue-dark" />
              <circle cx={x + 14} cy={GROUND - 70} r="20" className="fill-postal-navy-light/40" />
            </g>
          ))}

          {/* Far pavement, road with a dashed centre line, near pavement, lawn. */}
          <rect x="-2400" y={GROUND} width="5200" height={ROAD_TOP - GROUND} className="fill-postal-paper" />
          <rect x="-2400" y={ROAD_TOP} width="5200" height={ROAD_BOTTOM - ROAD_TOP} className="fill-postal-blue" />
          <line
            x1="-2400"
            x2="2800"
            y1={(ROAD_TOP + ROAD_BOTTOM) / 2}
            y2={(ROAD_TOP + ROAD_BOTTOM) / 2}
            strokeWidth="4"
            strokeDasharray="30 30"
            className="stroke-postal-paper"
          />
          <rect x="-2400" y={ROAD_BOTTOM} width="5200" height={LAWN - ROAD_BOTTOM} className="fill-postal-paper" />
          <rect x="-2400" y={LAWN} width="5200" height="1600" className="fill-postal-sky-dark" />
        </svg>

        {/* In the near lane, centred behind the mailbox; the animation drives
            it across from off screen. Parked to one side with reduced motion. */}
        <div className="absolute left-[15%] top-[44.1%] w-[40%]">
          <div className="animate-drive motion-reduce:translate-x-[-30vw] motion-reduce:animate-none">
            <MailTruck />
          </div>
        </div>
      </div>
    </m.div>
  );
}

function HouseShape({ x, width, height, wall, roof }: House) {
  const top = GROUND - height;
  const middle = x + width / 2;
  return (
    <g>
      <path d={`M${x - 12} ${top}L${middle} ${top - 70}L${x + width + 12} ${top}Z`} className={roof} />
      <rect x={x} y={top} width={width} height={height} className={wall} />
      <g strokeWidth="3" className="fill-postal-sky stroke-postal-navy">
        <rect x={x + 22} y={top + 24} width="34" height="30" rx="3" />
        <rect x={x + width - 56} y={top + 24} width="34" height="30" rx="3" />
      </g>
      <rect x={middle - 16} y={GROUND - 54} width="32" height="54" rx="3" className="fill-postal-navy" />
    </g>
  );
}

// A boxy mail truck facing right, with Dot showing through the driver's
// window: the cab is drawn with a hole where the window is, over Dot.
function MailTruck() {
  return (
    <div className="relative aspect-[130/72] w-full">
      <DotPlaceholder className="absolute left-[64.6%] top-[17%] w-[31%]" />
      <svg viewBox="0 0 130 72" className="absolute inset-0 h-full w-full">
        <g strokeWidth="2.5" className="fill-postal-paper stroke-postal-navy">
          <rect x="2" y="6" width="86" height="50" rx="4" />
          <path
            fillRule="evenodd"
            d="M88 22H112Q124 22 126 34L128 50V56H88ZM93 26V42H115V26Z"
          />
        </g>
        <rect x="2" y="40" width="126" height="5" className="fill-postal-red" />
        <rect x="2" y="45" width="126" height="3" className="fill-postal-navy" />
        <g strokeWidth="2" className="fill-postal-sky stroke-postal-navy">
          <rect x="30" y="15" width="28" height="18" rx="2" />
          <path d="M30 15l14 10 14-10" fill="none" />
        </g>
        <g className="fill-postal-navy">
          <circle cx="26" cy="58" r="10" />
          <circle cx="104" cy="58" r="10" />
          <rect x="118" y="50" width="11" height="6" rx="2" />
        </g>
        <g className="fill-postal-paper">
          <circle cx="26" cy="58" r="4" />
          <circle cx="104" cy="58" r="4" />
        </g>
      </svg>
    </div>
  );
}
