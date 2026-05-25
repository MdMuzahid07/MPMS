"use client";

import { TaskCanvas } from "@/components/features/tasks";
import type { TaskItem } from "@/components/features/tasks/task.types";
import { useAppSelector } from "@/redux/hooks";
import { AlertCircle, CheckCircle2, Clock, Flame } from "lucide-react";
import { useMemo } from "react";

// Seed personalized tasks
const getPersonalTasks = (userName: string): TaskItem[] => [
  {
    id: "user-t1",
    title: "Refactor API middleware for performance optimization",
    code: "TASK-802",
    project: "Quantum Core",
    sprint: "Sprint 4",
    assignee: userName,
    priority: "High",
    status: "Progress",
    dueDate: "Oct 24, 2023",
    projectId: "proj-1",
    sprintId: "sprint-04",
    taskId: "task-802",
  },
  {
    id: "user-t2",
    title: "Design CSS variables for premium dark theme aesthetic",
    code: "TASK-803",
    project: "Design System",
    sprint: "Sprint 4",
    assignee: userName,
    priority: "Medium",
    status: "To Do",
    dueDate: "Oct 28, 2023",
    projectId: "proj-4",
    sprintId: "sprint-04",
    taskId: "task-803",
  },
  {
    id: "user-t3",
    title: "Implement visual charts using pure CSS elements",
    code: "TASK-804",
    project: "Pulse Analytics",
    sprint: "Sprint 4",
    assignee: userName,
    priority: "Low",
    status: "Review",
    dueDate: "Oct 25, 2023",
    projectId: "proj-2",
    sprintId: "sprint-04",
    taskId: "task-804",
  },
  {
    id: "user-t4",
    title: "Optimize database queries on session preferences lookup",
    code: "TASK-805",
    project: "Quantum Core",
    sprint: "Sprint 4",
    assignee: userName,
    priority: "High",
    status: "Done",
    dueDate: "Oct 21, 2023",
    projectId: "proj-1",
    sprintId: "sprint-04",
    taskId: "task-805",
  },
  {
    id: "user-t5",
    title: "OAuth2 authentication token validation logic review",
    code: "TASK-806",
    project: "Vortex UI",
    sprint: "Sprint 3",
    assignee: userName,
    priority: "High",
    status: "To Do",
    dueDate: "Oct 30, 2023",
    projectId: "proj-3",
    sprintId: "sprint-03",
    taskId: "task-806",
  },
];

export default function MyTasksView() {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.name ?? "Team Member";

  const tasks = useMemo(() => {
    return getPersonalTasks(displayName);
  }, [displayName]);

  // Compute metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "Progress").length;
  const reviewTasks = tasks.filter((t) => t.status === "Review").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Urgent items
  const urgentTasks = useMemo(() => {
    return tasks.filter((t) => t.priority === "High" && t.status !== "Done");
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
            <h3 className="text-foreground text-2xl font-bold text-indigo-400">
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
            <h3 className="text-foreground text-2xl font-bold text-amber-400">
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
            <h3 className="text-foreground text-2xl font-bold text-rose-400">
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
