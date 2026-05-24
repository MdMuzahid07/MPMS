"use client";

import { cn } from "@/lib/utils";
import { Project } from "@/types/domain";

const getStatusStyles = (status: Project["status"]) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    case "At Risk":
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    default:
      return "bg-primary/10 border-primary/20 text-primary";
  }
};

interface ProjectCardProps {
  project: Omit<Project, "icon"> & { icon?: React.ReactNode };
  onClick?: (projectId: string) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <div
      onClick={() => onClick?.(project.id)}
      className="bg-card border-border hover:border-primary/40 group flex cursor-pointer flex-col justify-between rounded-lg border p-6 shadow-xs transition-all duration-200"
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              {project.client}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase",
              getStatusStyles(project.status),
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
            <span>{project.status}</span>
          </div>
        </div>
        <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-semibold transition-colors">
          {project.name}
        </h3>
        <p className="text-muted-foreground mt-2 mb-6 line-clamp-2 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        <div className="text-muted-foreground flex justify-between text-xs font-medium">
          <span>Progress</span>
          <span className="text-foreground">{project.progress}%</span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full",
              project.progressColor || "bg-primary",
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
