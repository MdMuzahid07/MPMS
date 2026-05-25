"use client";

import { Bolt, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const projectId = params?.id ?? "1";

  // Client state to safely handle micro-interaction on hydration mount
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(68), 200);
    return () => clearTimeout(timer);
  }, []);

  const sprints: SprintItem[] = [
    {
      id: "sprint-4",
      title: "Sprint 04: Component Library Polish",
      dateRange: "Sept 12 - Sept 26",
      status: "Active",
      progress: 82,
      team: ["/profile/picture/3", "/profile/picture/4"],
    },
    {
      id: "sprint-3",
      title: "Sprint 03: Architecture Validation",
      dateRange: "Aug 28 - Sept 11",
      status: "Completed",
      progress: 100,
      team: ["/profile/picture/5"],
    },
    {
      id: "sprint-5",
      title: "Sprint 05: API Integration & Testing",
      dateRange: "Sept 27 - Oct 11",
      status: "Upcoming",
      progress: 0,
      team: [],
    },
  ];

  return (
    <div className="relative container mx-auto space-y-10 p-4 md:p-8">
      {/* Project Overview Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Info Card */}
        <div className="bg-card border-border col-span-12 flex flex-col justify-between rounded-xl border p-6 md:p-8 lg:col-span-8">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="bg-primary/10 border-primary/20 text-primary flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                IN PROGRESS
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                • Project ID: PRJ-2024-082
              </span>
            </div>

            <h1 className="text-foreground mb-4 text-2xl font-bold tracking-tight md:text-3xl">
              Technical Dark Mode System Design
            </h1>

            <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed md:text-base">
              Designing and implementing a high-performance design system for
              developer tools. Focusing on speed, information density, and the
              &apos;Procedural Midnight&apos; aesthetic for professional
              software engineering platforms.
            </p>
          </div>

          <div className="border-border grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Client
              </p>
              <p className="text-foreground text-sm font-semibold">
                Aether Corp.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Lead
              </p>
              <div className="flex items-center gap-2">
                <div className="border-border h-5 w-5 shrink-0 overflow-hidden rounded-full border bg-neutral-800" />
                <p className="text-foreground text-sm font-semibold">
                  Marcus V.
                </p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Deadline
              </p>
              <p className="text-foreground text-sm font-semibold">
                Oct 24, 2024
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Budget
              </p>
              <p className="text-foreground text-sm font-semibold">
                $42,500.00
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
                    <p className="text-foreground text-xl font-bold">14</p>
                  </div>
                  <div className="bg-background border-border rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider">
                      COMPLETED
                    </p>
                    <p className="text-xl font-bold text-emerald-400">32</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border mt-6 border-t pt-6">
              <button className="bg-primary text-primary-foreground w-full rounded-lg border py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-98">
                GENERATE REPORT
              </button>
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
                  ? sprint.team.map((_, index) => (
                      <div
                        key={index}
                        className="border-card h-8 w-8 rounded-full border-2 bg-neutral-800"
                      />
                    ))
                  : null}
                {sprint.id === "sprint-4" && (
                  <div className="bg-background border-card text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold">
                    +3
                  </div>
                )}
                {sprint.id === "sprint-3" && (
                  <div className="bg-background border-card text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold">
                    +1
                  </div>
                )}
                {sprint.status === "Upcoming" && (
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
