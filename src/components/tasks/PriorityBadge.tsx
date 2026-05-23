"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "./task.types";

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  High: "border-rose-500/20 bg-rose-500/12 text-rose-600 dark:text-rose-300",
  Medium:
    "border-amber-500/20 bg-amber-500/12 text-amber-600 dark:text-amber-300",
  Low: "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-full border px-2 text-[10px] font-semibold",
        PRIORITY_STYLES[priority],
      )}
    >
      <span className="mr-1 size-1.5 rounded-full bg-current" />
      {priority.toUpperCase()}
    </Badge>
  );
};
