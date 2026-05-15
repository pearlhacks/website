"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GenericLayout } from "@/components/GenericLayout";
import { ScheduleButton } from "@/components/Schedule/ScheduleButton";
import { getSchedules } from "@/api/getData";
import { ScheduleEventCard } from "@/components/Schedule/ScheduleEventCards";
import { parseISO, isThisWeek, parse } from "date-fns";
import { Schedule } from "@/utils/Types";
import { ScheduleSkeleton } from "@/components/Skeletons/ScheduleSkeleton";
import { HackerGuideLink } from "@/components/HackerGuideLink";

export default function Page() {
  const [currentTab, setCurrentTab] = useState<
    "upcoming" | "workshops" | "day1" | "day2"
  >("upcoming");

  const { data: scheduleData = [], isLoading, isError } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  const categorizeEvents = (events: Schedule[]) => {
    const day1Events: Schedule[] = [];
    const day2Events: Schedule[] = [];
    const workshops: Schedule[] = [];
    const upcomingEvents: Schedule[] = [];

    events.forEach((event) => {
      const eventDate = parse(event.date, "MM/dd", new Date());

      const calculateEndTime = (startTime?: string, duration?: string) => {
        if (!startTime || !duration) {
          return ""; // Handle cases where data is missing
        }

        try {
          // Parse start time into hours and minutes
          const [time, modifier] = startTime.split(" "); // E.g., "9:00 AM"
          const [hours, minutes] = time.split(":").map(Number);

          // Create a base Date object with the start time
          const startDate = new Date();
          if (modifier === "PM" && hours !== 12) {
            startDate.setHours(hours + 12); // Convert PM times to 24-hour format, except for 12 PM
          } else if (modifier === "AM" && hours === 12) {
            startDate.setHours(0); // 12 AM is midnight, so set it to 0 hours
          } else {
            startDate.setHours(hours); // For AM times except 12 AM and PM times except 12 PM
          }
          startDate.setMinutes(minutes || 0);
          startDate.setSeconds(0);

          // Convert duration to minutes
          const durationInMinutes = parseFloat(duration) * 60;

          // Duration + Start Time
          const endDate = new Date(
            startDate.getTime() + durationInMinutes * 60000
          );

          // Format end time
          return endDate;
        } catch (error) {
          console.error("Error calculating end time:", error);
          return "";
        }
      };

      const endDatetime = calculateEndTime(
        event.start_time,
        event.duration.toString()
      );

      if (event.date === "2/21") {
        day1Events.push(event);
      } else if (event.date === "2/22") {
        day2Events.push(event);
      }

      if (event.event_type.includes("Workshop")) {
        workshops.push(event);
      }
      if (isThisWeek(eventDate)) {
        upcomingEvents.push(event);
      }
    });

    return {
      day1: day1Events,
      day2: day2Events,
      workshops: workshops,
      upcoming: upcomingEvents,
    };
  };

  const categorizedEvents = categorizeEvents(scheduleData);

  const renderEvents = () => {
    const eventsToDisplay = categorizedEvents[currentTab] || [];
    if (eventsToDisplay.length === 0) {
      return (
        <p className="text-brown-light text-center">
          No events coming up. Check back with us soon!
        </p>
      );
    }
    return <ScheduleEventCard events={eventsToDisplay} />;
  };

  return (
    <GenericLayout title="Schedule">
      <div className="w-full flex flex-col items-center space-y-20 text-brown">
        <HackerGuideLink />

        <div className="w-full flex overflow-x-auto flex-start md:justify-center space-x-20">
          <ScheduleButton
            onClick={() => setCurrentTab("upcoming")}
            className={`${
              currentTab === "upcoming"
                ? "bg-brown border-b-2 border-brown text-white"
                : "bg-brown border-b-2 border-brown hover:opacity-80 text-white"
            } `}
          >
            This week
          </ScheduleButton>
          <ScheduleButton
            onClick={() => setCurrentTab("workshops")}
            className={`${
              currentTab === "workshops"
                ? "bg-brown-light border-b-2 border-brown-light text-white"
                : "bg-brown-light hover:opacity-80 text-white"
            } `}
          >
            Workshops
          </ScheduleButton>
          <ScheduleButton
            onClick={() => setCurrentTab("day1")}
            className={`${
              currentTab === "day1"
                ? "bg-blue border-b-2 border-blue text-white"
                : "bg-blue hover:opacity-80 text-white"
            } `}
          >
            Day 1
          </ScheduleButton>
          <ScheduleButton
            onClick={() => setCurrentTab("day2")}
            className={`${
              currentTab === "day2"
                ? "bg-pink-light border-b-2 border-pink-light text-white"
                : "bg-pink-light hover:opacity-80 text-white"
            } `}
          >
            Day 2
          </ScheduleButton>
        </div>

        <div className="w-full space-y-4">
          {isLoading ? (
            <ScheduleSkeleton />
          ) : isError ? (
            <p className="text-brown-light text-center py-12">Coming soon...</p>
          ) : (
            renderEvents()
          )}
        </div>
      </div>
    </GenericLayout>
  );
}
