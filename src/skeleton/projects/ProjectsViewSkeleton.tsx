"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsViewSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-border/50 bg-card flex h-[380px] flex-col rounded-xl border"
        >
          {/* Card Image Skeleton */}
          <Skeleton className="h-40 w-full rounded-t-xl rounded-b-none" />

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2.5">
                {/* Title Skeleton */}
                <Skeleton className="h-5 w-4/5" />
                {/* Subtitle Skeleton */}
                <Skeleton className="h-3 w-1/2" />
              </div>
              {/* Badge Skeleton */}
              <Skeleton className="h-6 w-12" />
            </div>

            {/* Progress Area Skeleton */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>

            {/* Meta Row Skeleton */}
            <div className="mt-8 flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex -space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>

            {/* Card Footer Actions Skeleton */}
            <div className="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <div className="flex gap-1">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
