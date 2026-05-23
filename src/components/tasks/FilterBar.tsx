"use client";

import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { FilterSelect } from "./FilterSelect";

interface FilterBarProps {
  projectFilter: string;
  sprintFilter: string;
  assigneeFilter: string;
  statusFilter: string;
  projectOptions: Array<{ value: string; label: string }>;
  assigneeOptions: Array<{ value: string; label: string }>;
  onProjectFilterChange: (value: string) => void;
  onSprintFilterChange: (value: string) => void;
  onAssigneeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCreateTaskClick?: () => void;
}

export const FilterBar = ({
  projectFilter,
  sprintFilter,
  assigneeFilter,
  statusFilter,
  projectOptions,
  assigneeOptions,
  onProjectFilterChange,
  onSprintFilterChange,
  onAssigneeFilterChange,
  onStatusFilterChange,
  onCreateTaskClick,
}: FilterBarProps) => {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          Filters:
        </span>
        <FilterSelect
          value={projectFilter}
          options={projectOptions}
          onValueChange={onProjectFilterChange}
        />
        <FilterSelect
          value={sprintFilter}
          options={[
            { value: "all-sprints", label: "All Sprints" },
            { value: "current-sprint", label: "Current Sprint" },
            { value: "backlog", label: "Backlog" },
          ]}
          onValueChange={onSprintFilterChange}
        />
        <FilterSelect
          value={assigneeFilter}
          options={assigneeOptions}
          onValueChange={onAssigneeFilterChange}
        />
        <FilterSelect
          value={statusFilter}
          options={[
            { value: "all-status", label: "Status: All" },
            { value: "progress", label: "Progress" },
            { value: "review", label: "Review" },
            { value: "to-do", label: "To Do" },
            { value: "done", label: "Done" },
          ]}
          onValueChange={onStatusFilterChange}
        />
        <Button
          variant="outline"
          className="h-8 rounded-md px-3 text-[11px] font-semibold"
        >
          <ChevronsUpDown className="mr-1 size-3.5" />
          More Filters
        </Button>
      </div>

      <Button asChild className="h-8 rounded-md px-3 text-[11px] font-semibold">
        <Link href="/tasks/new" onClick={onCreateTaskClick}>
          <Plus className="mr-1 size-3.5" />
          Create Task
        </Link>
      </Button>
    </section>
  );
};
