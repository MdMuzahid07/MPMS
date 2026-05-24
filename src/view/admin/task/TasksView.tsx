"use client";

import React from "react";
import { TaskCanvas } from "@/components/features/tasks";
import type { TaskItem } from "@/components/features/tasks/task.types";

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Implement OAuth2 Authentication Flow",
    code: "TASK-1024",
    project: "Vortex UI",
    sprint: "Sprint 3",
    assignee: "Alex R.",
    priority: "High",
    status: "Progress",
    dueDate: "Oct 24, 2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1024",
  },
  {
    id: "2",
    title: "API Endpoint Optimization for Analytics",
    code: "TASK-1025",
    project: "Pulse Analytics",
    sprint: "Sprint 3",
    assignee: "Sarah K.",
    priority: "Medium",
    status: "Review",
    dueDate: "Oct 26, 2023",
    projectId: "nc-4902",
    sprintId: "sprint-09",
    taskId: "task-1025",
  },
  {
    id: "3",
    title: "Refactor Legacy Shaders",
    code: "TASK-0992",
    project: "Aether Engine",
    sprint: "Backlog",
    assignee: "Unassigned",
    priority: "Low",
    status: "To Do",
    dueDate: "Nov 12, 2023",
    projectId: "nc-4902",
    sprintId: "sprint-backlog",
    taskId: "task-0992",
  },
  {
    id: "4",
    title: "Documentation for SDK v2.4",
    code: "TASK-1102",
    project: "Vortex UI",
    sprint: "Sprint 3",
    assignee: "Marcus T.",
    priority: "Medium",
    status: "Done",
    dueDate: "Oct 20, 2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1102",
  },
];

interface TasksViewProps {
  initialTasksData?: TaskItem[];
}

export const TasksView = ({
  initialTasksData = INITIAL_TASKS,
}: TasksViewProps) => {
  return (
    <div className="w-full pb-8">
      <TaskCanvas
        initialTasks={initialTasksData}
        title="Tasks / All Items"
        subtitle="Manage, search, group, and coordinate tasks across your organization's projects."
      />
    </div>
  );
};

export default TasksView;
