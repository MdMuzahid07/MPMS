"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsViewSkeleton() {
  return (
    <div className="container mx-auto w-full space-y-6 pb-8">
      {/* Page Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* 3 Report Stat Cards skeleton */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card flex flex-col gap-3 rounded-xl border p-5"
          >
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-40 rounded-sm" />
              {i === 1 && <Skeleton className="h-5 w-28 rounded-full" />}
            </div>
          </div>
        ))}
      </section>

      {/* Sprint Progress Section skeleton */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
          {/* Chart skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          {/* Stats details skeleton */}
          <div className="border-border/40 hidden space-y-4 border-l pl-6 md:block">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance Table skeleton */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse">
            <thead className="bg-muted/10">
              <tr className="border-border/60 border-y">
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-20" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-28" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-12" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-border/40 border-b">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-2 w-24 rounded-full" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-8" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner Skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}
