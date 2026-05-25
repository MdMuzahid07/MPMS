"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TasksViewSkeleton() {
  return (
    <div className="container mx-auto w-full space-y-5 pb-8">
      {/* Sleek Page Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* Control Canvas Skeleton (Search bar, Switcher, Dropdowns) */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Quick Search Skeleton */}
          <Skeleton className="h-9 w-full max-w-md rounded-lg" />
          {/* View Switcher Skeleton */}
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        {/* Dropdowns Filters Row Skeleton */}
        <div className="border-border/40 grid grid-cols-2 gap-2 border-t pt-3 sm:grid-cols-4 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12 rounded-sm" />
              <Skeleton className="h-8.5 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns skeleton */}
      <div className="border-border bg-card/50 overflow-hidden rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Loop for columns (To Do, In Progress, Review, Done) */}
          {["To Do", "In Progress", "Review", "Done"].map((columnName, idx) => (
            <div
              key={idx}
              className="bg-muted/10 border-border/40 flex min-h-[500px] flex-col space-y-4 rounded-xl border p-3"
            >
              {/* Column Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="size-5 rounded-full" />
                </div>
                <Skeleton className="size-4" />
              </div>

              {/* Column Cards Skeletons */}
              <div className="space-y-3">
                {idx === 0 ? (
                  // Only first column has mock skeleton cards to feel organic
                  Array.from({ length: 2 }).map((_, cIdx) => (
                    <div
                      key={cIdx}
                      className="bg-card border-border relative space-y-4 overflow-hidden rounded-xl border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="size-5 rounded-full" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))
                ) : idx === 1 ? (
                  <div className="bg-card border-border relative space-y-4 overflow-hidden rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ) : (
                  // Empty state visual guides
                  <div className="border-border/40 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
                    <Skeleton className="h-3 w-20" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner Skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}
