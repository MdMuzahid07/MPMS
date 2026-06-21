/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TaskCanvas } from "@/components/features/tasks";
import { DeleteConfirmationModal } from "@/components/features/tasks/DeleteConfirmationModal";
import type {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "@/components/features/tasks/task.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjectByIdQuery } from "@/redux/feature/projects/projectsApi";
import {
  useDeleteSprintMutation,
  useGetSprintsQuery,
} from "@/redux/feature/sprints/sprintsApi";
import { useGetTasksQuery } from "@/redux/feature/tasks/tasksApi";
import {
  CalendarRange,
  ChevronRight,
  FilePenLine,
  Milestone,
  Plus,
  ShieldAlert,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function StatCard({
  title,
  value,
  subtitleLeft,
  subtitleRight,
  bar,
  accentClass = "bg-primary",
}: {
  title: string;
  value: string;
  subtitleLeft: string;
  subtitleRight: string;
  bar: number;
  accentClass?: string;
}) {
  return (
    <article className="border-border/60 bg-card rounded-xl border p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {title}
        </p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className={`h-full ${accentClass} transition-all duration-300`}
          style={{ width: `${bar}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-3 flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase">
        <span>{subtitleLeft}</span>
        <span>{subtitleRight}</span>
      </div>
    </article>
  );
}

type SprintDetailPageProps = {
  params: {
    id: string;
    sprintId: string;
  };
};

export default function SprintDetailView({ params }: SprintDetailPageProps) {
  const { id, sprintId } = params;
  const router = useRouter();

  // Deletion logic
  const [deleteSprint, { isLoading: isDeleting }] = useDeleteSprintMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteSprint({ projectId: id, sprintId }).unwrap();
      toast.success("Sprint deleted successfully.");
      router.push(`/projects/${id}`);
    } catch (err) {
      console.error("Sprint deletion error:", err);
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to delete sprint.");
    }
  };

  // Real-time Queries
  const { data: project, isLoading: isLoadingProject } =
    useGetProjectByIdQuery(id);
  const { data: sprintDataRaw, isLoading: isLoadingSprints } =
    useGetSprintsQuery(id);
  const { data: taskDataRaw, isLoading: isLoadingTasks } =
    useGetTasksQuery(sprintId);

  // Unpack wrappers safely
  const sprints = Array.isArray(sprintDataRaw)
    ? sprintDataRaw
    : (sprintDataRaw as any)?.data || [];

  const rawTasks = Array.isArray(taskDataRaw)
    ? taskDataRaw
    : (taskDataRaw as any)?.data || [];

  const activeSprint = sprints.find((s: any) => s._id === sprintId);

  // loading state skeleton
  if (isLoadingProject || isLoadingSprints || isLoadingTasks) {
    return (
      <div className="mt-6 w-full animate-pulse space-y-6 pb-8">
        <div className="space-y-3">
          <div className="bg-muted h-4 w-32 rounded" />
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="bg-muted h-8 w-64 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="bg-muted h-5 w-20 rounded" />
                <div className="bg-muted h-5 w-32 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-muted h-9 w-24 animate-pulse rounded" />
              <div className="bg-muted h-9 w-24 animate-pulse rounded" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted h-32 animate-pulse rounded-xl" />
          <div className="bg-muted h-32 animate-pulse rounded-xl" />
          <div className="bg-muted h-32 animate-pulse rounded-xl" />
        </div>
        <div className="bg-muted h-96 animate-pulse rounded-xl" />
      </div>
    );
  }

  // sprint missing fallback
  if (!activeSprint) {
    return (
      <div className="border-border bg-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl border-dashed p-12 text-center">
        <ShieldAlert className="text-destructive mb-4 size-12 animate-bounce" />
        <h2 className="text-foreground mb-2 text-xl font-bold">
          Sprint Not Found
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          The sprint you are trying to access does not exist or has been
          removed.
        </p>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-lg px-5 text-sm font-semibold"
        >
          <Link href={`/projects/${id}`}>Back to Project Details</Link>
        </Button>
      </div>
    );
  }

  // Map backend status to TaskCanvas frontend type
  const mapStatusToFrontend = (status: string): TaskStatus => {
    switch (status) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "Progress";
      case "REVIEW":
        return "Review";
      case "DONE":
        return "Done";
      default:
        return "To Do";
    }
  };

  // Map backend priority to TaskCanvas frontend type
  const mapPriorityToFrontend = (priority: string): TaskPriority => {
    switch (priority) {
      case "HIGH":
      case "CRITICAL":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return "Medium";
    }
  };

  // Map real database tasks into the TaskCanvas format
  const initialTasks: TaskItem[] = rawTasks.map((task: any) => ({
    id: task._id,
    title: task.title,
    code: `TK-${task._id.slice(-4).toUpperCase()}`,
    project: project?.title || "Core Platform",
    sprint: activeSprint.title,
    assignee: task.assignees?.[0]?.name || "Unassigned",
    priority: mapPriorityToFrontend(task.priority),
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No due date",
    projectId: task.project?._id || task.project || "",
    sprintId: task.sprint?._id || task.sprint || "",
    taskId: task._id,
    isTimerRunning: task.isTimerRunning,
    timerStartedAt: task.timerStartedAt,
    timeSpend: task.timeSpend,
    isTimerStopped: task.isTimerStopped,
  }));

  // Calculations for stats
  const totalTasks = rawTasks.length;
  const doneTasks = rawTasks.filter((t: any) => t.status === "DONE").length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Calculate days left
  const calculateDaysLeft = (endDateStr: string) => {
    if (!endDateStr) return "N/A";
    const end = new Date(endDateStr);
    const now = new Date();
    // Normalize hours
    end.setHours(23, 59, 59, 999);
    now.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "SPRINT ENDED";
    if (diffDays === 0) return "LAST DAY";
    return `${diffDays} DAYS LEFT`;
  };

  const daysLeftText = calculateDaysLeft(activeSprint.endDate);

  // Dynamic Time Remaining percentage bar
  const calculateTimeProgress = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const now = new Date().getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const timeProgress = calculateTimeProgress(
    activeSprint.startDate,
    activeSprint.endDate,
  );

  // Dynamic Blockers from real Critical / High priority tasks
  const blockerTasks = rawTasks.filter(
    (t: any) => t.priority === "CRITICAL" || t.priority === "HIGH",
  );
  const blockerCount = blockerTasks.length;

  // Get unique blocker assignees for face avatars
  const blockerAssigneesMap = new Map();
  blockerTasks.forEach((t: any) => {
    t.assignees?.forEach((u: any) => {
      if (u?._id) {
        blockerAssigneesMap.set(u._id, u);
      }
    });
  });
  const blockerAssignees = Array.from(blockerAssigneesMap.values());

  // Format Sprint date string for display
  const formatDateRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "";
    const start = new Date(startStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = new Date(endStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${start} - ${end}`;
  };

  const sprintDateRange = formatDateRange(
    activeSprint.startDate,
    activeSprint.endDate,
  );

  // Load saved metadata from localStorage if exists
  let savedMeta: any = null;
  if (typeof window !== "undefined") {
    const rawMeta = localStorage.getItem(`sprint_meta_${sprintId}`);
    if (rawMeta) {
      try {
        savedMeta = JSON.parse(rawMeta);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const sprintGoal =
    savedMeta?.sprintGoal ||
    "Reduce infra overhead and finalize migration checkpoints for phase 3.";
  const estimatedHours = Number(savedMeta?.estimatedHours) || 320;
  const teamCapacity = Number(savedMeta?.teamCapacity) || 400;
  const sprintLead = savedMeta?.sprintLead || "Alex Rivera";
  const milestones = savedMeta?.milestones || [
    { id: "ms-1", name: "Schema Migration Completed", dueDate: "2023-10-15" },
    { id: "ms-2", name: "Load Testing Finalized", dueDate: "2023-10-22" },
  ];

  return (
    <div className="animate-in fade-in w-full space-y-6 pb-8 duration-300">
      {/* Breadcrumb & Navigation */}
      <section className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
          <span>Projects</span>
          <ChevronRight className="size-3" />
          <span>{project?.title || "Project Workspace"}</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {activeSprint.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <Badge className="border-success/20 bg-success/10 text-success h-6 rounded-full border px-2.5 text-[10px] font-bold">
                {activeSprint.status === "active"
                  ? "Active Sprint"
                  : activeSprint.status.toUpperCase()}
              </Badge>
              {sprintDateRange && (
                <span className="text-muted-foreground font-medium">
                  {sprintDateRange}
                </span>
              )}
              <span className="text-muted-foreground font-medium">
                • {project?.members?.length || 1} Team Members
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive/80 hover:text-destructive h-9 rounded-lg px-3.5 text-xs font-semibold"
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Delete Sprint
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border h-9 rounded-lg px-3.5 text-xs font-semibold hover:bg-[#1b1b23]"
            >
              <Link href={`/projects/${id}/sprints/${sprintId}/edit`}>
                <FilePenLine className="mr-1.5 size-3.5" />
                Edit Sprint
              </Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-lg px-3.5 text-xs font-semibold"
            >
              <Link href={`/projects/${id}/sprints/${sprintId}/tasks/new`}>
                <Plus className="mr-1.5 size-3.5" />
                Add Task
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Stats Widgets */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Overall Completion"
          value={`${completionPercentage}%`}
          subtitleLeft={`${doneTasks} Done`}
          subtitleRight={`${totalTasks} Total`}
          bar={completionPercentage}
        />
        <StatCard
          title="Time Remaining"
          value={daysLeftText}
          subtitleLeft=""
          subtitleRight=""
          bar={timeProgress}
          accentClass={
            daysLeftText === "SPRINT ENDED" ? "bg-red-500" : "bg-warning"
          }
        />
        <article className="border-border/60 bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Blockers
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span
              className={
                blockerCount > 0
                  ? "text-destructive text-3xl font-extrabold"
                  : "text-foreground text-3xl font-extrabold"
              }
            >
              {blockerCount}
            </span>
            <span className="text-muted-foreground pb-0.5 text-[10px] font-bold tracking-wider uppercase">
              CRITICAL BLOCKERS
            </span>
          </div>
          <div className="mt-4 flex -space-x-1.5">
            {blockerAssignees.length === 0 ? (
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                No active blockers
              </span>
            ) : (
              blockerAssignees.map((user: any) => (
                <div
                  key={user._id}
                  className="border-background bg-primary text-primary-foreground inline-flex size-6 items-center justify-center rounded-full border-2 text-[8px] font-bold select-none"
                  title={user.name}
                >
                  {user.name
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      {/* Sprint Planning Overview Panel */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Sprint Goal & Milestones */}
        <div className="border-border/50 bg-card space-y-5 rounded-xl border p-6 md:col-span-2">
          <div>
            <h3 className="text-foreground mb-2 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Target className="size-4 text-indigo-500" />
              Sprint Goal
            </h3>
            <p className="text-foreground/90 bg-muted/20 border-border/30 rounded-xl border p-4 text-sm leading-relaxed font-medium">
              {`"${sprintGoal}"`}
            </p>
          </div>

          <div>
            <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Milestone className="size-4 text-indigo-500" />
              Sprint Milestones
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {milestones.map((ms: any) => (
                <div
                  key={ms.id || ms.name}
                  className="bg-muted/10 border-border/40 flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg p-2 text-xs font-bold">
                      MS
                    </div>
                    <div className="overflow-hidden text-left">
                      <p className="text-foreground max-w-37.5 truncate text-xs font-semibold sm:max-w-50">
                        {ms.name || "Unnamed Milestone"}
                      </p>
                      {ms.dueDate && (
                        <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
                          <CalendarRange className="text-muted-foreground/75 size-3" />
                          {new Date(ms.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sprint Performance & Capacity */}
        <div className="border-border/50 bg-card flex flex-col justify-between space-y-6 rounded-xl border p-6">
          <div className="space-y-4">
            <h3 className="text-foreground flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              <Zap className="size-4 text-indigo-500" />
              Capacity & Efficiency
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Estimated Hours</span>
                <span className="text-foreground">{estimatedHours} hrs</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Team Capacity</span>
                <span className="text-foreground">{teamCapacity} hrs</span>
              </div>

              {/* Progress bar matching estimates to capacity */}
              <div className="space-y-1">
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (estimatedHours / teamCapacity) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground text-right text-[10px] font-semibold">
                  {Math.round((estimatedHours / teamCapacity) * 100)}%
                  Allocation
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-xs font-bold text-indigo-500 uppercase select-none">
                {sprintLead
                  ? sprintLead
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "SL"}
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Sprint Lead
                </p>
                <p className="text-foreground text-xs font-semibold">
                  {sprintLead || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shareable TaskCanvas dual view switcher */}
      <section>
        <TaskCanvas
          initialTasks={initialTasks}
          title="Sprint Work Canvas"
          subtitle="Toggle views to track sprint items and update priorities."
        />
      </section>

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Sprint?"
        description={`Are you sure you want to delete "${activeSprint.title}"? All tasks assigned to this sprint will lose their sprint association. This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
}
