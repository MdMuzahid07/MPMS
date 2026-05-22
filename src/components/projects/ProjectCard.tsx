import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit2, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type Project = {
  id: string;
  title: string;
  client: string;
  status: "Active" | "On Hold" | "Completed" | "Planning";
  imageUrl: string;
  progress: {
    completed: number;
    total: number;
  };
  timeline: {
    start: string;
    end: string;
  };
  team: {
    id: string;
    initials: string;
    imageUrl?: string;
  }[];
};

interface ProjectCardProps {
  project: Project;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const percentage = Math.round(
    (project.progress.completed / project.progress.total) * 100,
  );
  const remainingTasks = Math.max(
    0,
    project.progress.total - project.progress.completed,
  );

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "On Hold":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "Planning":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusDotColor = (status: Project["status"]) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-emerald-500";
      case "On Hold":
        return "bg-amber-500";
      case "Planning":
        return "bg-blue-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="group border-border/50 bg-card text-card-foreground hover:border-border dark:bg-card/50 flex flex-col rounded-xl border shadow-sm transition-all hover:shadow-md">
      {/* Project Image Header */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="from-background/90 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className={`flex items-center gap-1.5 border-none font-medium ${getStatusColor(
              project.status,
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(
                project.status,
              )}`}
            />
            {project.status}
          </Badge>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
              {project.title}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
              Client: {project.client}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm leading-none font-semibold">{percentage}%</p>
            <p className="text-muted-foreground mt-1 text-[10px] font-medium">
              {remainingTasks === 0 ? "Delivered" : `${remainingTasks} left`}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span>
              {project.progress.completed}/{project.progress.total} Tasks
            </span>
          </div>
          <Progress
            value={percentage}
            className={`h-1.5 ${
              project.status === "Completed"
                ? "[&>div]:bg-emerald-500"
                : project.status === "On Hold"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-primary"
            }`}
          />
        </div>

        {/* Footer: Timeline & Team */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Timeline
            </span>
            <span className="text-foreground text-xs font-medium">
              {project.timeline.start} — {project.timeline.end}
            </span>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {project.team.slice(0, 2).map((member) => (
              <Avatar
                key={member.id}
                className="ring-background inline-block h-6 w-6 rounded-full ring-2"
              >
                <AvatarImage src={member.imageUrl} alt={member.initials} />
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 2 && (
              <div className="bg-muted ring-background flex h-6 w-6 items-center justify-center rounded-full ring-2">
                <span className="text-muted-foreground text-[9px] font-medium">
                  +{project.team.length - 2}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-border/50 mt-5 flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 hover:text-primary h-8 gap-1.5 px-2 text-xs font-semibold"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <ExternalLink className="h-3.5 w-3.5" />
              {project.status === "Completed" ? "Project Log" : "View Details"}
            </Link>
          </Button>
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-7 w-7"
            >
              <Link href={`/projects/${project.id}/edit`}>
                <Edit2 className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-7 w-7"
              onClick={() => onDelete?.(project)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
