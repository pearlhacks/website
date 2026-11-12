"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { LazyMotion, MotionValue, domMin, useMotionValue, useScroll, useTransform } from "motion/react";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { Countdown } from "@/components/Scroll/Countdown";
import { Mailbox } from "@/components/Scroll/Mailbox";
import { Street } from "@/components/Scroll/Street";
import { AIRMAIL } from "@/components/UI/airmail";
import { Settings } from "@/lib/content";

interface EnvelopeIntroProps {
  settings: Settings;
}

// Height of the sticky nav, which the stage pins underneath.
const NAV_HEIGHT = 64;

// Without JavaScript, or with reduced motion, the mail is skipped and the
// letter is an ordinary hero section. One rule set serves both.
const STATIC_LETTER =
  "[data-envelope]{height:auto}" +
  "[data-envelope-stage]{position:static;height:auto}" +
  "[data-envelope-scene]{display:none}" +
  "[data-letter]{position:static;opacity:1!important;transform:none!important}";

// Where each step happens, as a share of the pinned scroll. The envelope comes
// out of the mailbox addressed side up, rests where it lands so the date and
// place can be read, turns over, then opens.
const STEPS = {
  mailHint: [0, 0.035],
  drive: [0, 0.25],
  door: [0.025, 0.11],
  emerge: [0.1, 0.25],
  flag: [0.13, 0.2],
  scene: [0.17, 0.27],
  turn: [0.31, 0.39],
  openHintIn: [0.38, 0.42],
  openHintOut: [0.46, 0.5],
  flap: [0.44, 0.54],
  lift: [0.54, 0.66],
  drop: [0.66, 0.81],
  grow: [0.67, 0.85],
  preview: [0.66, 0.72],
  letter: [0.85, 0.94],
} as const;

// 0 before the step, 1 after it, straight through in between.
function through(progress: number, [start, end]: readonly [number, number]) {
  return Math.min(Math.max((progress - start) / (end - start), 0), 1);
}

// 0 before the step, 1 after it, eased out in between.
function step(progress: number, range: readonly [number, number]) {
  const t = through(progress, range);
  return 1 - (1 - t) ** 3;
}

export function EnvelopeIntro({ settings }: EnvelopeIntroProps) {
  const { name, tagline, eventDates, eventTime, eventStart, location, apply } = settings;
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // 0 when the section sits under the nav, 1 when its pinned scroll runs out.
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: [`start ${NAV_HEIGHT}px`, "end end"],
  });

  // Paper geometry in px, measured from layout (transforms don't affect it):
  // how far it rises out of the pocket, how far its center sits from the
  // stage's center, and the scale that makes it cover the stage.
  const lift = useMotionValue(0);
  const centerY = useMotionValue(0);
  const coverX = useMotionValue(1);
  const coverY = useMotionValue(1);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const paper = paperRef.current;
    if (!stage || !paper) return;
    const measure = () => {
      // No offset parent while the static fallback hides the scene.
      if (!paper.offsetParent) return;
      let paperTop = 0;
      for (let el: HTMLElement | null = paper; el && el !== stage; el = el.offsetParent as HTMLElement | null) {
        paperTop += el.offsetTop;
      }
      const paperMiddle = paperTop + paper.offsetHeight / 2;
      lift.set(paper.offsetHeight * 0.65);
      centerY.set(stage.clientHeight / 2 - paperMiddle);
      // A little extra so the paper's rounded corners land off screen.
      coverX.set((stage.clientWidth / paper.offsetWidth) * 1.06);
      coverY.set((stage.clientHeight / paper.offsetHeight) * 1.06);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [lift, centerY, coverX, coverY]);

  const mailHintOpacity = useTransform(progress, (p) => 1 - step(p, STEPS.mailHint));
  const openHintOpacity = useTransform(
    progress,
    (p) => step(p, STEPS.openHintIn) * (1 - step(p, STEPS.openHintOut))
  );

  const doorRotate = useTransform(progress, (p) => step(p, STEPS.door) * -100);
  const doorZ = useTransform(doorRotate, (angle): number => (angle > -90 ? 20 : 5));
  const flagRotate = useTransform(progress, (p) => step(p, STEPS.flag) * -90);
  // The street and mailbox fade back as the envelope comes forward, and stay
  // as a backdrop until the letter covers them.
  const sceneOpacity = useTransform(progress, (p) => 1 - 0.6 * step(p, STEPS.scene));
  // Dot's truck waits just off the left of the screen (half the screen plus
  // a little over half its own width, from the middle), then drives past the
  // mailbox and off the right at a steady speed once the page scrolls.
  const truckX = useTransform(progress, (p) => {
    const t = through(p, STEPS.drive);
    return `calc(${-50 + 100 * t}vw + ${-60 + 120 * t}%)`;
  });
  // The envelope starts small inside the mailbox, then is pulled up and out
  // in an arc to full size.
  const envelopeScale = useTransform(progress, (p) => 0.28 + 0.72 * step(p, STEPS.emerge));
  const envelopeY = useTransform(progress, (p) => {
    const t = step(p, STEPS.emerge);
    return `${12 * (1 - t) - 30 * Math.sin(Math.PI * t)}%`;
  });
  const envelopeRotate = useTransform(progress, (p) => -8 * (1 - step(p, STEPS.emerge)));

  // Turning over and opening are both flat, not 3D, so every browser draws
  // them the same. To turn, the envelope squashes to its edge and opens out
  // again with its back showing.
  const turnScale = useTransform(progress, (p) => Math.abs(Math.cos(Math.PI * through(p, STEPS.turn))));
  const frontOpacity = useTransform(progress, (p): number => (through(p, STEPS.turn) < 0.5 ? 1 : 0));
  // To open, the flap shrinks up to its fold, then grows back mirrored above
  // the envelope with its inside showing.
  const flapScale = useTransform(progress, (p) => Math.cos(Math.PI * step(p, STEPS.flap)));
  const flapOutside = useTransform(flapScale, (scale) => (scale > 0 ? 1 : 0));
  const flapInside = useTransform(flapScale, (scale) => (scale > 0 ? 0 : 1));
  // The flap covers the paper until it's folded flat, then falls behind it.
  const flapZ = useTransform(flapScale, (scale) => (scale > 0 ? 30 : 5));
  const dropY = useTransform(progress, (p) => `${step(p, STEPS.drop) * 110}vh`);
  const dropOpacity = useTransform(progress, (p) => 1 - step(p, STEPS.drop));

  const paperY = useTransform([progress, lift, centerY], ([p, l, c]: number[]) => {
    const risen = -l * step(p, STEPS.lift);
    return risen + (c + l) * step(p, STEPS.grow);
  });
  const previewY = useTransform([progress, lift], ([p, l]: number[]) => -l * step(p, STEPS.lift));
  const previewOpacity = useTransform(progress, (p) => 1 - step(p, STEPS.preview));
  // Scale 1 while the paper is in the envelope, cover once it fills the stage.
  const paperScaleX = useTransform([progress, coverX], ([p, c]: number[]) => 1 + (c - 1) * step(p, STEPS.grow));
  const paperScaleY = useTransform([progress, coverY], ([p, c]: number[]) => 1 + (c - 1) * step(p, STEPS.grow));

  const letterOpacity = useTransform(progress, (p) => step(p, STEPS.letter));
  const letterY = useTransform(progress, (p) => 24 * (1 - step(p, STEPS.letter)));

  // Tabbing into the letter before it has opened jumps to the opened state,
  // so the focused link is never invisible.
  const showLetter = () => {
    const section = ref.current;
    if (!section || progress.get() >= STEPS.letter[1]) return;
    requestAnimationFrame(() => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const end = top + section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: end, behavior: "smooth" });
    });
  };

  return (
    <section
      ref={ref}
      id="content"
      data-envelope
      aria-labelledby="hero-title"
      className="relative h-[520vh] w-full bg-postal-sky"
    >
      <style>{`@media (prefers-reduced-motion: reduce){${STATIC_LETTER}}`}</style>
      <noscript>
        <style>{STATIC_LETTER}</style>
      </noscript>

      {/* clip, not hidden, so focusing the letter can't scroll the stage itself. */}
      <div
        ref={stageRef}
        data-envelope-stage
        className="sticky top-16 h-[calc(100svh-4rem)] overflow-clip"
      >
        {/* domMin supplies the DOM renderer that lets m elements follow MotionValues. */}
        <LazyMotion features={domMin}>
          <div
            data-envelope-scene
            aria-hidden="true"
            className="absolute inset-0 isolate flex flex-col items-center justify-center gap-8 px-4"
          >
            <div className="w-[min(86vw,560px,calc((100svh-4rem)*0.75))]">
              {/* Room for the open flap and the rising paper. Padding on a child,
                  so 30% is of the envelope's width, not the stage's. */}
              <div className="relative pt-[30%]">
                {/* Points down at the mailbox. */}
                <m.p
                  style={{ opacity: mailHintOpacity }}
                  className="absolute inset-x-0 bottom-2 z-10 text-center font-sans text-sm font-bold uppercase tracking-[0.2em] text-postal-navy"
                >
                  {/* Says to scroll, so visitors don't try clicking the mailbox. */}
                  You&rsquo;ve got mail <span className="whitespace-nowrap">(Scroll!)</span>
                  <span className="mt-1 block animate-bounce text-lg motion-reduce:animate-none">&darr;</span>
                </m.p>
              </div>
              {/* The mailbox is centered on the envelope, which starts inside it. */}
              <div className="relative aspect-[8/5] w-full">
                <Street opacity={sceneOpacity} truckX={truckX} />
                <Mailbox door={doorRotate} doorZ={doorZ} flag={flagRotate} opacity={sceneOpacity} />

                <m.div
                  style={{ scale: envelopeScale, scaleX: turnScale, y: envelopeY, rotate: envelopeRotate }}
                  className="absolute inset-0 z-10"
                >
                  {/* A white airmail envelope. Its blue lining, behind the paper;
                      the ring outlines the envelope against the sky. */}
                  <m.div
                    style={{ y: dropY, opacity: dropOpacity }}
                    className="absolute inset-0 rounded-md bg-postal-blue-light ring-1 ring-postal-navy/20"
                  />

                  <m.div
                    ref={paperRef}
                    style={{ y: paperY, scaleX: paperScaleX, scaleY: paperScaleY }}
                    className="absolute inset-x-[5%] bottom-[4%] top-[6%] z-10 rounded-sm bg-postal-paper shadow-md"
                  />
                  {/* Kept apart from the paper so its text never stretches with it. */}
                  <m.div
                    style={{ y: previewY, opacity: previewOpacity }}
                    className="absolute inset-x-[5%] bottom-[4%] top-[6%] z-10 flex flex-col items-center pt-[6%] text-center text-postal-navy"
                  >
                    <p className="font-sans text-sm italic sm:text-base">You&rsquo;re invited to</p>
                    <p className="font-sans text-2xl font-bold uppercase sm:text-4xl">{name}</p>
                  </m.div>

                  {/* The pocket: side flaps with a V cut out, then the bottom flap. */}
                  <m.div style={{ y: dropY, opacity: dropOpacity }} className="absolute inset-0 z-20">
                    <div className="absolute inset-0 rounded-md bg-postal-paper [clip-path:polygon(0_0,50%_52%,100%_0,100%_100%,0_100%)]" />
                    <div className="absolute inset-0 rounded-md bg-postal-sky [clip-path:polygon(0_100%,50%_42%,100%_100%)]" />
                  </m.div>

                  <m.div
                    style={{ y: dropY, opacity: dropOpacity, zIndex: flapZ }}
                    className="absolute inset-0"
                  >
                    {/* The shadow marks the flap's edge on the white pocket. */}
                    <m.div
                      style={{ scaleY: flapScale }}
                      className="absolute inset-x-0 top-0 h-[58%] origin-top [filter:drop-shadow(0_1px_2px_rgb(35_58_106/0.35))]"
                    >
                      <m.div
                        style={{ opacity: flapOutside }}
                        className="absolute inset-0 bg-postal-paper [clip-path:polygon(0_0,100%_0,50%_100%)]"
                      />
                      {/* Seen once the flap is open; the mirroring turns it to point up. */}
                      <m.div
                        style={{ opacity: flapInside }}
                        className="absolute inset-0 bg-postal-blue-light [clip-path:polygon(0_0,100%_0,50%_100%)]"
                      />
                      <m.div
                        style={{ opacity: flapOutside }}
                        className="absolute bottom-0 left-1/2 flex h-12 w-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-postal-red shadow-md ring-2 ring-postal-red-dark sm:h-20 sm:w-20 sm:ring-4"
                      >
                        <Image src="/images/PH2026Logo.svg" alt="" width={44} height={42} className="h-7 w-7 object-contain sm:h-11 sm:w-11" />
                      </m.div>
                    </m.div>
                  </m.div>

                  <EnvelopeFront
                    opacity={frontOpacity}
                    name={name}
                    dates={eventDates}
                    time={eventTime}
                    location={location}
                  />
                </m.div>
              </div>
            </div>

            <m.p
              style={{ opacity: openHintOpacity }}
              className="relative z-10 font-sans text-sm font-bold uppercase tracking-[0.2em] text-postal-navy"
            >
              Scroll to open
              <span className="mt-2 block animate-bounce text-center text-lg motion-reduce:animate-none">
                &darr;
              </span>
            </m.p>
          </div>

          {/* The letter is the real hero: plain HTML, in the server render. */}
          <m.div
            data-letter
            onFocus={showLetter}
            style={{ opacity: letterOpacity, y: letterY }}
            className="absolute inset-0 z-10 flex min-h-[calc(100svh-4rem)] items-center justify-center bg-postal-paper px-4 py-16 text-center text-postal-navy"
          >
            <div className="max-w-xl">
              <p className="font-sans font-bold italic text-postal-red-dark">{tagline}</p>
              <p className="mt-6 font-sans text-lg italic">You&rsquo;re invited to</p>
              <h1
                id="hero-title"
                className="break-words font-sans text-5xl font-bold uppercase sm:text-6xl lg:text-7xl"
              >
                {name}
              </h1>
              <p className="mt-4 text-lg font-normal">
                {eventDates} · {location}
              </p>
              <div className="[&_[data-countdown]]:justify-center">
                <Countdown start={eventStart} />
              </div>
              {apply.href && (
                <div className="mt-8">
                  <SecondaryButton href={apply.href} textColor="text-postal-navy">
                    {apply.label}
                  </SecondaryButton>
                </div>
              )}
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}


interface EnvelopeFrontProps {
  opacity: MotionValue<number>;
  name: string;
  dates: string;
  time: string;
  location: string;
}

// The envelope's addressed side, seen first: airmail stripes around the edge,
// a stamp with a postmark, and when and where the event is, addressed to the
// visitor. It covers the back until the envelope turns over.
function EnvelopeFront({ opacity, name, dates, time, location }: EnvelopeFrontProps) {
  return (
    <m.div style={{ opacity }} className={`absolute inset-0 z-40 rounded-md p-[3%] shadow-md ${AIRMAIL}`}>
      <div className="relative h-full rounded-sm bg-postal-paper text-postal-navy">
        <p className="absolute left-[5%] top-[8%] font-sans text-[10px] font-bold uppercase tracking-wider sm:text-xs">
          From: {name}
        </p>
        <div className="absolute right-[5%] top-[8%] w-[13%] border-[3px] border-dotted border-postal-red bg-postal-sky p-0.5 sm:p-1">
          <div className="relative aspect-[4/5]">
            <Image src="/images/PH2026Logo.svg" alt="" fill className="object-contain" />
          </div>
        </div>
        {/* A postmark over the stamp's left edge, its wavy lines trailing off to the left. */}
        <svg viewBox="0 0 120 60" className="absolute right-[10%] top-[9%] w-[28%] text-postal-navy/50">
          <circle cx="90" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 20q7-6 14 0t14 0 14 0 14 0" />
            <path d="M4 32q7-6 14 0t14 0 14 0 14 0" />
            <path d="M4 44q7-6 14 0t14 0 14 0 14 0" />
          </g>
        </svg>
        <div className="absolute inset-x-[8%] bottom-[12%] text-center">
          <p className="font-sans text-xs italic sm:text-sm">To: you</p>
          <p className="mt-1 font-sans text-xl font-bold uppercase sm:text-3xl">{dates}</p>
          <p className="text-sm sm:text-base">{time}</p>
          <p className="mt-1 font-sans text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">{location}</p>
        </div>
      </div>
    </m.div>
  );
}
