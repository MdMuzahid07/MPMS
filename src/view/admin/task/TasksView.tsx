"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TaskCanvas } from "@/components/features/tasks";
import type {
  TaskItem,
  TaskStatus,
  TaskPriority,
} from "@/components/features/tasks/task.types";
import { useGetAllTasksQuery } from "@/redux/feature/tasks/tasksApi";
import { ShieldAlert } from "lucide-react";
import TasksViewSkeleton from "@/skeleton/tasks/TasksViewSkeleton";

import { InfoBanner } from "@/components/shared/InfoBanner";

// Map backend status to TaskCanvas frontend type
const mapStatusToFrontend = (status: string): TaskStatus => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "Progress";
    case "REVIEW":
      return "Review";
    case "DONE":
      return "Done";
    default:
      return "To Do";
  }
};

// Map backend priority to TaskCanvas frontend type
const mapPriorityToFrontend = (priority: string): TaskPriority => {
  switch (priority) {
    case "HIGH":
    case "CRITICAL":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return "Medium";
  }
};

export const TasksView = () => {
  const { data, isLoading, error } = useGetAllTasksQuery({ limit: 100 });

  if (isLoading) {
    return <TasksViewSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="border-border bg-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl border-dashed p-12 text-center">
        <ShieldAlert className="text-destructive mb-4 size-12" />
        <h2 className="text-foreground mb-2 text-xl font-bold">
          Failed to Load Tasks
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          There was an error retrieving tasks from the server. Please try
          refreshing.
        </p>
      </div>
    );
  }

  const rawTasks = data.tasks || [];

  // Map real database tasks into the TaskCanvas format
  const mappedTasks: TaskItem[] = rawTasks.map((task: any) => ({
    id: task._id,
    title: task.title,
    code: `TK-${task._id.slice(-4).toUpperCase()}`,
    project: task.project?.title || "Core Platform",
    sprint: task.sprint?.title || "Backlog",
    assignee: task.assignees?.[0]?.name || "Unassigned",
    priority: mapPriorityToFrontend(task.priority),
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No due date",
    projectId: task.project?._id || task.project || "",
    sprintId: task.sprint?._id || task.sprint || "",
    taskId: task._id,
    isTimerRunning: task.isTimerRunning,
    timerStartedAt: task.timerStartedAt,
    timeSpend: task.timeSpend,
    isTimerStopped: task.isTimerStopped,
  }));

  return (
    <div className="w-full pb-8">
      <TaskCanvas
        initialTasks={mappedTasks}
        title="Tasks / All Items"
        subtitle="Manage, search, group, and coordinate tasks across your organization's projects."
      />
      <InfoBanner message="This page displays a centralized view of all tasks across projects. Use it to track status, identify blockers, and reassign priorities." />
    </div>
  );
};

export default TasksView;
