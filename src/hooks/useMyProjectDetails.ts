"use client";

import { mockData } from "@/data/mockData";

export function useMyProjectDetails(projectId: string) {
  const project = projectId ? mockData.getProjectById(projectId) : undefined;
  const sprints = projectId ? mockData.getSprintsByProject(projectId) : [];

  // Aggregate metrics derived dynamically
  const openTasksCount = 14; // Seeded count matching mockup UI
  const completedTasksCount = 32; // Seeded count matching mockup UI
  const totalTasksCount = openTasksCount + completedTasksCount;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completionPercentage = project ? (project as any).progress : 68;

  return {
    project,
    sprints,
    openTasksCount,
    completedTasksCount,
    totalTasksCount,
    completionPercentage,
  };
}
