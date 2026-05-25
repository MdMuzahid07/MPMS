"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TeamViewSkeleton() {
  return (
    <div className="container mx-auto w-full space-y-6 pb-8">
      {/* Team Header Skeleton */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Filters Skeleton */}
          <div className="flex h-9 items-center gap-2">
            <Skeleton className="h-9 w-32.5 rounded-lg" />
            <Skeleton className="h-9 w-32.5 rounded-lg" />
          </div>
          {/* Search bar & Add Button Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Main Members Directory Table Skeleton */}
      <section className="bg-card overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 border-collapse">
            <thead className="bg-muted/35">
              <tr className="border-b">
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-10" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-20" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-12" />
                </th>
                <th className="px-5 py-3 text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </th>
                <th className="w-12 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Skeleton className="h-5.5 w-16 rounded-full" />
                  </td>
                  <td className="px-5 py-3.5">
                    <Skeleton className="h-3.5 w-24" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <Skeleton className="h-4 w-12 rounded" />
                      <Skeleton className="h-4 w-14 rounded" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Skeleton className="ml-auto h-5 w-12 rounded-full" />
                  </td>
                  <td className="px-5 py-3.5">
                    <Skeleton className="h-6 w-6 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Overview Stat Grid Skeleton */}
      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="size-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
