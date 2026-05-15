"use client";
import { getDirectors } from "@/api/getData";
import Tab from "@/components/About/Tab";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { GenericLayout } from "@/components/GenericLayout";
import { TabSkeleton } from "@/components/Skeletons/Tab";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const {
    data: directors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["directors"],
    queryFn: getDirectors,
  });
  return (
    <GenericLayout title="About Us">
      <div className="space-y-4 text-brown mt-4 md:mt-0">
        <div className="flex flex-wrap items-center">
          <h2 className="font-sans font-bold text-2xl py-5 text-pink">
            Our Beginnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 w-full mb-4">
            <img
              src="/images/about/IMG_8358.JPG"
              alt="Pearl Hacks team on steps"
              className="w-full h-48 lg:h-56 object-cover rounded-lg"
            />
            <img
              src="/images/about/IMG_5344.jpg"
              alt="Pearl Hacks participants with project"
              className="w-full h-48 lg:h-56 object-cover rounded-lg"
            />
            <img
              src="/images/about/IMG_5372.jpg"
              alt="Pearl Hacks networking"
              className="w-full h-48 lg:h-56 object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col md:flex-row items-top lg:items-center md:space-x-4 text-brown">
            <div className="space-y-4">
              <p>
                The first Pearl Hacks was held in 2014 as one of the only
                beginner-friendly hackathons targeted towards women at the time.
                Founded by UNC alumnus Maegan Clawges, Pearl Hacks was organized
                in response to the boom in college hackathons. These hackathons
                allowed participants to spend a weekend bringing their
                technological ideas to life with the help of their peers and
                industry professionals.
              </p>
              <p>
                While all emerging hackathons were great at immersing students
                into tech, it was clear that the gender gap and the often
                intimidating environment at those events prevented a lot of
                women of all skill levels from signing up. The first Pearl Hacks
                brought together 250 female high school and college students in
                the hopes of providing them with a positive and welcoming
                hackathon experience that sidestepped these issues.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center text-start space-x-4 text-brown">
          <div className="flex flex-col md:flex-row items-top md:space-x-4 lg:items-center">
            <div className="space-y-4">
              <p>
                By growing and learning from the last ten years of Pearl Hacks
                (which has nearly tripled in size), we now strive to be an open
                and inclusive environment for all gender minorities to
                experience hackathons. After spending the weekend with us, it is
                our hope that participants feel more confident and capable as
                they dive deeper into the world of technology. Additionally,
                Pearl Hacks welcomes a diverse set of skills and seeks to
                provide as many beginner-friendly resources as possible for
                those who are coding for the first time!
              </p>
              <p>
                Pearl Hacks is a weekend of meeting amazing people, learning
                about technology, and free swag and prizes. We hope you join us
                at this wonderful event!
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <SecondaryButton href="https://maeganclawges.com/web/pearlhacks.html">
            Learn more
          </SecondaryButton>
        </div>
        <div className="flex flex-wrap items-center">
          <h2 className="font-sans font-bold text-2xl py-5 text-pink">
            Inclusivity Statement
          </h2>
          <div className="flex flex-col md:flex-row items-top lg:items-center md:space-x-4 text-brown">
            <div className="space-y-4">
              <p>
                Pearl Hacks is an event designed to uplift and center women and
                gender non-conforming individuals in tech. We expect all of our
                mentors, volunteers, participants, directors, sponsors, judges,
                and visitors to be respectful of our participants' gender
                identities and expressions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap items-center">
        <h2 className="text-pink font-sans font-bold text-2xl py-5">
          Meet the Team
        </h2>
        {isLoading ? (
          <TabSkeleton />
        ) : isError ? (
          <p className="text-brown-light text-center py-8 w-full">Coming soon...</p>
        ) : directors ? (
          <Tab directors={directors} />
        ) : null}
      </div>
    </GenericLayout>
  );
}
