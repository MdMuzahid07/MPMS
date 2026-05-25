"use client";

import { handleApiError } from "@/lib/handleApiError";
import { useGetProjectsQuery } from "@/redux/feature/projects/projectsApi";
import { useGetAllTasksQuery } from "@/redux/feature/tasks/tasksApi";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo } from "react";

export const useMyProjects = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data, isLoading, isFetching, error } = useGetProjectsQuery(
    { userId: userId! },
    { skip: !userId },
  );

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    error: tasksError,
  } = useGetAllTasksQuery({ assignee: userId! }, { skip: !userId });

  useEffect(() => {
    if (error) {
      handleApiError(error);
    }
    if (tasksError) {
      handleApiError(tasksError);
    }
  }, [error, tasksError]);

  const activeTasks = useMemo(() => {
    if (!tasksData?.tasks) return [];
    return tasksData.tasks
      .filter((t) => t.status !== "DONE")
      .map((t) => ({
        id: t._id,
        title: t.title,
        project: "My Workspace", // Or map to actual project title if populated
        priority: t.priority,
        dueDate: t.dueDate ?? "No due date",
      }));
  }, [tasksData]);

  return {
    projects: data ?? [],
    activeTasks,
    isLoading: isLoading || isFetching || tasksLoading || tasksFetching,
    isEmpty: !isLoading && (!data || data.length === 0),
    error: error || tasksError,
  };
};
