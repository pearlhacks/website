"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import dynamic from "next/dynamic";
import "../../public/globals.css"; // Ensure only necessary styles are included

// Lazy load the ScrollToTopButton to reduce initial bundle size
const ScrollToTopButton = dynamic(
  () =>
    import("@/components/Buttons/ScrollToTop").then(
      (mod) => mod.ScrollToTopButton
    ),
  { ssr: false }
);

export default function RootLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 60 * 1000, // 1-hour cache for freshness
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient,
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: ({ queryKey }) => {
            // Avoid persisting large queries
            return !queryKey.includes("large-data-query");
          },
        },
      });

      // Cleanup strategy to avoid exceeding storage limits
      const cleanupStorage = () => {
        const keys = Object.keys(localStorage);
        if (keys.length > 50) {
          // Example: Remove older stored queries when exceeding 50 entries
          localStorage.removeItem(keys[0]);
        }
      };

      cleanupStorage();
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Lets Next.js pause smooth scrolling (globals.css) while it changes pages. */}
      <html lang="en" data-scroll-behavior="smooth">
        <body>
          <main className="min-h-screen font-body font-light flex flex-col items-center bg-background-transition">
            <ScrollToTopButton />
            {children}
          </main>
        </body>
      </html>
    </QueryClientProvider>
  );
}
