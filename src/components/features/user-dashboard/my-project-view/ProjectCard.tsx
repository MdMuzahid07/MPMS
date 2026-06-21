"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/domain.types";

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";
    case "completed":
      return "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "planned":
      return "border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "archived":
      return "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    default:
      return "border-muted bg-muted/50 text-muted-foreground";
  }
};

const getStatusDot = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-indigo-500";
    case "completed":
      return "bg-emerald-500";
    case "planned":
      return "bg-blue-500";
    case "archived":
      return "bg-amber-500";
    default:
      return "bg-muted-foreground";
  }
};

interface ProjectCardProps {
  project: Omit<Project, "icon"> & {
    icon?: React.ReactNode;
    id?: string;
    name?: string;
    progress?: number;
    progressColor?: string;
  };
  onClick?: (projectId: string) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const projectId = project._id || project.id || "";
  const projectTitle = project.title || project.name || "";
  const progress = project.progress !== undefined ? project.progress : 0;
  const status = project.status || "planned";

  return (
    <article
      onClick={() => onClick?.(projectId)}
      className="group border-border/60 bg-card hover:border-primary/30 relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Top Status Accent Bar */}
      <div
        className={cn(
          "absolute top-0 right-0 left-0 h-1 transition-colors duration-300",
          status.toLowerCase() === "completed"
            ? "bg-emerald-500"
            : status.toLowerCase() === "archived"
              ? "bg-amber-500"
              : status.toLowerCase() === "active"
                ? "bg-indigo-500"
                : "bg-blue-500",
        )}
      />

      <div className="space-y-4">
        {/* Header: Client & Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            {project.client}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase transition-all duration-200",
              getStatusStyle(status),
            )}
          >
            <span
              className={cn("h-1 w-1 rounded-full", getStatusDot(status))}
            />
            {project.status}
          </Badge>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-foreground group-hover:text-primary text-base font-bold tracking-tight transition-colors">
            {projectTitle}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed font-light">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className={cn(
              "bg-muted/50 border-border/20 h-1.5 border",
              status.toLowerCase() === "completed"
                ? "[&>div]:bg-emerald-500"
                : status.toLowerCase() === "archived"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-primary",
            )}
          />
        </div>
      </div>

      {/* Divider line */}
      <div className="border-border/30 my-4 border-t" />

      {/* Footer: Timeline & Team */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
            Timeline
          </span>
          <div className="text-foreground/80 flex items-center gap-1.5 text-[11px] font-semibold">
            <CalendarDays className="text-primary h-3.5 w-3.5 shrink-0 opacity-80" />
            <span>
              {project.startDate
                ? format(new Date(project.startDate), "MMM dd")
                : "TBD"}{" "}
              —{" "}
              {project.endDate
                ? format(new Date(project.endDate), "MMM dd")
                : "TBD"}
            </span>
          </div>
        </div>

        {/* Members stacked avatars */}
        <div className="flex -space-x-1.5 overflow-hidden p-0.5">
          {project.members?.slice(0, 3).map((member) => {
            const initials = member.name.substring(0, 2).toUpperCase();
            return (
              <Avatar
                key={member._id}
                className="ring-background border-border/50 inline-block h-6 w-6 rounded-full border ring-2"
              >
                <AvatarImage src={member.avatar} alt={initials} />
                <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            );
          })}
          {(project.members?.length ?? 0) > 3 && (
            <div className="bg-muted border-border/50 ring-background flex h-6 w-6 items-center justify-center rounded-full border ring-2">
              <span className="text-foreground/70 text-[9px] font-extrabold">
                +{(project.members?.length ?? 0) - 3}
              </span>
            </div>
          )}
          {(!project.members || project.members.length === 0) && (
            <span className="text-muted-foreground text-[10px] font-medium italic">
              No team
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
