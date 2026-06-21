"use client";

/* eslint-disable @next/next/no-img-element */

import { useGetSprintsQuery } from "@/redux/feature/sprints/sprintsApi";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/redux/feature/tasks/tasksApi";
import { useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit2,
  ExternalLink,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_STYLES = {
  TODO: {
    label: "To Do",
    bg: "bg-slate-500/10 dark:bg-slate-400/10",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/20 dark:border-slate-400/20",
    dot: "bg-slate-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
    dot: "bg-info",
  },
  REVIEW: {
    label: "Review",
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    dot: "bg-warning",
  },
  DONE: {
    label: "Done",
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    dot: "bg-success",
  },
};

export default function MyProjectSprintDetailsView() {
  const params = useParams();
  const router = useRouter();
  const projectIdParam = params?.id;
  const sprintIdParam = params?.sprintId;
  const projectId = Array.isArray(projectIdParam)
    ? (projectIdParam[0] ?? "1")
    : (projectIdParam ?? "1");
  const sprintId = Array.isArray(sprintIdParam)
    ? (sprintIdParam[0] ?? "1")
    : (sprintIdParam ?? "1");

  const { data: sprints } = useGetSprintsQuery(projectId, { skip: !projectId });
  const activeSprint = sprints?.find((s) => s._id === sprintId);

  const { data: tasksData } = useGetTasksQuery(sprintId, { skip: !sprintId });
  const [updateTask] = useUpdateTaskMutation();
  const { user } = useAppSelector((state) => state.auth);

  // Manage expandable row item IDs in a state array to allow independent toggles
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
  );
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const toggleTaskDetails = (id: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const task = tasksData?.find((t) => t._id === id);
    if (!task) return;

    if (
      task.status === "REVIEW" &&
      newStatus === "DONE" &&
      user?.role === "member"
    ) {
      toast.error("Only managers can approve tasks from Review to Done.");
      return;
    }

    try {
      await updateTask({
        taskId: id,
        data: {
          status: newStatus as "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE",
        },
      }).unwrap();
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const filteredTasks = (tasksData || []).filter((task) =>
    priorityFilter === "All Priorities"
      ? true
      : task.priority.toLowerCase() === priorityFilter.toLowerCase(),
  );

  // Dynamic Sprint Health and Days Left Calculations
  const totalTasks = tasksData?.length || 0;
  const completedTasks =
    tasksData?.filter((t) => t.status === "DONE").length || 0;
  const sprintHealth =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const calculateDaysLeft = () => {
    if (!activeSprint?.endDate) return 0;
    const end = new Date(activeSprint.endDate);
    const now = new Date();
    end.setHours(23, 59, 59, 999);
    now.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const daysLeft = activeSprint ? calculateDaysLeft() : 0;

  return (
    <div className="text-on-surface container mx-auto min-h-screen p-4">
      {/* Sprint Header Section */}
      <section className="mb-10 transition-all duration-700 ease-out">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="bg-success/10 text-success border-success/20 flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                <span className="bg-success h-1.5 w-1.5 rounded-full" />
                {activeSprint?.status || "Unknown"} Sprint
              </span>
              <span className="text-on-surface-variant text-xs">
                {activeSprint?.startDate && activeSprint?.endDate
                  ? `${format(new Date(activeSprint.startDate), "MMM d")} — ${format(new Date(activeSprint.endDate), "MMM d, yyyy")}`
                  : "Date not set"}
              </span>
            </div>
            <h1 className="text-on-surface text-2xl font-bold tracking-tight md:text-3xl">
              {activeSprint?.title || "Sprint Overview"}
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-2xl text-sm leading-relaxed">
              Managing current goals, tasks, and velocity for this sprint.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <button className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all active:scale-95">
              <Edit2 className="h-4 w-4" />
              Edit Sprint
            </button>
            <button className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all hover:brightness-110 active:scale-95">
              <Play className="h-4 w-4 fill-current" />
              Complete Sprint
            </button>
          </div>
        </div>

        {/* Bento Style Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface-container-low border-outline-variant rounded-xl border p-4">
            <p className="text-on-surface-variant text-xs font-medium tracking-tighter uppercase">
              Total Tasks
            </p>
            <p className="text-on-surface mt-1 text-2xl font-bold">
              {totalTasks}
            </p>
          </div>
          <div className="bg-surface-container-low border-outline-variant rounded-xl border p-4">
            <p className="text-on-surface-variant text-xs font-medium tracking-tighter uppercase">
              Total Estimate
            </p>
            <div className="mt-1 flex items-end gap-1">
              <p className="text-on-surface text-2xl font-bold">
                {tasksData?.reduce(
                  (acc, t) => acc + (t.estimateHours || 0),
                  0,
                ) || 0}
              </p>
              <span className="text-on-surface-variant pb-1 text-xs">hrs</span>
            </div>
          </div>
          <div className="bg-surface-container-low border-outline-variant rounded-xl border p-4">
            <p className="text-on-surface-variant text-xs font-medium tracking-tighter uppercase">
              Days Left
            </p>
            <p className="text-primary mt-1 text-2xl font-bold">{daysLeft}</p>
          </div>
          <div className="bg-surface-container-low border-outline-variant flex flex-col justify-between rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-on-surface-variant text-xs font-medium tracking-tighter uppercase">
                Sprint Health
              </p>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  sprintHealth >= 70
                    ? "text-success bg-success/10 border-success/20 border"
                    : sprintHealth >= 30
                      ? "text-warning bg-warning/10 border-warning/20 border"
                      : "text-info bg-info/10 border-info/20 border"
                }`}
              >
                {sprintHealth}%
              </span>
            </div>
            <div className="mt-3">
              <div className="bg-muted-foreground/10 h-2 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sprintHealth >= 70
                      ? "bg-success"
                      : sprintHealth >= 30
                        ? "bg-warning"
                        : "bg-info"
                  }`}
                  style={{ width: `${sprintHealth}%` }}
                />
              </div>
              <p className="text-on-surface-variant/70 mt-2 text-[10px] font-medium">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="space-y-4">
        <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-on-surface text-xl font-bold">My Tasks</h2>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-on-surface-variant text-xs font-medium">
              Filter by:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-surface-container text-on-surface focus:ring-primary cursor-pointer rounded border-none px-3 py-1 text-xs outline-hidden focus:ring-1"
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Expandable Task List Table */}
        <div className="border-outline-variant bg-surface-container-lowest overflow-hidden rounded-xl border shadow-xs">
          {/* Task Table Header */}
          <div className="border-outline-variant bg-surface-container-low text-on-surface-variant/80 hidden grid-cols-12 gap-4 border-b px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase md:grid">
            <div className="col-span-5">Task Title</div>
            <div className="col-span-2 text-center">Assignees</div>
            <div className="col-span-2 text-center">Priority</div>
            <div className="col-span-1.5 text-center">Estimate</div>
            <div className="col-span-1.5 text-right">Status</div>
          </div>

          {/* Task Rows */}
          {filteredTasks.length === 0 ? (
            <div className="text-on-surface-variant p-8 text-center text-sm">
              No tasks found.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isExpanded = !!expandedTasks[task._id];

              // Priority border mapping
              const priorityBorderColor =
                task.priority === "CRITICAL"
                  ? "before:bg-red-500"
                  : task.priority === "HIGH"
                    ? "before:bg-orange-500"
                    : task.priority === "MEDIUM"
                      ? "before:bg-amber-500"
                      : "before:bg-blue-500";

              return (
                <div
                  key={task._id}
                  className="border-outline-variant border-b last:border-0"
                >
                  <div
                    onClick={() =>
                      router.push(
                        `/my-projects/${projectId}/sprints/${sprintId}/tasks/${task._id}`,
                      )
                    }
                    className={`group hover:bg-surface-container-low/40 relative flex cursor-pointer flex-col gap-3 px-4 py-4 transition-all duration-200 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[3.5px] md:grid md:grid-cols-12 md:items-center md:gap-4 md:px-6 md:py-3.5 ${priorityBorderColor}`}
                  >
                    {/* Title Cell */}
                    <div className="col-span-12 flex min-w-0 items-start gap-3 md:col-span-5 md:items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskDetails(task._id);
                        }}
                        className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 shrink-0 rounded p-0.5 transition-colors"
                        title={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4.5 w-4.5" />
                        ) : (
                          <ChevronRight className="h-4.5 w-4.5" />
                        )}
                      </button>

                      <div className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={`/my-projects/${projectId}/sprints/${sprintId}/tasks/${task._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-on-surface group-hover:text-primary truncate text-sm font-semibold tracking-tight transition-colors hover:underline"
                        >
                          {task.title}
                        </Link>

                        {/* Meta information tags */}
                        <div className="text-on-surface-variant/60 flex flex-wrap items-center gap-3 text-[10px] font-medium">
                          {task.dueDate && (
                            <span className="text-warning/90 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(new Date(task.dueDate), "MMM dd")}
                              </span>
                            </span>
                          )}
                          {task.attachments && task.attachments.length > 0 && (
                            <span className="bg-surface-container-high/40 flex items-center gap-1 rounded px-1.5 py-0.5">
                              <Paperclip className="text-primary/80 h-3 w-3" />
                              <span>{task.attachments.length}</span>
                            </span>
                          )}
                          {task.comments && task.comments.length > 0 && (
                            <span className="bg-surface-container-high/40 flex items-center gap-1 rounded px-1.5 py-0.5">
                              <MessageSquare className="text-primary/80 h-3 w-3" />
                              <span>{task.comments.length}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Assignees Stack Cell */}
                    <div className="col-span-6 flex items-center md:col-span-2 md:justify-center">
                      <span className="text-on-surface-variant/60 mr-2 text-[10px] font-bold tracking-wider uppercase md:hidden">
                        Assignees:
                      </span>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {task.assignees && task.assignees.length > 0 ? (
                          task.assignees.map((assignee) => (
                            <img
                              key={assignee._id}
                              className="ring-surface-container-lowest inline-block h-5.5 w-5.5 rounded-full object-cover ring-2"
                              src={
                                assignee.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=random`
                              }
                              alt={assignee.name}
                              title={assignee.name}
                            />
                          ))
                        ) : (
                          <span className="text-on-surface-variant/40 text-[11px] italic">
                            Unassigned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Priority Badge Cell */}
                    <div className="col-span-6 flex items-center md:col-span-2 md:justify-center">
                      <span className="text-on-surface-variant/60 mr-2 text-[10px] font-bold tracking-wider uppercase md:hidden">
                        Priority:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                          task.priority === "HIGH" ||
                          task.priority === "CRITICAL"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : task.priority === "MEDIUM"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-info/10 text-info border-info/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            task.priority === "HIGH" ||
                            task.priority === "CRITICAL"
                              ? "bg-destructive"
                              : task.priority === "MEDIUM"
                                ? "bg-warning"
                                : "bg-info"
                          }`}
                        />
                        {task.priority}
                      </span>
                    </div>

                    {/* Estimate Hours Cell */}
                    <div className="md:col-span-1.5 text-on-surface-variant col-span-6 flex items-center text-xs font-semibold md:justify-center">
                      <span className="text-on-surface-variant/60 mr-2 text-[10px] font-bold tracking-wider uppercase md:hidden">
                        Estimate:
                      </span>
                      <span className="bg-surface-container-high/30 border-outline-variant/10 flex items-center gap-1 rounded-md border px-2 py-0.5">
                        <Clock className="text-primary h-3 w-3 opacity-60" />
                        <span>
                          {task.estimateHours ? `${task.estimateHours}h` : "--"}
                        </span>
                      </span>
                    </div>

                    {/* Status Dropdown Cell */}
                    <div
                      className="md:col-span-1.5 col-span-6 flex items-center md:justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-on-surface-variant/60 mr-2 text-[10px] font-bold tracking-wider uppercase md:hidden">
                        Status:
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-all select-none hover:brightness-105 focus:outline-hidden active:scale-95 ${STATUS_STYLES[task.status as keyof typeof STATUS_STYLES]?.bg} ${STATUS_STYLES[task.status as keyof typeof STATUS_STYLES]?.text} ${STATUS_STYLES[task.status as keyof typeof STATUS_STYLES]?.border}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[task.status as keyof typeof STATUS_STYLES]?.dot}`}
                            />
                            <span>
                              {
                                STATUS_STYLES[
                                  task.status as keyof typeof STATUS_STYLES
                                ]?.label
                              }
                            </span>
                            <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-popover border-outline-variant/30 animate-in fade-in zoom-in-95 z-50 min-w-36 rounded-xl border p-1 shadow-lg duration-100"
                        >
                          {(
                            Object.keys(STATUS_STYLES) as Array<
                              keyof typeof STATUS_STYLES
                            >
                          ).map((statusKey) => (
                            <DropdownMenuItem
                              key={statusKey}
                              onClick={() =>
                                handleStatusChange(task._id, statusKey)
                              }
                              className={`focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                task.status === statusKey
                                  ? `${STATUS_STYLES[statusKey].bg} ${STATUS_STYLES[statusKey].text}`
                                  : "text-on-surface hover:bg-surface-container-high/40"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[statusKey].dot}`}
                              />
                              <span>{STATUS_STYLES[statusKey].label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Expandable Details Frame */}
                  {isExpanded && (
                    <div className="bg-surface-container/10 border-outline-variant/10 text-on-surface-variant animate-in fade-in slide-in-from-top-1 border-t px-6 py-4 text-xs duration-200 md:px-14">
                      <div className="max-w-3xl space-y-4">
                        <div className="bg-surface-container-lowest/50 border-outline-variant/20 rounded-lg border p-3.5">
                          <h4 className="text-on-surface-variant/60 mb-2 text-[10px] font-bold tracking-widest uppercase">
                            Description
                          </h4>
                          <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                            {task.description || "No description provided."}
                          </p>
                        </div>

                        <div className="text-on-surface-variant/80 flex flex-wrap items-center gap-3 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/my-projects/${projectId}/sprints/${sprintId}/tasks/${task._id}`,
                              );
                            }}
                            className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 flex items-center gap-1.5 rounded border px-3 py-1 text-[11px] font-bold transition-all"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Task Details</span>
                          </button>

                          {task.attachments?.map((file, idx) => {
                            const attachment = file as unknown as {
                              filename?: string;
                              name?: string;
                              url?: string;
                            };
                            const filename =
                              typeof file === "string"
                                ? file.split("/").pop()
                                : attachment?.filename ||
                                  attachment?.name ||
                                  "Attachment";
                            const fileUrl =
                              typeof file === "string" ? file : attachment?.url;
                            return (
                              <a
                                key={idx}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-surface-container-low hover:bg-surface-container-high/80 border-outline-variant/40 flex items-center gap-1 rounded border px-2.5 py-1 transition-colors"
                              >
                                <Paperclip className="text-primary h-3 w-3" />
                                <span className="max-w-[150px] truncate">
                                  {filename}
                                </span>
                              </a>
                            );
                          })}

                          {task.comments?.length ? (
                            <div className="bg-surface-container-low border-outline-variant/40 flex items-center gap-1 rounded border px-2.5 py-1">
                              <MessageSquare className="text-primary h-3 w-3" />
                              <span>{task.comments.length} comments</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Floating Action Button */}
      {user?.role !== "member" && (
        <button className="bg-primary text-primary-foreground group fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95">
          <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
          <span className="bg-surface-container-high text-on-surface border-outline-variant pointer-events-none absolute right-16 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100">
            Create Task
          </span>
        </button>
      )}
    </div>
  );
}
