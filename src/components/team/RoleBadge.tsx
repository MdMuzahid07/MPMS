"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeamRole } from "./team.types";

const ROLE_STYLES: Record<TeamRole, string> = {
  Admin:
    "border-primary/30 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground",
  Manager:
    "border-border bg-secondary text-secondary-foreground dark:border-border dark:bg-muted/70 dark:text-foreground",
  Member:
    "border-border bg-muted text-muted-foreground dark:border-border dark:bg-muted/60 dark:text-muted-foreground",
};

interface RoleBadgeProps {
  role: TeamRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-sm border px-2 py-0 text-[9px] font-bold tracking-[0.12em] uppercase",
        ROLE_STYLES[role],
      )}
    >
      {role}
    </Badge>
  );
};
