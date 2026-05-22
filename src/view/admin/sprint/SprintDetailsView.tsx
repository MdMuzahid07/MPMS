"use client";

import { DeleteConfirmationModal } from "@/components/tasks/DeleteConfirmationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  FilePenLine,
  Info,
  ListFilter,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TaskItem = {
  id: string;
  taskId: string;
  title: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "Todo" | "Done" | "Blocked";
  estimate: string;
  dueDate: string;
};

const tasks: TaskItem[] = [
  {
    id: "CP-102",
    taskId: "task-102",
    title: "Refactor Auth Middleware",
    assignee: "JR",
    priority: "High",
    status: "In Progress",
    estimate: "5d",
    dueDate: "Oct 22",
  },
  {
    id: "CP-105",
    taskId: "task-105",
    title: "Implement Real-time Sync",
    assignee: "AK",
    priority: "Medium",
    status: "Todo",
    estimate: "8d",
    dueDate: "Oct 24",
  },
  {
    id: "CP-92",
    taskId: "task-092",
    title: "Design System Audit",
    assignee: "TH",
    priority: "Low",
    status: "Done",
    estimate: "3d",
    dueDate: "Oct 15",
  },
  {
    id: "CP-110",
    taskId: "task-110",
    title: "API Documentation Update",
    assignee: "IZ",
    priority: "Medium",
    status: "Blocked",
    estimate: "2d",
    dueDate: "Oct 20",
  },
];

const priorityStyles: Record<TaskItem["priority"], string> = {
  High: "text-rose-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
};

const statusStyles: Record<TaskItem["status"], string> = {
  "In Progress":
    "border-indigo-500/25 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
  Todo: "border-slate-500/20 bg-slate-500/12 text-slate-700 dark:text-slate-300",
  Done: "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  Blocked: "border-rose-500/25 bg-rose-500/12 text-rose-700 dark:text-rose-300",
};

function StatCard({
  title,
  value,
  subtitleLeft,
  subtitleRight,
  bar,
  accentClass = "bg-slate-900 dark:bg-indigo-300",
}: {
  title: string;
  value: string;
  subtitleLeft: string;
  subtitleRight: string;
  bar: number;
  accentClass?: string;
}) {
  return (
    <article className="bg-card border-border rounded-none border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground text-[11px] font-semibold">
          {title}
        </p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      <div className="bg-muted h-1.5 rounded-none">
        <div
          className={`h-1.5 rounded-none ${accentClass}`}
          style={{ width: `${bar}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-3 flex items-center justify-between text-[11px]">
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
  const [taskRows, setTaskRows] = useState(tasks);
  const [taskPendingDelete, setTaskPendingDelete] = useState<TaskItem | null>(
    null,
  );

  const handleDeleteTask = (taskId: string) => {
    setTaskRows((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="container mx-auto w-full space-y-4 pb-8">
      <section className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>Projects</span>
          <ChevronRight className="size-3" />
          <span>Core Platform</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Q4.2 - Core Features
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <Badge className="h-6 rounded-none border-0 bg-emerald-500/15 px-2 font-semibold text-emerald-600 dark:text-emerald-300">
                Active Sprint
              </Badge>
              <span className="text-muted-foreground">Oct 12 - Oct 26</span>
              <span className="text-muted-foreground">12 Team Members</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-none px-4 text-xs font-semibold"
            >
              <Link
                href={`/projects/${params.id}/sprints/${params.sprintId}/edit`}
              >
                <FilePenLine className="mr-1 size-3.5" />
                Edit Sprint
              </Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-none px-4 text-xs font-semibold"
            >
              <Link
                href={`/projects/${params.id}/sprints/${params.sprintId}/tasks/new`}
              >
                <Plus className="mr-1 size-3.5" />
                Add Task
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <StatCard
          title="Overall Completion"
          value="64%"
          subtitleLeft="14 Done"
          subtitleRight="22 Total"
          bar={64}
        />
        <StatCard
          title="Time Remaining"
          value="4 DAYS LEFT"
          subtitleLeft=""
          subtitleRight=""
          bar={72}
          accentClass="bg-lime-500"
        />
        <article className="bg-card border-border rounded-none border p-4">
          <p className="text-muted-foreground text-[11px] font-semibold">
            Blockers
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl font-semibold text-rose-500">2</span>
            <span className="text-muted-foreground pb-1 text-xs font-semibold">
              CRITICAL
            </span>
          </div>
          <div className="mt-4 flex -space-x-1">
            <span className="bg-primary text-primary-foreground inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold">
              JR
            </span>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold text-white">
              AK
            </span>
          </div>
        </article>
      </section>

      <section className="bg-card border-border rounded-none border">
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="rounded-none px-3 text-[11px] font-semibold"
            >
              All Tasks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 text-[11px] font-semibold"
            >
              Assigned to me
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 text-[11px] font-semibold"
            >
              High Priority
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 text-[11px] font-semibold"
            >
              Missing Estimate
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-2 text-[11px] font-semibold"
            >
              <ListFilter className="mr-1 size-3.5" />
              Filter
              <ChevronDown className="ml-1 size-3" />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-none">
              <Users className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-none">
              <CalendarDays className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse">
            <thead className="bg-muted/40">
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  TITLE
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  ASSIGNEE
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  PRIORITY
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  STATUS
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  ESTIMATE
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold tracking-wide">
                  DUE DATE
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {taskRows.map((task) => (
                <tr key={task.id} className="border-border border-b">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-semibold">
                        {task.id}
                      </span>
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-muted text-muted-foreground inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold">
                      {task.assignee}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant="outline"
                      className={`h-6 rounded-full border px-2 text-[10px] font-semibold ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground px-4 py-3.5 text-sm">
                    {task.estimate}
                  </td>
                  <td className="text-muted-foreground px-4 py-3.5 text-sm">
                    {task.dueDate}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <EllipsisVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/projects/${params.id}/sprints/${params.sprintId}/tasks/${task.taskId}?mode=details`}
                          >
                            <Info className="size-3.5" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/projects/${params.id}/sprints/${params.sprintId}/tasks/${task.taskId}`}
                          >
                            <FilePenLine className="size-3.5" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setTaskPendingDelete(task)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3">
          <p className="text-muted-foreground text-xs">
            Showing 1-{taskRows.length} of {taskRows.length} tasks
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="rounded-none">
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button size="icon-sm" className="rounded-none">
              1
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-none">
              2
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-none">
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <DeleteConfirmationModal
        open={Boolean(taskPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setTaskPendingDelete(null);
        }}
        title="Delete task?"
        description={`This will permanently delete "${taskPendingDelete?.title ?? "this task"}".`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (!taskPendingDelete) return;
          handleDeleteTask(taskPendingDelete.id);
          setTaskPendingDelete(null);
        }}
      />
    </div>
  );
}
