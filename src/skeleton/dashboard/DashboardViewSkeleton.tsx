"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardViewSkeleton() {
  return (
    <div className="container mx-auto w-full space-y-6 pb-8">
      {/* Stats Cards Skeleton Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border-border relative space-y-5 overflow-hidden rounded-2xl border p-5"
          >
            <div className="flex items-start justify-between">
              {/* Icon skeleton */}
              <Skeleton className="size-10 rounded-xl" />
              {/* Tag skeleton */}
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="space-y-2">
              {/* Title skeleton */}
              <Skeleton className="h-3 w-28" />
              {/* Value skeleton */}
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Grid Skeleton */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent Strategic Projects Table Skeleton */}
        <div className="border-border bg-card/45 space-y-5 rounded-2xl border p-5 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-56 rounded-md" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-160 border-collapse">
              <thead className="bg-muted/10">
                <tr className="border-border/60 border-y">
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3 w-24" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3 w-20" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3 w-12" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-border/40 border-b">
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-2 w-24 rounded-full" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-7 w-12 rounded-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aside Skeleton */}
        <aside className="space-y-6">
          {/* Focus Section Skeleton */}
          <div className="border-border bg-card space-y-4 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="size-4" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border bg-card space-y-3 rounded-xl border p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-7 shrink-0 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <div className="flex items-center gap-2 pt-1">
                        <Skeleton className="h-5 w-14 rounded-sm" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity Trend Skeleton */}
          <div className="border-border bg-card space-y-3 rounded-xl border p-4">
            <Skeleton className="h-3 w-24" />
            <div className="flex items-end justify-between pt-1">
              <Skeleton className="h-9 w-20" />
              <div className="flex items-end gap-1">
                {[16, 31, 23, 42, 27, 48].map((height, idx) => (
                  <Skeleton
                    key={idx}
                    className="w-1.5 rounded-sm"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Info Banner Skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}
