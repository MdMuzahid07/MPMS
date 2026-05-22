"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectTableRow from "./ProjectTableRow";

type ProjectRow = {
  name: string;
  health: "Healthy" | "At Risk";
  progress: number;
};

interface ProjectsTableProps {
  projects: ProjectRow[];
  onViewAll?: () => void;
}

export const ProjectsTable = ({ projects, onViewAll }: ProjectsTableProps) => {
  return (
    <div className="border-border bg-card space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Strategic Projects
          </h2>
          <Badge
            variant="outline"
            className="h-5 rounded-sm px-1.5 text-[10px]"
          >
            LIVE
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={onViewAll}
        >
          View all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse">
          <thead className="bg-muted/20">
            <tr className="border-border border-y">
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Project Name
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Health
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Progress
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectTableRow key={project.name} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
