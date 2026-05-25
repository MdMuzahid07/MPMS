"use client";

import { ProgressTrendChart } from "./ProgressTrendChart";

interface SprintProgressSectionProps {
  onDownloadReport?: () => void;
}

export const SprintProgressSection = ({}: SprintProgressSectionProps) => {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sprint Progress Trend
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Team work pace across the last 4 sprint cycles
          </p>
        </div>
        <div className="text-muted-foreground hidden items-center gap-4 text-[11px] font-medium sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-2 rounded-full bg-indigo-300" />
            Actual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="border-muted-foreground inline-flex size-2 rounded-full border" />
            Target
          </span>
        </div>
      </div>
      <ProgressTrendChart />
    </div>
  );
};
