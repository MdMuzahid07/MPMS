import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CircleDashed,
  FilePenLine,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type SprintStatus = "IN PROGRESS" | "PLANNING" | "COMPLETED";

type Sprint = {
  id: string;
  slug: string;
  title: string;
  status: SprintStatus;
  dateRange: string;
  metricLabel: string;
  metricValue: string;
  progress: number;
  accent: "default" | "success";
  cta: string;
};

const sprintData: Sprint[] = [
  {
    id: "Sprint #08",
    slug: "sprint-08",
    title: "Infrastructure Hardening",
    status: "IN PROGRESS",
    dateRange: "May 12 — May 26, 2024",
    metricLabel: "Tasks Completed",
    metricValue: "18 / 24",
    progress: 75,
    accent: "default",
    cta: "View Sprint Details",
  },
  {
    id: "Sprint #09",
    slug: "sprint-09",
    title: "User Experience Refinement",
    status: "PLANNING",
    dateRange: "May 27 — Jun 10, 2024",
    metricLabel: "Scope Defined",
    metricValue: "42%",
    progress: 42,
    accent: "default",
    cta: "View Backlog",
  },
  {
    id: "Sprint #07",
    slug: "sprint-07",
    title: "Core API Integration",
    status: "COMPLETED",
    dateRange: "Apr 28 — May 11, 2024",
    metricLabel: "Goal Achieved",
    metricValue: "100%",
    progress: 100,
    accent: "success",
    cta: "View Retrospective",
  },
];

const velocityBySprint = [
  { label: "S04", value: 32 },
  { label: "S05", value: 54 },
  { label: "S06", value: 47 },
  { label: "S07", value: 75 },
  { label: "S08", value: 59 },
];

function statusBadgeStyle(status: SprintStatus) {
  if (status === "COMPLETED") {
    return "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "IN PROGRESS") {
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
    sprint.accent === "success"
      ? "bg-emerald-500"
      : "bg-slate-900 dark:bg-indigo-200";

  return (
    <article className="bg-card border-border rounded-lg border p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-wide">
            {sprint.id}
          </p>
          <h3 className="mt-1 text-lg leading-tight font-semibold">
            {sprint.title}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${statusBadgeStyle(
            sprint.status,
          )}`}
        >
          <CircleDashed className="mr-1 size-3" />
          {sprint.status}
        </Badge>
      </div>

      <div className="text-muted-foreground mb-5 flex items-center gap-1.5 text-xs">
        <CalendarDays className="size-3.5" />
        <span>{sprint.dateRange}</span>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{sprint.metricLabel}</span>
        <span className="font-semibold">{sprint.metricValue}</span>
      </div>
      <div className="bg-muted h-1.5 w-full rounded-full">
        <div
          className={`h-1.5 rounded-full ${progressClass}`}
          style={{ width: `${sprint.progress}%` }}
        />
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-5 h-8 w-full rounded-md text-xs font-semibold"
      >
        <Link href={`/projects/${projectId}/sprints/${sprint.slug}`}>
          {sprint.cta}
        </Link>
      </Button>

      <Button
        asChild
        variant="ghost"
        className="text-muted-foreground mt-1 h-8 w-full rounded-md text-xs font-semibold"
      >
        <Link href={`/projects/${projectId}/sprints/${sprint.slug}/edit`}>
          <FilePenLine className="mr-1 size-3.5" />
          Edit Sprint
        </Link>
      </Button>
    </article>
  );
}

type ProjectDetailPageProps = {
  params: { id: string };
};

export default function ProjectDetailsView({ params }: ProjectDetailPageProps) {
  const { id: projectId } = params;
  const peakVelocity = Math.max(...velocityBySprint.map((item) => item.value));

  return (
    <div className="relative container mx-auto w-full space-y-4 pb-8">
      <section className="bg-card border-border rounded-xl border p-6 dark:bg-[linear-gradient(110deg,var(--color-card)_40%,rgba(82,100,255,0.10)_100%)]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge className="rounded-full border-0 bg-emerald-500/16 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            ACTIVE
          </Badge>
          <span className="text-muted-foreground text-xs font-medium">
            ID: NC-4902
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Nebula Core
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium">
                  Budget Allocation
                </p>
                <p className="mt-1 text-2xl font-semibold">$428,000.00</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] font-medium">
                  Estimated Completion
                </p>
                <p className="mt-1 text-2xl font-semibold">Oct 2024</p>
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <div className="mb-2 flex items-end justify-between">
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium">
                    Overall Completion
                  </p>
                  <p className="text-xl font-semibold">68%</p>
                </div>
                <p className="text-muted-foreground text-xs font-medium">
                  Next Milestone: v2.0 Beta
                </p>
              </div>
              <div className="bg-muted h-2 w-full rounded-full">
                <div className="bg-primary h-2 w-[68%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Sprint Cycles</h2>
        <Button asChild className="h-9 rounded-md px-4 text-xs font-semibold">
          <Link href={`/projects/${projectId}/sprints/new`}>
            <Plus className="mr-1 size-3.5" />
            New Sprint
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {sprintData.map((sprint) => (
          <SprintItemCard
            key={sprint.id}
            projectId={projectId}
            sprint={sprint}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr_0.72fr]">
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Sprint Velocity</h3>
          <div className="mt-6">
            <div className="flex h-28 items-end gap-2">
              {velocityBySprint.map((bar) => {
                const isPeak = bar.value === peakVelocity;
                return (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="bg-muted flex h-24 w-full items-end rounded-sm">
                      <div
                        className={`w-full rounded-sm ${
                          isPeak
                            ? "bg-slate-900 dark:bg-indigo-300"
                            : "bg-slate-300/80 dark:bg-slate-500/70"
                        }`}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[11px] font-medium">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-border mt-6 border-t pt-4">
            <p className="text-muted-foreground text-[11px]">
              Average Velocity
            </p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold">54 pts/sprint</p>
              <span className="text-xs font-semibold text-emerald-500">
                +12%
              </span>
            </div>
          </div>
        </article>

        <article className="bg-card border-border rounded-lg border p-5">
          <h3 className="text-3xl font-semibold tracking-tight">
            Team Availability
          </h3>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
            All core members are currently allocated to active sprints. Next
            availability starts from June 12th for Phase 3 planning.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button className="h-9 rounded-md px-4 text-xs font-semibold">
              Adjust Capacity
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-md px-4 text-xs font-semibold"
            >
              Team Schedule
            </Button>
          </div>
        </article>

        <article className="bg-card border-border rounded-lg border p-4">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center -space-x-2">
              <span className="bg-primary/90 border-background inline-flex size-8 items-center justify-center rounded-md border text-xs font-semibold text-white">
                A
              </span>
              <span className="border-background inline-flex size-8 items-center justify-center rounded-md border bg-sky-500/90 text-xs font-semibold text-white">
                K
              </span>
              <span className="border-background inline-flex size-8 items-center justify-center rounded-md border bg-emerald-500/90 text-xs font-semibold text-white">
                R
              </span>
            </div>
            <span className="text-muted-foreground text-xs font-semibold">
              +8
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed italic">
            “Velocity has outpaced this week due to improved CI/CD pipeline
            automation.” — Sarah, Lead Eng.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="rounded-full px-2 py-0.5">
              <Sparkles className="mr-1 size-3" />
              Weekly note
            </Badge>
          </div>
        </article>
      </section>

      <button
        type="button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 inline-flex size-11 items-center justify-center rounded-lg shadow-lg transition-colors"
        aria-label="Create new"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
