"use client";

import { TaskCanvas } from "@/components/features/tasks";
import type {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "@/components/features/tasks/task.types";
import { useGetAllTasksQuery } from "@/redux/feature/tasks/tasksApi";
import { useAppSelector } from "@/redux/hooks";
import { AlertCircle, CheckCircle2, Clock, Flame } from "lucide-react";
import { useMemo } from "react";

const STATUS_MAP: Record<string, TaskStatus> = {
  todo: "To Do",
  in_progress: "Progress",
  review: "Review",
  done: "Done",
};

const PRIORITY_MAP: Record<string, TaskPriority> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  urgent: "Urgent",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  critical: "Urgent",
};

export default function MyTasksView() {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.name ?? "Team Member";

  const { data: tasksData } = useGetAllTasksQuery(
    { assignee: user?.id },
    { skip: !user?.id },
  );

  const tasks: TaskItem[] = useMemo(() => {
    if (!tasksData?.tasks) return [];
    return tasksData.tasks.map((t) => ({
      id: t._id,
      title: t.title,
      code: `TASK-${t._id.slice(-4).toUpperCase()}`,
      project: "Assigned Project", // Could fetch project details later if populated
      sprint: "Active Sprint", // Could fetch sprint details later if populated
      assignee: displayName,
      priority: PRIORITY_MAP[t.priority] || "Medium",
      status: STATUS_MAP[t.status] || "To Do",
      dueDate: t.dueDate ?? "No due date",
      projectId: t.projectId,
      sprintId: t.sprintId,
      taskId: t._id,
      isTimerRunning: t.isTimerRunning,
      timerStartedAt: t.timerStartedAt,
      timeSpend: t.timeSpend,
      isTimerStopped: t.isTimerStopped,
    }));
  }, [tasksData, displayName]);

  // Compute metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "Progress").length;
  const reviewTasks = tasks.filter((t) => t.status === "Review").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Urgent items
  const urgentTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (t.priority === "High" || t.priority === "Urgent") &&
        t.status !== "Done",
    );
  }, [tasks]);

  return (
    <div className="animate-in fade-in w-full space-y-6 pb-8 duration-300">
      {/* Sleek Page Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-primary font-semibold">My Tasks</span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground text-xs font-semibold">
            You have{" "}
            <span className="font-bold text-indigo-400">
              {inProgressTasks} tasks in progress
            </span>{" "}
            and{" "}
            <span className="font-bold text-rose-400">
              {urgentTasks.length} urgent tasks
            </span>{" "}
            needing focus today.
          </p>
        </div>

        {/* Dynamic Metric Dial Badge */}
        <div className="flex items-center gap-3">
          <div className="border-border bg-card/80 flex items-center gap-2.5 rounded-lg border px-3 py-1.5 text-xs font-semibold">
            <span className="text-muted-foreground">Sprint 4 Completion:</span>
            <span className="text-foreground font-bold">{completionRate}%</span>
            <span className="text-muted-foreground">
              ({completedTasks}/{totalTasks})
            </span>
          </div>
        </div>
      </div>

      {/* KPI Dashboard Blocks */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="border-border/60 bg-card flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Total Workload
            </p>
            <h3 className="text-foreground text-2xl font-bold">{totalTasks}</h3>
            <p className="text-muted-foreground text-[10px]">
              Active sprint scopes
            </p>
          </div>
          <div className="rounded-lg bg-slate-500/10 p-2.5 text-slate-400">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border-border/60 bg-card flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              In Progress
            </p>
            <h3 className="text-foreground text-2xl font-bold">
              {inProgressTasks}
            </h3>
            <p className="text-muted-foreground text-[10px]">
              Currently actively coding
            </p>
          </div>
          <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
            <Clock className="size-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border-border/60 bg-card flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Under Review
            </p>
            <h3 className="text-foreground text-2xl font-bold">
              {reviewTasks}
            </h3>
            <p className="text-muted-foreground text-[10px]">
              Pending manager check
            </p>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
            <AlertCircle className="size-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border-border/60 bg-card flex items-center justify-between rounded-xl border p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Urgent Focus
            </p>
            <h3 className="text-foreground text-2xl font-bold">
              {urgentTasks.length}
            </h3>
            <p className="text-muted-foreground text-[10px]">
              Critical priority tasks
            </p>
          </div>
          <div className="rounded-lg bg-rose-500/10 p-2.5 text-rose-400">
            <Flame className="size-5" />
          </div>
        </div>
      </section>

      {/* Focus & Canvas Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Kanban and Global List Canvas */}
        <div className="space-y-6 lg:col-span-3">
          <TaskCanvas
            initialTasks={tasks}
            hideFiltersForMember={true}
            title="My Assigned Tasks"
            subtitle="Coordinate status changes using drag-and-drop or details drawers."
          />
        </div>
      </div>
    </div>
  );
}
