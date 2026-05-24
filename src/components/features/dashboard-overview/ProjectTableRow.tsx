"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectRow = {
  name: string;
  health: "Healthy" | "At Risk";
  progress: number;
};

const HEALTH_TONE_STYLES: Record<ProjectRow["health"], string> = {
  Healthy:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  "At Risk":
    "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20",
};

interface ProjectTableRowProps {
  project: ProjectRow;
}

export const ProjectTableRow = ({ project }: ProjectTableRowProps) => {
  const isAtRisk = project.health === "At Risk";

  return (
    <tr className="border-border border-b">
      <td className="px-3 py-3 text-sm font-medium">{project.name}</td>
      <td className="px-3 py-3">
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded-sm border px-1.5 text-[10px]",
            HEALTH_TONE_STYLES[project.health],
          )}
        >
          {project.health}
        </Badge>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="w-8 text-[11px] font-medium">
            {project.progress}%
          </span>
          <div className="bg-muted h-1.5 w-24 rounded-full">
            <div
              className={cn(
                "h-1.5 rounded-full",
                isAtRisk ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Open
        </Button>
      </td>
    </tr>
  );
};

export default ProjectTableRow;
