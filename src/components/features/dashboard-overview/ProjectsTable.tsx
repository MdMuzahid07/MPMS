"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectTableRow from "./ProjectTableRow";

export type ProjectRow = {
  _id?: string;
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
    <div className="border-border bg-card/45 w-full space-y-5 overflow-hidden rounded-2xl border p-5 backdrop-blur-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Recent Strategic Projects
          </h2>
          <Badge
            variant="outline"
            className="h-5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400"
          >
            LIVE
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl text-xs font-semibold transition-all"
          onClick={onViewAll}
        >
          View all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse">
          <thead className="bg-muted/10">
            <tr className="border-border/60 border-y">
              <th className="text-muted-foreground px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase">
                Project Name
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase">
                Health
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase">
                Progress
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center text-sm italic"
                >
                  No active projects found.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <ProjectTableRow
                  key={project._id || project.name}
                  project={project}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
