"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ProjectRow = {
  _id?: string;
  name: string;
  health: "Healthy" | "At Risk";
  progress: number;
};

const HEALTH_TONE_STYLES: Record<ProjectRow["health"], string> = {
  Healthy:
    "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "At Risk":
    "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

interface ProjectTableRowProps {
  project: ProjectRow;
}

export const ProjectTableRow = ({ project }: ProjectTableRowProps) => {
  const router = useRouter();
  const isAtRisk = project.health === "At Risk";

  const handleOpenProject = () => {
    if (project._id) {
      router.push(`/projects/${project._id}`);
    }
  };

  return (
    <tr className="border-border/40 hover:bg-muted/10 border-b transition-colors duration-150">
      <td className="text-foreground px-4 py-3.5 text-sm font-bold">
        {project.name}
      </td>
      <td className="px-4 py-3.5">
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded-full border px-2 text-[9px] font-extrabold tracking-wide uppercase",
            HEALTH_TONE_STYLES[project.health],
          )}
        >
          {project.health}
        </Badge>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-foreground w-8 text-[11px] font-bold">
            {project.progress}%
          </span>
          <div className="bg-muted border-border/20 h-2 w-24 shrink-0 overflow-hidden rounded-full border">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isAtRisk ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <Button
          onClick={handleOpenProject}
          disabled={!project._id}
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 rounded-lg px-3 text-xs font-semibold transition-all"
        >
          Open
        </Button>
      </td>
    </tr>
  );
};

export default ProjectTableRow;
