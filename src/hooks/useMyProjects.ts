"use client";

import { handleApiError } from "@/lib/handleApiError";
import { useGetProjectsQuery } from "@/redux/feature/projects/projectsApi";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

export const useMyProjects = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data, isLoading, isFetching, error } = useGetProjectsQuery(
    { userId: userId! },
    { skip: !userId },
  );

  useEffect(() => {
    if (error) {
      handleApiError(error);
    }
  }, [error]);

  return {
    projects: data ?? [],
    activeTasks: [], // Temporarily mocked until tasks API is implemented
    isLoading: isLoading || isFetching,
    isEmpty: !isLoading && (!data || data.length === 0),
    error,
  };
};
