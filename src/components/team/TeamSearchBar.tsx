"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import Link from "next/link";

interface TeamSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddMemberClick?: () => void;
}

export const TeamSearchBar = ({
  searchValue,
  onSearchChange,
  onAddMemberClick,
}: TeamSearchBarProps) => {
  return (
    <div className="flex w-full items-center gap-3 sm:w-auto">
      <div className="relative w-full sm:w-72">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search members, roles or skills..."
          className="h-9 pl-8 text-xs"
        />
      </div>
      <Button
        asChild
        className="h-9 shrink-0 rounded-md px-3 text-xs font-semibold"
      >
        <Link href="/team/new" onClick={onAddMemberClick}>
          <UserPlus className="mr-1.5 size-3.5" />
          Add Member
        </Link>
      </Button>
    </div>
  );
};
