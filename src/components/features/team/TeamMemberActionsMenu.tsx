"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  FilePenLine,
  Info,
  ShieldBan,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { TeamMember } from "./team.types";

interface TeamMemberActionsMenuProps {
  member: TeamMember;
  onSuspendToggle: (member: TeamMember) => void;
  onDeleteClick?: (member: TeamMember) => void;
}

export const TeamMemberActionsMenu = ({
  member,
  onSuspendToggle,
  onDeleteClick,
}: TeamMemberActionsMenuProps) => {
  const detailsUrl = `/team/${member.id}`;
  const editUrl = `/team/${member.id}/edit`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem asChild>
          <Link href={detailsUrl}>
            <Info className="size-3.5" />
            Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={editUrl}>
            <FilePenLine className="size-3.5" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSuspendToggle(member)}>
          <ShieldBan className="size-3.5" />
          {member.status === "Active" ? "Suspend" : "Activate"}
        </DropdownMenuItem>
        {onDeleteClick && (
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDeleteClick(member)}
          >
            <Trash2 className="size-3.5" />
            Delete Member
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
