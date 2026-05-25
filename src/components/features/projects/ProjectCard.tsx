"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/types/domain.types";
import { format } from "date-fns";
import {
  CalendarDays,
  Edit2,
  ExternalLink,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectCardProps {
  project: Project;
  onDelete?: (project: Project) => void;
  stats?: { completedTasks: number; totalTasks: number };
}

export function ProjectCard({ project, onDelete, stats }: ProjectCardProps) {
  const completed = stats?.completedTasks ?? 0;
  const total = stats?.totalTasks ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remainingTasks = Math.max(0, total - completed);

  const getStatusStyle = (status: Project["status"]) => {
    switch (status) {
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

  const getStatusDot = (status: Project["status"]) => {
    switch (status) {
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

  const defaultImage =
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop";

  return (
    <article className="group border-border/60 bg-card hover:border-primary/30 flex min-h-[380px] flex-col overflow-hidden rounded-xl border transition-all duration-300">
      {/* Top Section: Hero Cover Image (Sharp & Pure) */}
      <div className="border-border/40 relative h-32 w-full shrink-0 overflow-hidden border-b">
        <Image
          src={project.thumbnail || defaultImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />

        {/* Status Badge Over Image (Clean & Glassy) */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md ${getStatusStyle(
              project.status,
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                project.status,
              )}`}
            />
            {project.status}
          </Badge>
        </div>

        {/* Dropdown Menu Over Image */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg border-none bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/projects/${project._id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/projects/${project._id}/edit`}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={() => onDelete?.(project)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Section: Solid Details Area */}
      <div className="bg-card flex flex-1 flex-col p-5">
        {/* Title & Client */}
        <div>
          <Link
            href={`/projects/${project._id}`}
            className="decoration-primary/30 block underline-offset-4 group-hover:underline"
          >
            <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-muted-foreground mt-1 text-xs font-semibold tracking-wider uppercase">
            {project.client}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="border-border/40 bg-muted/20 mt-5 grid grid-cols-3 gap-2 rounded-lg border p-2.5">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
              Tasks
            </span>
            <span className="text-foreground mt-0.5 text-xs font-semibold">
              {total}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
              Completed
            </span>
            <span className="text-foreground mt-0.5 text-xs font-semibold">
              {completed}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
              Remaining
            </span>
            <span className="text-foreground mt-0.5 text-xs font-semibold">
              {remainingTasks}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{percentage}%</span>
          </div>
          <Progress
            value={percentage}
            className={`bg-muted/50 border-border/20 h-1.5 border ${
              project.status === "completed"
                ? "[&>div]:bg-emerald-500"
                : project.status === "archived"
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-primary"
            }`}
          />
        </div>

        <div className="min-h-[16px] flex-1" />

        {/* Footer: Timeline & Team */}
        <div className="border-border/40 mt-auto flex items-end justify-between border-t pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
              Timeline
            </span>
            <div className="text-foreground/80 flex items-center gap-1.5 text-xs font-semibold">
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
              <span className="text-muted-foreground text-[11px] font-medium italic">
                No team
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
