"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetProjectByIdQuery,
  useGetProjectStatsQuery,
} from "@/redux/feature/projects/projectsApi";
import { useGetSprintsQuery } from "@/redux/feature/sprints/sprintsApi";
import type { Sprint, SprintStatus } from "@/types/domain.types";
import { format } from "date-fns";
import {
  CalendarDays,
  CircleDashed,
  FilePenLine,
  Loader2,
  Plus,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

function statusBadgeStyle(status: SprintStatus) {
  if (status === "completed") {
    return "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "active") {
    return "border-indigo-500/25 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300";
  }

  return "border-slate-400/25 bg-slate-500/12 text-slate-700 dark:text-slate-300";
}

function SprintItemCard({
  projectId,
  sprint,
}: {
  projectId: string;
  sprint: Sprint;
}) {
  const progressClass =
    sprint.status === "completed" ? "bg-emerald-500" : "bg-primary";

  const dateRange =
    sprint.startDate && sprint.endDate
      ? `${format(new Date(sprint.startDate), "MMM d")} — ${format(new Date(sprint.endDate), "MMM d, yyyy")}`
      : "Dates TBD";

  const progress =
    sprint.status === "completed" ? 100 : sprint.status === "active" ? 50 : 0;

  return (
    <article className="bg-card/45 border-border hover:bg-card/90 rounded-2xl border p-5 backdrop-blur-xs transition-all duration-200">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">
            Sprint #{sprint.sprintNumber}
          </p>
          <h3 className="text-foreground mt-1 text-lg leading-tight font-bold tracking-tight">
            {sprint.title}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${statusBadgeStyle(
            sprint.status,
          )}`}
        >
          <CircleDashed className="mr-1 size-3 shrink-0" />
          {sprint.status}
        </Badge>
      </div>

      <div className="text-muted-foreground mb-5 flex items-center gap-1.5 text-xs font-medium">
        <CalendarDays className="text-primary size-3.5 shrink-0" />
        <span>{dateRange}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground">{progress}%</span>
        </div>
        <div className="bg-muted border-border/20 h-2 w-full overflow-hidden rounded-full border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button
          asChild
          variant="outline"
          className="border-border hover:bg-muted h-8.5 rounded-xl text-xs font-semibold transition-colors"
        >
          <Link href={`/projects/${projectId}/sprints/${sprint._id}`}>
            View Details
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary h-8.5 rounded-xl text-xs font-semibold transition-colors"
        >
          <Link href={`/projects/${projectId}/sprints/${sprint._id}/edit`}>
            <FilePenLine className="mr-1.5 size-3.5" />
            Edit
          </Link>
        </Button>
      </div>
    </article>
  );
}

type ProjectDetailPageProps = {
  id: string;
};

export default function ProjectDetailsView({
  id: projectId,
}: ProjectDetailPageProps) {
  const { data: project, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(projectId);
  const { data: stats, isLoading: isStatsLoading } =
    useGetProjectStatsQuery(projectId);
  const { data: sprintDataRaw, isLoading: isSprintsLoading } =
    useGetSprintsQuery(projectId);

  const sprints = Array.isArray(sprintDataRaw)
    ? sprintDataRaw
    : (sprintDataRaw as any)?.data || [];

  if (isProjectLoading || isStatsLoading || isSprintsLoading || !project) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const projectIdShort = project._id.slice(-6).toUpperCase();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative container mx-auto w-full space-y-8 px-4 pb-8 duration-500">
      {/* Top dashboard summary header */}
      <section className="bg-card/40 border-border rounded-2xl border p-6 backdrop-blur-xs md:p-8 dark:bg-[linear-gradient(110deg,var(--color-card)_40%,rgba(82,100,255,0.06)_100%)]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge className="rounded-full border-0 bg-emerald-500/16 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
            {project.status}
          </Badge>
          <span className="text-muted-foreground bg-secondary/80 border-border/40 rounded-md border px-2 py-0.5 text-xs font-semibold">
            ID: {projectIdShort}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              {project.description ||
                "Manage sprints, allocate team resources, and track progress metrics for this workspace."}
            </p>
          </div>

          <div className="flex items-end">
            <div className="w-full space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Overall Completion
                  </p>
                  <p className="text-foreground mt-0.5 text-2xl font-extrabold">
                    {stats?.percentComplete ?? 0}%
                  </p>
                </div>
                <p className="text-muted-foreground bg-secondary/80 border-border/40 rounded-md border px-2 py-1 text-xs font-bold">
                  Tasks: {stats?.completedTasks ?? 0} / {stats?.totalTasks ?? 0}
                </p>
              </div>
              <div className="bg-muted border-border/20 h-2.5 w-full overflow-hidden rounded-full border">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats?.percentComplete ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Sprint cycles list */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border/60 flex items-center justify-between border-b pb-3">
            <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
              <TrendingUp className="text-primary h-5 w-5" />
              Sprint Cycles
            </h2>
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground rounded-xl px-4 font-semibold transition-all hover:brightness-105"
            >
              <Link href={`/projects/${projectId}/sprints/new`}>
                <Plus className="mr-1.5 size-4" />
                New Sprint
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sprints.length === 0 ? (
              <div className="border-border/60 bg-card/20 text-muted-foreground col-span-full flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed text-center">
                <CircleDashed className="mb-2.5 size-7 animate-spin opacity-30" />
                <p className="text-sm font-semibold">
                  No active sprints planned yet
                </p>
                <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
                  Start mapping deliverables by planning and initializing a new
                  sprint cycle.
                </p>
              </div>
            ) : (
              sprints.map((sprint: Sprint) => (
                <SprintItemCard
                  key={sprint._id}
                  projectId={projectId}
                  sprint={sprint}
                />
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Quick metrics card */}
        <div className="space-y-8">
          {/* Quick Metrics Card */}
          <article className="bg-card/40 border-border space-y-5 rounded-2xl border p-6 backdrop-blur-xs">
            <h3 className="text-muted-foreground border-border/60 flex items-center gap-2 border-b pb-3 text-xs font-bold tracking-widest uppercase">
              <Briefcase className="text-primary h-4 w-4 shrink-0" />
              Project Summary
            </h3>

            <div className="space-y-4">
              <div className="border-border/20 flex items-center justify-between border-b py-1 text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-semibold">
                  <DollarSign className="text-primary h-4 w-4 shrink-0" />
                  Budget Allocation
                </span>
                <span className="text-foreground bg-secondary/60 border-border/40 rounded-md border px-2.5 py-1 font-extrabold">
                  $
                  {project.budget
                    ? project.budget.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-semibold">
                  <Calendar className="text-primary h-4 w-4 shrink-0" />
                  Target Date
                </span>
                <span className="text-foreground bg-secondary/60 border-border/40 rounded-md border px-2.5 py-1 font-extrabold">
                  {project.endDate
                    ? format(new Date(project.endDate), "MMM yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
