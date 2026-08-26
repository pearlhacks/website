"use client";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Navbar } from "../Navbar/Navbar";
import { motion } from "framer-motion";
import StarsOverlay from "./Star";
import Image from "next/image";
import { SecondaryButton } from "../Buttons/SecondaryButton";
import { PrimaryButton } from "../Buttons/PrimaryButton";
import { link_2026mailinglist, link_directorapp, link_discord_2026, register_participant, register_volunteer } from "@/utils/Urls";
import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const codingStart = new Date("2026-02-21T00:00:00-05:00");
const codingEnd = new Date("2026-02-22T23:00:00-05:00");

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventStatus, setEventStatus] = useState<"before" | "during" | "after">("before");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      if (now < codingStart) {
        const difference = codingStart.getTime() - now.getTime();
        setEventStatus("before");
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else if (now >= codingStart && now <= codingEnd) {
        const difference = codingEnd.getTime() - now.getTime();
        setEventStatus("during");
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        setEventStatus("after");
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <div className="bg-cream bg-cover bg-center bg-no-repeat bg-[url('/images/landing/PH2026_WebsiteLanding.svg')]">
        <StarsOverlay />
        <Navbar mode="landing" />
        <div className="z-10 w-full p-10 pb-20 md:pb-52 space-x-4 flex flex-wrap items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ duration: 1 }}
            className="relative sm:w-2/3 md:w-2/5 h-auto"
          >
            <Image
              src="/images/landing/PH2026_MG.svg"
              alt="Pearl Hacks 2026 Logo"
              width={500} // Adjust based on design
              height={500} // Adjust based on design
              priority // Ensures this image loads first
            />
          </motion.div>
          <div className="z-10 space-y-4 text-center md:text-left px-4">
            <div>
              <div className="font-sans">
                <h2 className="text-xl font-bold text-brown-medium italic"> brew with </h2>
                <h1 className="text-brown-dark md:text-brown text-5xl font-bold uppercase break-words">
                  Pearl Hacks
                </h1>
              </div>
              {eventStatus === "after" ? (
                <span className="justify-center md:justify-start flex font-medium text-brown flex-row space-x-2">
                  <ClockIcon className="w-6" />
                  <p>Ended. Thank you for participating!</p>
                </span>
              ) : eventStatus === "during" ? (
                <div>
                  <span className="flex justify-center md:justify-start font-medium text-brown flex-row space-x-2 mb-2">
                    <ClockIcon className="w-6" />
                    <p>Event is live! Time remaining:</p>
                  </span>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{timeLeft.days}</div>
                      <div className="text-xs font-bold text-brown-medium">DAYS</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">HOURS</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">MIN</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">SEC</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="flex justify-center md:justify-start font-medium text-brown flex-row space-x-2 mb-2">
                    <ClockIcon className="w-6" />
                    <p>Countdown to Pearl Hacks 2026</p>
                  </span>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{timeLeft.days}</div>
                      <div className="text-xs font-bold text-brown-medium">DAYS</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">HOURS</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">MIN</div>
                    </div>
                    <div className="text-3xl font-bold text-brown">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-brown-medium">SEC</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {/* <SecondaryButton href={register_participant}>
                    HACKER REGISTRATION
                  </SecondaryButton>
                  <a
                    href={link_discord_2026}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-bold text-white border-2 border-brown-light bg-brown-light hover:bg-transparent transition ease-in-out p-2 px-4 uppercase rounded-full inline-flex justify-center items-center backdrop-blur"
                  >
                    JOIN DISCORD SERVER
                  </a> */}
                </div>
                {/* <PrimaryButton href={register_volunteer}>
                  MENTOR & VOLUNTEER APPLICATION
                </PrimaryButton> */}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
