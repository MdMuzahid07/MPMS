"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TeamMemberStatus, TeamReportItem } from "./report.types";

const STATUS_BADGE_STYLES: Record<TeamMemberStatus, string> = {
  Peak: "border-emerald-500/25 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  Active:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  Delayed:
    "border-amber-500/25 bg-amber-500/12 text-amber-600 dark:text-amber-300",
};

interface TeamMemberRowProps {
  member: TeamReportItem;
}

export const TeamMemberRow = ({ member }: TeamMemberRowProps) => {
  const getProgressBarColor = (completion: number) => {
    return completion < 50 ? "bg-amber-500" : "bg-primary";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <tr className="border-border-b">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="border-border size-8 rounded-md border">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="rounded-md text-[10px]">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{member.name}</p>
            <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
              {member.role}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-1.5 w-34 rounded-full">
            <div
              className={cn(
                "h-1.5 rounded-full",
                getProgressBarColor(member.completion),
              )}
              style={{ width: `${member.completion}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold">
            {member.completion}%
          </span>
        </div>
      </td>
      <td className="px-3 py-3">
        <p className="text-sm font-semibold">
          {member.score}
          <span className="text-muted-foreground text-xs"> /5.0</span>
        </p>
      </td>
      <td className="px-3 py-3 text-right">
        <span
          className={cn(
            "inline-flex h-5 items-center justify-center rounded-sm px-1.5 text-[10px]",
            STATUS_BADGE_STYLES[member.status],
          )}
        >
          {member.status}
        </span>
      </td>
    </tr>
  );
};
