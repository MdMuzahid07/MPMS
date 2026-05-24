"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AssigneeBadge } from "./AssigneeBadge";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import type { TaskItem } from "./task.types";
import { TaskActionsMenu } from "./TaskActionsMenu";

interface TaskRowProps {
  task: TaskItem;
  isSelected: boolean;
  onSelect: (taskId: string, checked: boolean | "indeterminate") => void;
  onDelete: (task: TaskItem) => void;
}

export const TaskRow = ({
  task,
  isSelected,
  onSelect,
  onDelete,
}: TaskRowProps) => {
  return (
    <tr className="border-border border-b">
      <td className="px-3 py-3.5">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(task.id, checked)}
        />
      </td>
      <td className="px-3 py-3.5">
        <p className="max-w-55 text-sm leading-snug font-semibold">
          {task.title}
        </p>
        <p className="text-muted-foreground mt-1 text-[10px] font-semibold">
          {task.code}
        </p>
      </td>
      <td className="px-3 py-3.5">
        <Badge variant="outline" className="rounded-md text-[10px]">
          {task.project}
        </Badge>
      </td>
      <td className="px-3 py-3.5">
        <span className="text-muted-foreground text-xs whitespace-pre-line">
          {task.sprint}
        </span>
      </td>
      <td className="px-3 py-3.5">
        <AssigneeBadge name={task.assignee} />
      </td>
      <td className="px-3 py-3.5">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-3 py-3.5">
        <StatusBadge status={task.status} />
      </td>
      <td className="text-muted-foreground px-3 py-3.5 text-xs whitespace-pre-line">
        {task.dueDate}
      </td>
      <td className="px-3 py-3.5">
        <TaskActionsMenu task={task} onDelete={onDelete} />
      </td>
    </tr>
  );
};
