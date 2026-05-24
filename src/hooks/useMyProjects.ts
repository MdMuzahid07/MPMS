"use client";

import { useState, useMemo } from "react";
import { mockData } from "@/data/mockData";

export function useMyProjects() {
  const projects = mockData.getProjects();
  const [searchQuery, setSearchQuery] = useState("");

  // Extract all active tasks from our mock data to show in the sidebar
  const activeTasks = useMemo(() => {
    // In our seeded mock database, tasks for "sprint-4" represent active tasks
    const sprint4Tasks = mockData.getTasksBySprint("sprint-4");
    // Filter active/in-progress tasks to display
    return sprint4Tasks
      .filter((t) => t.status !== "Done")
      .map((t) => ({
        id: t.id,
        title: t.title,
        project: "Quantum API Gateway", // Seed project name matching mocks
        priority: t.priority,
        dueDate:
          t.priority === "High"
            ? "Due in 4h"
            : t.priority === "Medium"
              ? "Due Tomorrow"
              : "Feb 24",
      }));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [projects, searchQuery]);

  return {
    projects: filteredProjects,
    totalProjectsCount: projects.length,
    activeTasks,
    searchQuery,
    setSearchQuery,
  };
}
