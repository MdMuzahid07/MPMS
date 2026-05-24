"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";
import type { TeamMember } from "./team.types";
import { TeamMemberActionsMenu } from "./TeamMemberActionsMenu";

interface TeamMemberRowProps {
  member: TeamMember;
  onSuspendToggle: (member: TeamMember) => void;
  onDeleteClick?: (member: TeamMember) => void;
}

export const TeamMemberRow = ({
  member,
  onSuspendToggle,
  onDeleteClick,
}: TeamMemberRowProps) => {
  const isInactive = member.status === "Inactive";

  return (
    <tr className="border-border hover:bg-muted/25 border-b transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar
            size="lg"
            className={cn("border", isInactive && "opacity-70 grayscale")}
          >
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground text-[13px] font-medium">
              {member.name}
            </p>
            <p className="text-muted-foreground text-[11px]">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <RoleBadge role={member.role} />
      </td>
      <td className="text-muted-foreground px-5 py-3.5 text-[13px]">
        {member.department}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="rounded-sm border px-2 py-0 text-[9px] font-medium"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-5 py-3.5 text-right">
        <StatusBadge status={member.status} />
      </td>
      <td className="px-5 py-3.5 text-right">
        <TeamMemberActionsMenu
          member={member}
          onSuspendToggle={onSuspendToggle}
          onDeleteClick={onDeleteClick}
        />
      </td>
    </tr>
  );
};
