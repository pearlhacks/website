"use client";
import { About } from "@/components/Homepage/About";
import { Footer } from "@/components/Footer/Footer";
import { HeroSection } from "@/components/Homepage/HeroSection";
import { Sponsor } from "@/components/Homepage/Sponsor";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSponsors } from "@/api/getData";

export default function Home() {


  const {
    data: sponsors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sponsors"],
    queryFn: getSponsors,
  });

  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <About />
      <Sponsor sponsors={sponsors ?? []} isError={isError} />
      <Footer backgroundColor="landing" />
    </div>
  );
}
