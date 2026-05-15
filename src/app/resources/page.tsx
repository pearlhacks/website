"use client";
import { useQueries } from "@tanstack/react-query";
import { getResources } from "@/api/getData";
import { GenericLayout } from "@/components/GenericLayout";
import {
  DevpostLinkCard,
  ExternalLinkCard,
} from "@/components/Resource/ResourceCard";
import {
  DevpostLinkCardSkeleton,
  ExternalLinkCardSkeleton,
} from "@/components/Skeletons/ResourceCard";
import { Resource } from "@/utils/Types";
import { HackerGuideLink } from "@/components/HackerGuideLink";

export default function Page() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["resources"],
        queryFn: async () => {
          const { resources } = await getResources();
          return resources;
        },
      },
      {
        queryKey: ["devpostLinks"],
        queryFn: async () => {
          const { devpostLinks } = await getResources();
          return devpostLinks;
        },
      },
    ],
  });

  const resourcesQuery = queries[0];
  const devpostLinksQuery = queries[1];

  const categories = [
    "Beginner Hackers",
    "General Hacking",
    "Non-Traditional Technologists",
    "Social & Mental Resources",
  ];

  // Check loading and error states
  const areResourcesLoading = resourcesQuery.isLoading;
  const isDevpostLoading = devpostLinksQuery.isLoading;

  const hasResourcesError = resourcesQuery.isError;
  const hasDevpostError = devpostLinksQuery.isError;

  return (
    <GenericLayout title="Resources">
      <HackerGuideLink />
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="w-full mt-8 md:mt-0">
          <h2 className="text-pink font-sans font-bold text-2xl pb-5 break-words">
            Past Projects
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {isDevpostLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <DevpostLinkCardSkeleton key={index} />
              ))
            ) : hasDevpostError ? (
              <div className="w-full col-span-full">
                <p className="text-brown-light text-center py-8">Coming soon...</p>
              </div>
            ) : (
              devpostLinksQuery.data?.map((link) => (
                <DevpostLinkCard
                  key={link.title}
                  title={link.title}
                  img_url={link.img_url}
                  url={link.url}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-pink font-sans font-bold text-2xl pb-5 break-words">
            Useful Tools & Articles
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {areResourcesLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ExternalLinkCardSkeleton key={index} />
              ))
            ) : hasResourcesError ? (
              <div className="w-full col-span-full">
                <p className="text-brown-light text-center py-8">Coming soon...</p>
              </div>
            ) : (
              categories.map((category, index) => (
                <ExternalLinkCard
                  key={category}
                  heading={category}
                  links={
                    resourcesQuery.data?.filter(
                      (resource: Resource) => resource.category === category
                    ) || []
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </GenericLayout>
  );
}
