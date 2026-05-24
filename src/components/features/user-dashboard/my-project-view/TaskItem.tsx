"use client";

import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types/domain.types";

export interface DashboardTask {
  id: string;
  title: string;
  project: string;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskItemProps {
  task: DashboardTask;
  onClick?: (taskId: string) => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "text-destructive",
  urgent: "text-destructive font-black",
  medium: "text-amber-500",
  low: "text-muted-foreground",
  High: "text-destructive",
  Urgent: "text-destructive font-black",
  Medium: "text-amber-500",
  Low: "text-muted-foreground",
};

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  const priorityKey = task.priority || "low";
  return (
    <div
      onClick={() => onClick?.(task.id)}
      className={cn(
        "border-border bg-surface hover:bg-surface-container-low group cursor-pointer rounded-lg border p-3 transition-colors",
        priorityKey.toLowerCase() === "low" && "opacity-60 hover:opacity-100",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="border-primary/40 group-hover:border-primary mt-1 h-4 w-4 rounded border transition-colors" />
        <div>
          <p className="text-body-md text-on-surface font-medium">
            {task.title}
          </p>
          <p className="text-label-md text-on-surface-variant mt-0.5">
            {task.project}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-bold tracking-tighter uppercase",
                PRIORITY_COLOR[task.priority],
              )}
            >
              {task.priority} Priority
            </span>
            <span className="text-on-surface-variant text-[10px]">•</span>
            <span className="text-on-surface-variant text-[10px] font-medium">
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
