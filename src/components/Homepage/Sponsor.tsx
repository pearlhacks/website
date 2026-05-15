import { SponsorProps } from "@/utils/Types";
import { SponsorGrid } from "./SponsorGrid";

export function Sponsor({ sponsors, isError }: SponsorProps & { isError?: boolean }) {
  return (
    <div className={`relative bg-brown-light ${isError ? "h-[20rem]" : "h-[50rem] sm:h-[60rem] md:h-[70rem] lg:h-[60rem]"}`}>
      <img
        src="/images/landing/PH26 Transition.svg"
        className="cover"
        alt="cover"
      />
      <div className={`w-full absolute flex flex-col justify-center items-center text-center px-5 md:px-10 space-y-8 ${isError ? "top-[45%] -translate-y-1/2 pb-8" : "top-32 sm:top-40 md:top-60 lg:top-[20rem] pb-32"}`}>
        <h2 className={`font-sans font-bold text-2xl mt-4 ${isError ? "text-brown" : "text-white"}`}>
          Our 2026 Sponsors
        </h2>
        {isError ? (
          <p className="text-brown/70">Coming soon...</p>
        ) : (
          <SponsorGrid sponsors={sponsors ?? []} />
        )}
      </div>
    </div>
  );
}
