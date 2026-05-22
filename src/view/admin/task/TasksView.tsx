"use client";

import { DeleteConfirmationModal } from "@/components/tasks/DeleteConfirmationModal";
import type {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "@/components/tasks/task.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FilePenLine,
  Info,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const initialTasks: TaskItem[] = [
  {
    id: "1",
    title: "Implement OAuth2 Authentication Flow",
    code: "TASK-1024",
    project: "Vortex UI",
    sprint: "Q4-\nSprint 3",
    assignee: "Alex R.",
    priority: "High",
    status: "Progress",
    dueDate: "Oct 24,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1024",
  },
  {
    id: "2",
    title: "API Endpoint Optimization for Analytics",
    code: "TASK-1025",
    project: "Pulse Analytics",
    sprint: "Q4-\nSprint 3",
    assignee: "Sarah K.",
    priority: "Medium",
    status: "Review",
    dueDate: "Oct 26,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-09",
    taskId: "task-1025",
  },
  {
    id: "3",
    title: "Refactor Legacy Shaders",
    code: "TASK-0992",
    project: "Aether Engine",
    sprint: "Backlog",
    assignee: "Unassigned",
    priority: "Low",
    status: "To Do",
    dueDate: "Nov 12,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-backlog",
    taskId: "task-0992",
  },
  {
    id: "4",
    title: "Documentation for SDK v2.4",
    code: "TASK-1102",
    project: "Vortex UI",
    sprint: "Q4-\nSprint 3",
    assignee: "Marcus T.",
    priority: "Medium",
    status: "Done",
    dueDate: "Oct 20,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1102",
  },
];

const priorityStyle: Record<TaskPriority, string> = {
  High: "border-rose-500/20 bg-rose-500/12 text-rose-600 dark:text-rose-300",
  Medium:
    "border-amber-500/20 bg-amber-500/12 text-amber-600 dark:text-amber-300",
  Low: "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
};

const statusStyle: Record<TaskStatus, string> = {
  Progress:
    "border-indigo-500/20 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
  Review:
    "border-amber-500/20 bg-amber-500/12 text-amber-700 dark:text-amber-300",
  "To Do":
    "border-slate-500/20 bg-slate-500/12 text-slate-700 dark:text-slate-300",
  Done: "border-emerald-500/20 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
};

function FilterSelect({
  value,
  options,
  onValueChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 rounded-md px-3 text-[11px] font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AssigneeBadge({ name }: { name: string }) {
  if (name === "Unassigned") {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-muted text-muted-foreground inline-flex size-5 items-center justify-center rounded-full text-[9px] font-semibold">
          UN
        </span>
        <span className="text-muted-foreground text-xs italic">{name}</span>
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary/85 text-primary-foreground inline-flex size-5 items-center justify-center rounded-full text-[9px] font-semibold">
        {initials}
      </span>
      <span className="text-xs">{name}</span>
    </div>
  );
}

export default function TasksView() {
  const [taskRows, setTaskRows] = useState(initialTasks);
  const [projectFilter, setProjectFilter] = useState("all-projects");
  const [sprintFilter, setSprintFilter] = useState("current-sprint");
  const [assigneeFilter, setAssigneeFilter] = useState("all-assignees");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taskPendingDelete, setTaskPendingDelete] = useState<TaskItem | null>(
    null,
  );

  const projectOptions = useMemo(() => {
    const uniqueProjects = Array.from(
      new Set(taskRows.map((task) => task.project)),
    );
    return [
      { value: "all-projects", label: "All Projects" },
      ...uniqueProjects.map((project) => ({
        value: project.toLowerCase().replace(/\s+/g, "-"),
        label: project,
      })),
    ];
  }, [taskRows]);

  const sprintOptions = [
    { value: "all-sprints", label: "All Sprints" },
    { value: "current-sprint", label: "Current Sprint" },
    { value: "backlog", label: "Backlog" },
  ];

  const assigneeOptions = useMemo(() => {
    const uniqueAssignees = Array.from(
      new Set(taskRows.map((task) => task.assignee)),
    );
    return [
      { value: "all-assignees", label: "Assignee: All" },
      ...uniqueAssignees.map((assignee) => ({
        value: assignee.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: assignee,
      })),
    ];
  }, [taskRows]);

  const statusOptions = [
    { value: "all-status", label: "Status: All" },
    { value: "progress", label: "Progress" },
    { value: "review", label: "Review" },
    { value: "to-do", label: "To Do" },
    { value: "done", label: "Done" },
  ];

  const filteredTasks = useMemo(() => {
    return taskRows
      .filter((task) => {
        if (projectFilter !== "all-projects") {
          const normalizedProject = task.project
            .toLowerCase()
            .replace(/\s+/g, "-");
          if (normalizedProject !== projectFilter) {
            return false;
          }
        }

        if (sprintFilter === "current-sprint") {
          if (!task.sprint.toLowerCase().includes("sprint 3")) {
            return false;
          }
        }

        if (
          sprintFilter === "backlog" &&
          !task.sprint.toLowerCase().includes("backlog")
        ) {
          return false;
        }

        if (assigneeFilter !== "all-assignees") {
          const normalizedAssignee = task.assignee
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
          if (normalizedAssignee !== assigneeFilter) {
            return false;
          }
        }

        if (statusFilter !== "all-status") {
          const normalizedStatus = task.status
            .toLowerCase()
            .replace(/\s+/g, "-");
          if (normalizedStatus !== statusFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const compared = a.title.localeCompare(b.title);
        return sortDirection === "asc" ? compared : -compared;
      });
  }, [
    taskRows,
    projectFilter,
    sprintFilter,
    assigneeFilter,
    statusFilter,
    sortDirection,
  ]);

  const allVisibleSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((task) => selectedTaskIds.includes(task.id));

  const toggleSelectAllVisible = (checked: boolean | "indeterminate") => {
    if (checked) {
      setSelectedTaskIds((prev) => {
        const merged = new Set([
          ...prev,
          ...filteredTasks.map((task) => task.id),
        ]);
        return Array.from(merged);
      });
      return;
    }

    setSelectedTaskIds((prev) =>
      prev.filter(
        (taskId) => !filteredTasks.some((task) => task.id === taskId),
      ),
    );
  };

  const toggleTaskSelection = (
    taskId: string,
    checked: boolean | "indeterminate",
  ) => {
    if (checked) {
      setSelectedTaskIds((prev) =>
        prev.includes(taskId) ? prev : [...prev, taskId],
      );
      return;
    }

    setSelectedTaskIds((prev) =>
      prev.filter((selectedId) => selectedId !== taskId),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskRows((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTaskIds((prev) =>
      prev.filter((selectedId) => selectedId !== taskId),
    );
  };

  return (
    <div className="container mx-auto w-full space-y-4 pb-8">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
            Filters:
          </span>
          <FilterSelect
            value={projectFilter}
            options={projectOptions}
            onValueChange={setProjectFilter}
          />
          <FilterSelect
            value={sprintFilter}
            options={sprintOptions}
            onValueChange={setSprintFilter}
          />
          <FilterSelect
            value={assigneeFilter}
            options={assigneeOptions}
            onValueChange={setAssigneeFilter}
          />
          <FilterSelect
            value={statusFilter}
            options={statusOptions}
            onValueChange={setStatusFilter}
          />
          <Button
            variant="outline"
            className="h-8 rounded-md px-3 text-[11px] font-semibold"
          >
            <ChevronsUpDown className="mr-1 size-3.5" />
            More Filters
          </Button>
        </div>

        <Button
          asChild
          className="h-8 rounded-md px-3 text-[11px] font-semibold"
        >
          <Link href="/tasks/new">
            <Plus className="mr-1 size-3.5" />
            Create Task
          </Link>
        </Button>
      </section>

      <section className="bg-card border-border overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-collapse">
            <thead className="bg-muted/35">
              <tr className="border-border border-b">
                <th className="w-12 px-3 py-3 text-left">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleSelectAllVisible}
                  />
                </th>
                <th className="px-3 py-3 text-left">
                  <button
                    type="button"
                    onClick={() =>
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      )
                    }
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide"
                  >
                    TASK TITLE
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  PROJECT
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  SPRINT
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  ASSIGNEE
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  PRIORITY
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  STATUS
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
                  DUE DATE
                </th>
                <th className="w-10 px-3 py-3 text-left" />
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-border border-b">
                  <td className="px-3 py-3.5">
                    <Checkbox
                      checked={selectedTaskIds.includes(task.id)}
                      onCheckedChange={(checked) =>
                        toggleTaskSelection(task.id, checked)
                      }
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="max-w-[220px] text-sm leading-snug font-semibold">
                      {task.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px] font-semibold">
                      {task.code}
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge variant="outline" className="rounded-md text-[10px]">
                      {task.project}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-muted-foreground text-xs whitespace-pre-line">
                      {task.sprint}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <AssigneeBadge name={task.assignee} />
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge
                      variant="outline"
                      className={`h-6 rounded-full border px-2 text-[10px] font-semibold ${priorityStyle[task.priority]}`}
                    >
                      <span className="mr-1 size-1.5 rounded-full bg-current" />
                      {task.priority.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge
                      variant="outline"
                      className={`h-6 rounded-full border px-2 text-[10px] font-semibold ${statusStyle[task.status]}`}
                    >
                      {task.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground px-3 py-3.5 text-xs whitespace-pre-line">
                    {task.dueDate}
                  </td>
                  <td className="px-3 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/projects/${task.projectId}/sprints/${task.sprintId}/tasks/${task.taskId}`}
                          >
                            <Info className="size-3.5" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/projects/${task.projectId}/sprints/${task.sprintId}/tasks/${task.taskId}`}
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

        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-muted-foreground text-[11px] font-medium">
            Showing 1 to {filteredTasks.length} of {taskRows.length} tasks
          </p>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" className="rounded-md">
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button size="icon-sm" className="rounded-md">
              1
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-md">
              2
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-md">
              3
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-md">
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
