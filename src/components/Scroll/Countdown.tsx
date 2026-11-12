"use client";

import { useSyncExternalStore } from "react";

interface CountdownProps {
  /** ISO 8601 start time; null renders nothing. */
  start: string | null;
}

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Whole seconds, so the snapshot only changes once per tick.
const getNow = () => Math.floor(Date.now() / 1000);
const getServerNow = () => null;

export function Countdown({ start }: CountdownProps) {
  const now = useSyncExternalStore<number | null>(subscribe, getNow, getServerNow);
  const startMs = start ? Date.parse(start) : NaN;
  if (Number.isNaN(startMs)) return null;

  const remaining = now === null ? 0 : Math.floor(startMs / 1000) - now;
  if (now !== null && remaining <= 0) return null;

  const units = [
    { label: "days", value: Math.floor(remaining / 86400) },
    { label: "hrs", value: Math.floor(remaining / 3600) % 24 },
    { label: "min", value: Math.floor(remaining / 60) % 60 },
    { label: "sec", value: remaining % 60 },
  ];

  // The server doesn't know the time, so it reserves the space invisibly and
  // the hero doesn't shift when the numbers arrive. Without JavaScript the
  // numbers never arrive, so the noscript style gives the space back.
  return (
    <>
      <noscript>
        <style>{"[data-countdown]{display:none}"}</style>
      </noscript>
      <div
        data-countdown
        role="timer"
        aria-label="Time until the event starts"
        className={`mt-4 flex gap-4 ${now === null ? "invisible" : ""}`}
      >
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <p className="font-sans text-3xl font-bold tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="text-xs font-bold uppercase">{unit.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}
