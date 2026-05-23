"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeamStatus } from "./team.types";

const STATUS_STYLES: Record<TeamStatus, string> = {
  Active:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Inactive:
    "border-border bg-muted text-muted-foreground dark:border-border dark:bg-muted/70 dark:text-muted-foreground",
};

interface StatusBadgeProps {
  status: TeamStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-0 text-[10px] font-medium",
        STATUS_STYLES[status],
      )}
    >
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
};
