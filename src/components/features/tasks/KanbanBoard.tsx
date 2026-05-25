"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import React, { useState } from "react";
import { AssigneeBadge } from "./AssigneeBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { TaskItem, TaskStatus } from "./task.types";
import { TaskActionsMenu } from "./TaskActionsMenu";

interface KanbanBoardProps {
  tasks: TaskItem[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
}

const COLUMNS: {
  label: string;
  status: TaskStatus;
  tone: string;
  dotColor: string;
}[] = [
  {
    label: "TO DO",
    status: "To Do",
    tone: "text-slate-400 border-slate-500/20 bg-slate-500/5",
    dotColor: "bg-slate-400",
  },
  {
    label: "IN PROGRESS",
    status: "Progress",
    tone: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    dotColor: "bg-indigo-400",
  },
  {
    label: "REVIEW",
    status: "Review",
    tone: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    dotColor: "bg-amber-400",
  },
  {
    label: "DONE",
    status: "Done",
    tone: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    dotColor: "bg-emerald-400",
  },
];

export const KanbanBoard = ({
  tasks,
  onStatusChange,
  onSelectTask,
  onDeleteTask,
}: KanbanBoardProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (activeColumn !== status) {
      setActiveColumn(status);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (taskId) {
      onStatusChange(taskId, targetStatus);
    }
    setActiveColumn(null);
    setDraggedTaskId(null);
  };

  // Group tasks by status
  const groupedTasks = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = tasks.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TaskStatus, TaskItem[]>,
  );

  return (
    <div className="grid min-w-225 grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-4 lg:gap-6">
      {COLUMNS.map((col) => {
        const columnTasks = groupedTasks[col.status] || [];
        const isOver = activeColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={() => setActiveColumn(null)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={cn(
              "border-border/40 bg-muted/40 flex min-h-125 flex-col rounded-xl border p-3 transition-all duration-200",
              isOver
                ? "border-primary/40 bg-primary/2 ring-primary/20 scale-[0.99] ring-1"
                : "",
              col.tone,
            )}
          >
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", col.dotColor)} />
                <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                  {col.label}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground hover:bg-muted flex size-5 items-center justify-center rounded-full p-0 text-[10px] font-bold dark:bg-[#1b1b23] dark:hover:bg-[#1b1b23]"
                >
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            {/* Column Task Cards */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="border-border/30 text-muted-foreground/60 flex min-h-50 flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center text-xs">
                  Drop tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group border-border bg-card hover:bg-muted/40 flex cursor-grab flex-col border p-4 transition-all duration-200 active:cursor-grabbing dark:bg-[#1b1b23]/90 dark:hover:bg-[#1b1b23]",
                      draggedTaskId === task.id ? "opacity-40" : "",
                    )}
                  >
                    {/* Project & Priority Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-muted-foreground max-w-30 truncate text-[10px] font-semibold tracking-wider uppercase">
                        {task.project}
                      </span>
                      <div className="flex items-center gap-1">
                        <PriorityBadge priority={task.priority} />
                        <TaskActionsMenu task={task} onDelete={onDeleteTask} />
                      </div>
                    </div>

                    {/* Task Title */}
                    <h4
                      onClick={() => onSelectTask(task)}
                      className="text-foreground hover:text-primary mb-3 line-clamp-2 cursor-pointer text-sm leading-snug font-semibold transition-colors"
                    >
                      {task.title}
                    </h4>

                    {/* Meta Row: Assignee, Estimate, Details Trigger */}
                    <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-3">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <AssigneeBadge name={task.assignee} />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Estimate & Due Date badges */}
                        <div className="text-muted-foreground flex flex-col items-end text-[10px]">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {task.dueDate.replace("\n", " ").trim()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
