"use client";

import * as m from "motion/react-m";
import { MotionValue } from "motion/react";
import { DotPlaceholder } from "@/components/Scroll/DotPlaceholder";
import { SCENE_FRAME } from "@/components/Scroll/Mailbox";

interface StreetProps {
  /** Fades the street back once the envelope is out. */
  opacity: MotionValue<number>;
  /** How far Dot's truck has driven, from the centre of the street (vw). */
  truckX: MotionValue<string>;
}

// Drawn in the mailbox's 400×520 box (the mailbox spans x 40–370, its post
// x 182–226), so the street lines up with it at any screen size. It runs far
// off both sides and the bottom; the stage crops it. Distances along y, top
// to bottom:
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

const TREES = [-760, 650, 1120];

// Each cloud is a few overlapping puffs around a centre.
const CLOUDS = [
  { x: -420, y: -90 },
  { x: 640, y: -140 },
  { x: -900, y: -150 },
  { x: 1000, y: -50 },
];

// Rows of bushes down the front lawn, each staggered from the one above and
// a little smaller, as they get closer. Two sit either side of the mailbox
// post. Each entry: x, distance below the lawn's edge, size.
const BUSHES: [number, number, number][] = [
  ...[-1080, -860, -640, -420, -200, -20, 400, 600, 820, 1040].map((x): [number, number, number] => [x, 22, 1]),
  [150, 60, 0.8],
  [262, 60, 0.8],
  ...[-970, -750, -530, -310, -110, 510, 710, 930].map((x): [number, number, number] => [x, 100, 0.85]),
  ...[-1080, -860, -640, -420, -200, 0, 400, 600, 820, 1040].map((x): [number, number, number] => [x, 175, 0.75]),
];

// Flowers between the rows: x, distance below the lawn's edge, red or white.
const FLOWERS: [number, number, boolean][] = [
  [-1020, 62, true], [-800, 70, false], [-590, 58, true], [-360, 66, false], [-150, 60, true],
  [70, 70, false], [330, 64, true], [450, 72, false], [660, 60, true], [880, 68, false], [1100, 62, true],
  [-1030, 140, false], [-860, 135, true], [-640, 142, false], [-420, 138, true], [-200, 140, false],
  [20, 136, true], [140, 130, false], [300, 140, true], [400, 132, false], [600, 138, true],
  [820, 134, false], [1040, 140, true],
];

// A suburban street behind the mailbox, with Dot driving a mail truck past
// as the page scrolls.
export function Street({ opacity, truckX }: StreetProps) {
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
          <StreetSign x={-240} name="Pearl Hacks Ave" />

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

          {FLOWERS.map(([x, y, red]) => (
            <g key={`${x},${y}`}>
              <circle cx={x} cy={LAWN + y} r="8" className={red ? "fill-postal-red" : "fill-postal-paper"} />
              <circle cx={x} cy={LAWN + y} r="3" className="fill-postal-tan" />
            </g>
          ))}
          {BUSHES.map(([x, y, size]) => (
            <Bush key={`${x},${y}`} x={x} y={LAWN + y} size={size} />
          ))}
        </svg>

        {/* Sits on the near lane, centred behind the mailbox at x 0. */}
        <m.div style={{ x: truckX }} className="absolute left-[9%] top-[38.75%] w-[52%]">
          <MailTruck />
        </m.div>
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
      {/* Shrubs either side of the front door. */}
      <Bush x={middle - 38} y={GROUND - 8} size={0.55} />
      <Bush x={middle + 38} y={GROUND - 8} size={0.55} />
    </g>
  );
}

// Three overlapping rounds with a shadow on one side. size 1 is about 90 wide.
function Bush({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <g className="fill-postal-blue-dark">
        <circle cx="-26" cy="4" r="20" />
        <circle cx="0" cy="-8" r="26" />
        <circle cx="26" cy="4" r="20" />
      </g>
      <circle cx="16" cy="2" r="16" className="fill-postal-navy-light/30" />
    </g>
  );
}

// A street-name sign on a pole, standing on the far pavement.
function StreetSign({ x, name }: { x: number; name: string }) {
  return (
    <g>
      <rect x={x - 3} y={GROUND - 128} width="6" height="128" className="fill-postal-navy" />
      <rect x={x - 66} y={GROUND - 148} width="132" height="28" rx="4" className="fill-postal-navy" />
      <rect x={x - 61} y={GROUND - 143} width="122" height="18" rx="2" fill="none" strokeWidth="1.5" className="stroke-postal-paper" />
      <text
        x={x}
        y={GROUND - 129.5}
        textAnchor="middle"
        fontSize="11"
        className="fill-postal-paper font-sans font-bold uppercase tracking-wider"
      >
        {name}
      </text>
    </g>
  );
}

// A boxy mail truck facing right, driven by Dot. The cab is drawn with a big
// window cut out of it, over Dot, so Dot's ears and cap show through it.
function MailTruck() {
  return (
    <div className="relative aspect-[150/84] w-full">
      <DotPlaceholder className="absolute left-[63.4%] top-[11.7%] w-[30.5%]" />
      <svg viewBox="0 0 150 84" className="absolute inset-0 h-full w-full">
        <g strokeWidth="2.5" className="fill-postal-paper stroke-postal-navy">
          <rect x="2" y="8" width="90" height="56" rx="4" />
          <path fillRule="evenodd" d="M92 10H124Q142 10 146 30L148 58V64H92ZM97 15V48H137V15Z" />
        </g>
        <rect x="2" y="50" width="146" height="5" className="fill-postal-red" />
        <rect x="2" y="55" width="146" height="3" className="fill-postal-navy" />
        <g strokeWidth="2" className="fill-postal-sky stroke-postal-navy">
          <rect x="32" y="18" width="30" height="20" rx="2" />
          <path d="M32 18l15 11 15-11" fill="none" />
        </g>
        <g className="fill-postal-navy">
          <circle cx="28" cy="66" r="11" />
          <circle cx="120" cy="66" r="11" />
          <rect x="138" y="58" width="11" height="6" rx="2" />
        </g>
        <g className="fill-postal-paper">
          <circle cx="28" cy="66" r="4.5" />
          <circle cx="120" cy="66" r="4.5" />
        </g>
      </svg>
    </div>
  );
}
