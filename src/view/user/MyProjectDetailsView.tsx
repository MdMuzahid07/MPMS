"use client";

import { Bolt, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetProjectByIdQuery,
  useGetProjectStatsQuery,
} from "@/redux/feature/projects/projectsApi";
import { useGetSprintsQuery } from "@/redux/feature/sprints/sprintsApi";
import { format } from "date-fns";

interface SprintItem {
  id: string;
  title: string;
  dateRange: string;
  status: "Active" | "Completed" | "Upcoming";
  progress: number;
  team: string[];
}

export default function MyProjectDetailsView() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) ?? "1";

  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(
    projectId,
    { skip: !projectId },
  );
  const { data: sprintsData, isLoading: sprintsLoading } = useGetSprintsQuery(
    projectId,
    { skip: !projectId },
  );
  const { data: stats, isLoading: statsLoading } = useGetProjectStatsQuery(
    projectId,
    { skip: !projectId },
  );

  // Client state to safely handle micro-interaction on hydration mount
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (stats) {
      const timer = setTimeout(
        () => setProgressWidth(stats.percentComplete),
        200,
      );
      return () => clearTimeout(timer);
    }
  }, [stats]);

  if (projectLoading || sprintsLoading || statsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const sprints: SprintItem[] = (sprintsData || []).map((s) => {
    let uiStatus: SprintItem["status"] = "Upcoming";
    if (s.status === "active") uiStatus = "Active";
    if (s.status === "completed") uiStatus = "Completed";

    return {
      id: s._id,
      title: s.title,
      dateRange: `${format(new Date(s.startDate), "MMM d")} - ${format(
        new Date(s.endDate),
        "MMM d",
      )}`,
      status: uiStatus,
      progress: uiStatus === "Completed" ? 100 : uiStatus === "Active" ? 50 : 0, // Mocked progress for sprint
      team: project.members.slice(0, 3).map((m) => m.avatar || ""),
    };
  });

  return (
    <div className="relative container mx-auto space-y-10 p-4 md:p-8">
      {/* Project Overview Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Info Card */}
        <div className="bg-card border-border col-span-12 flex flex-col justify-between rounded-xl border p-6 md:p-8 lg:col-span-8">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="bg-primary/10 border-primary/20 text-primary flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                {project.status.replace("_", " ")}
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                • Project ID: PRJ-{project._id.slice(-6).toUpperCase()}
              </span>
            </div>

            <h1 className="text-foreground mb-4 text-2xl font-bold tracking-tight md:text-3xl">
              {project.title}
            </h1>

            <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed md:text-base">
              {project.description}
            </p>
          </div>

          <div className="border-border grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Client
              </p>
              <p className="text-foreground text-sm font-semibold">
                {project.client}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Lead
              </p>
              <div className="flex items-center gap-2">
                <div className="border-border relative h-5 w-5 shrink-0 overflow-hidden rounded-full border bg-neutral-800">
                  {typeof project.createdBy === "object" &&
                    project.createdBy.avatar && (
                      <Image
                        src={project.createdBy.avatar}
                        alt="Lead"
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    )}
                </div>
                <p className="text-foreground text-sm font-semibold">
                  {typeof project.createdBy === "object"
                    ? project.createdBy.name
                    : "Unknown Lead"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Deadline
              </p>
              <p className="text-foreground text-sm font-semibold">
                {format(new Date(project.endDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Budget
              </p>
              <p className="text-foreground text-sm font-semibold">
                $
                {project.budget.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Progress & Stats Card */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-card border-border flex h-full flex-col justify-between rounded-xl border p-6">
            <div>
              <h2 className="text-foreground mb-6 text-base font-semibold">
                Execution Status
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-muted-foreground text-sm">
                      Completion
                    </span>
                    <span className="text-primary text-xl font-bold">
                      {progressWidth}%
                    </span>
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background border-border rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider">
                      OPEN TASKS
                    </p>
                    <p className="text-foreground text-xl font-bold">
                      {stats?.remaining || 0}
                    </p>
                  </div>
                  <div className="bg-background border-border rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider">
                      COMPLETED
                    </p>
                    <p className="text-xl font-bold text-emerald-400">
                      {stats?.completedTasks || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint List Section */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-bold">Active Sprints</h2>

        <div className="space-y-3">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              onClick={() =>
                router.push(`/my-projects/${projectId}/sprints/${sprint.id}`)
              }
              className="group bg-card border-border hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-lg border p-4 transition-all duration-200 md:flex-row md:gap-6"
            >
              {/* Conditional Icon Rendering based on status */}
              <div className="bg-background border-border flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
                {sprint.status === "Active" && (
                  <Bolt className="text-primary h-5 w-5" />
                )}
                {sprint.status === "Completed" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
                {sprint.status === "Upcoming" && (
                  <Clock className="h-5 w-5 text-amber-500" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-center md:text-left">
                <h3 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors md:text-base">
                  {sprint.title}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {sprint.dateRange} •{" "}
                  <span
                    className={
                      sprint.status === "Completed" ? "text-emerald-400" : ""
                    }
                  >
                    {sprint.status}
                  </span>
                </p>
              </div>

              {/* Stacked Face Avatars Placeholder */}
              <div className="flex shrink-0 -space-x-2">
                {sprint.team.length > 0
                  ? sprint.team.map((avatar, index) => (
                      <div
                        key={index}
                        className="border-card relative h-8 w-8 overflow-hidden rounded-full border-2 bg-neutral-800"
                      >
                        {avatar ? (
                          <Image
                            src={avatar}
                            alt="member"
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : null}
                      </div>
                    ))
                  : null}
                {sprint.team.length === 0 && sprint.status === "Upcoming" && (
                  <div className="bg-background border-card text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold">
                    --
                  </div>
                )}
              </div>

              <div className="border-border/50 flex w-full shrink-0 items-center justify-between gap-6 border-t pt-3 md:w-auto md:justify-end md:border-t-0 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Progress
                  </p>
                  <p
                    className={`text-sm font-bold ${sprint.status === "Completed" ? "text-emerald-400" : "text-foreground"}`}
                  >
                    {sprint.progress}%
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 cursor-pointer transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
