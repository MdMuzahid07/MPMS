"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "./task.types";

const STATUS_STYLES: Record<TaskStatus, string> = {
  Progress:
    "border-indigo-500/20 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
  Review:
    "border-amber-500/20 bg-amber-500/12 text-amber-700 dark:text-amber-300",
  "To Do":
    "border-slate-500/20 bg-slate-500/12 text-slate-700 dark:text-slate-300",
  Done: "border-emerald-500/20 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-full border px-2 text-[10px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {status.toUpperCase()}
    </Badge>
  );
};
