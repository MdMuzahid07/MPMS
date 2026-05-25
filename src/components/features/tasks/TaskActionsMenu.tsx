"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePenLine, Info, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import type { TaskItem } from "./task.types";

import { usePathname } from "next/navigation";

interface TaskActionsMenuProps {
  task: TaskItem;
  onDelete: (task: TaskItem) => void;
}

export const TaskActionsMenu = ({ task, onDelete }: TaskActionsMenuProps) => {
  const pathname = usePathname();
  const isUserPanel =
    pathname.includes("/my-projects") || pathname.includes("/my-tasks");

  const detailsUrl = isUserPanel
    ? `/my-projects/${task.projectId}/sprints/${task.sprintId}/tasks/${task.taskId}`
    : `/projects/${task.projectId}/sprints/${task.sprintId}/tasks/${task.taskId}`;
  const editUrl = `${detailsUrl}/edit`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <MoreVertical className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem asChild>
          <Link href={detailsUrl}>
            <Info className="size-3.5" />
            Details
          </Link>
        </DropdownMenuItem>
        {!isUserPanel && (
          <>
            <DropdownMenuItem asChild>
              <Link href={editUrl}>
                <FilePenLine className="size-3.5" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(task)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
