"use client";

import { useState, useMemo } from "react";
import { mockData } from "@/data/mockData";
import { Sprint, Task, TaskStatus } from "@/types/domain";

export function useMySprintDetails(projectId: string, sprintId: string) {
  const [sprint, setSprint] = useState<Sprint | undefined>(() =>
    projectId && sprintId
      ? mockData.getSprintById(projectId, sprintId)
      : undefined,
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    sprintId ? mockData.getTasksBySprint(sprintId) : [],
  );
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  // Sync state synchronously when props change
  const [prevSprintId, setPrevSprintId] = useState(sprintId);
  if (sprintId !== prevSprintId) {
    setPrevSprintId(sprintId);
    setSprint(mockData.getSprintById(projectId, sprintId));
    setTasks(mockData.getTasksBySprint(sprintId));
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const success = mockData.updateTaskStatus(sprintId, taskId, newStatus);
    if (success) {
      // Reload tasks from mock store to update state cleanly
      const updatedTasks = mockData.getTasksBySprint(sprintId);
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (priorityFilter === "All Priorities") return true;
      return t.priority === priorityFilter;
    });
  }, [tasks, priorityFilter]);

  // Dynamic user-friendly statistics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === "Done").length;
  const targetCapacity = 42; // Seed capacity points

  return {
    sprint,
    tasks: filteredTasks,
    totalTasksCount,
    completedTasksCount,
    targetCapacity,
    priorityFilter,
    setPriorityFilter,
    handleStatusChange,
  };
}
