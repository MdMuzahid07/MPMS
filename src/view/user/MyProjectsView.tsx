/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ActiveTasksWidget,
  ProjectCard,
} from "@/components/features/user-dashboard/my-project-view";
import { useMyProjects } from "@/hooks/useMyProjects";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyProjectsPage() {
  const router = useRouter();
  const { projects, activeTasks } = useMyProjects();

  // Dynamically map platform icons in the view layer to keep domain models clean
  const projectsWithIcons = projects.map((p) => ({
    ...p,
    icon: <Terminal className="text-primary h-5 w-5" />,
  }));

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projectsWithIcons.map((project) => (
              <ProjectCard
                key={project._id || (project as any).id}
                project={project}
                onClick={(id) => router.push(`/my-projects/${id}`)}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <ActiveTasksWidget
            tasks={activeTasks}
            totalCount={activeTasks.length}
            onViewAll={() => router.push("/my-tasks")}
          />
        </div>
      </div>
    </div>
  );
}
