"use client";

import { Accordion } from "@/components/FAQ/Accordion";
import { GenericLayout } from "@/components/GenericLayout";
import { AccordionGrid } from "@/components/Skeletons/Accordion";
import { Heading } from "@/components/Skeletons/Heading";
import { SocialMediaBar } from "@/components/Footer/SocialMediaBar";
import { useQuery } from "@tanstack/react-query";
import { getFAQs } from "@/api/getData";
import { HackerGuideLink } from "@/components/HackerGuideLink";

export default function Page() {
  const categories = [
    "Beginner's FAQs",
    "General FAQs",
    "Guidelines",
    "Transportation",
    "Reimbursements",
  ];

  // Use single query to fetch all FAQs
  const {
    data: allFaqs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: getFAQs,
  });
  if (isLoading) {
    return (
      <GenericLayout title="FAQ">
        <div className="w-full flex flex-col justify-start items-start animate-pulse">
          <Heading />
          <AccordionGrid />
        </div>
      </GenericLayout>
    );
  }

  // Group FAQs by category
  const faqsByCategory = categories.map((category) => ({
    category,
    faqs: allFaqs?.filter((faq) => faq.category === category) || [],
  }));

  return (
    <GenericLayout title="FAQ">
      <HackerGuideLink />
      <div className="mt-8 md:mt-0">
      {isError ? (
        <p className="text-brown-light text-center py-12">Coming soon...</p>
      ) : (
        faqsByCategory.map(({ category, faqs }) => (
          <div className="pb-5" key={category}>
            <h2 className="font-sans font-bold text-2xl text-pink break-words">
              {category}
            </h2>
            <div className="p-2 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-x-10">
              {faqs.map((faq) => (
                <Accordion
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        ))
      )}
      </div>
      <div className="w-full flex flex-col items-center text-center pt-10 px-4">
        <p className="text-brown font-medium text-sm sm:text-base break-words">
          Can&apos;t find what you&apos;re looking for? Reach out to us through
          any of these channels
        </p>
        <SocialMediaBar />
      </div>
    </GenericLayout>
  );
}
