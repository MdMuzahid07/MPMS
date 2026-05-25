"use client";

import { useGetSprintsQuery } from "@/redux/feature/sprints/sprintsApi";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/redux/feature/tasks/tasksApi";
import { useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  ExternalLink,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
      task.status === "review" &&
      newStatus === "done" &&
      user?.role === "member"
    ) {
      toast.error("Only managers can approve tasks from Review to Done.");
      return;
    }

    try {
      await updateTask({
        taskId: id,
        data: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          status: newStatus as "todo" | "in_progress" | "review" | "done",
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
            <button className="bg-primary text-on-primary-container inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all hover:brightness-110 active:scale-95">
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
              {tasksData?.length || 0}
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
            <p className="text-primary mt-1 text-2xl font-bold">6</p>
          </div>
          <div className="bg-surface-container-low border-outline-variant flex flex-col justify-between rounded-xl border p-4">
            <p className="text-on-surface-variant text-xs font-medium tracking-tighter uppercase">
              Sprint Health
            </p>
            <div className="bg-surface-variant mt-3 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-accent-linear-lime h-full w-[65%] rounded-full border-[0_0_8px_rgba(228,242,34,0.4)]" />
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
        <div className="border-outline-variant bg-surface-container-lowest overflow-hidden rounded-xl border">
          {/* Task Table Header */}
          <div className="border-outline-variant bg-surface-container-low text-on-surface-variant grid hidden grid-cols-12 gap-4 border-b px-6 py-4 text-xs font-bold tracking-wider uppercase md:grid">
            <div className="col-span-6">Task Title</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Estimate</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Task Rows */}
          {filteredTasks.length === 0 ? (
            <div className="text-on-surface-variant p-8 text-center text-sm">
              No tasks found.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isExpanded = !!expandedTasks[task._id];
              return (
                <div
                  key={task._id}
                  className="group border-outline-variant border-b last:border-0"
                >
                  <div
                    onClick={() => toggleTaskDetails(task._id)}
                    className="hover:bg-surface-container/60 grid cursor-pointer grid-cols-12 items-center gap-4 px-4 py-5 transition-colors md:px-6"
                  >
                    {/* Title Cell */}
                    <div className="col-span-12 flex items-center gap-3 md:col-span-6">
                      <span className="text-on-surface-variant shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="text-primary h-4 w-4" />
                        ) : (
                          <ChevronRight className="group-hover:text-primary h-4 w-4 transition-colors" />
                        )}
                      </span>
                      <span className="text-on-surface group-hover:text-primary/90 text-sm font-semibold transition-colors md:text-base">
                        {task.title}
                      </span>
                    </div>

                    {/* Badge Cell */}
                    <div className="col-span-4 md:col-span-2">
                      <span
                        className={`flex w-fit items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          task.priority === "high" || task.priority === "urgent"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : task.priority === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-secondary-container/50 text-on-secondary-container border-outline-variant"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            task.priority === "high" ||
                            task.priority === "urgent"
                              ? "bg-destructive"
                              : task.priority === "medium"
                                ? "bg-warning"
                                : "bg-secondary"
                          }`}
                        />
                        {task.priority}
                      </span>
                    </div>

                    {/* Estimation Hours Cell */}
                    <div className="text-on-surface-variant col-span-4 text-xs font-medium md:col-span-2 md:text-sm">
                      {task.estimateHours
                        ? `${task.estimateHours} hours`
                        : "--"}
                    </div>

                    {/* Status Select Cell */}
                    <div
                      className="col-span-4 md:col-span-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="bg-surface-container-high text-on-surface focus:ring-primary w-full cursor-pointer rounded border-none px-2.5 py-1 text-xs outline-hidden focus:ring-1"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>

                  {/* Expandable Details Frame */}
                  {isExpanded && (
                    <div className="bg-surface-container/20 text-on-surface-variant animate-in fade-in px-10 pt-1 pb-5 text-sm transition-all duration-200 md:px-14">
                      <div className="max-w-3xl space-y-4">
                        <p className="leading-relaxed">
                          {task.description || "No description provided."}
                        </p>

                        {(task.attachments?.length ||
                          task.comments?.length ||
                          true) && (
                          <div className="text-on-surface-variant/80 flex flex-wrap items-center gap-4 pt-3 text-xs">
                            <button
                              onClick={() =>
                                router.push(
                                  `/my-projects/${projectId}/sprints/${sprintId}/tasks/${task._id}`,
                                )
                              }
                              className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 flex items-center gap-1.5 rounded border px-3 py-1 font-bold transition-all"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>View Task Details</span>
                            </button>

                            {task.attachments?.map((file, idx) => (
                              <div
                                key={idx}
                                className="bg-surface-container-low border-outline-variant/40 flex items-center gap-1 rounded border px-2 py-1"
                              >
                                <Paperclip className="text-primary h-3.5 w-3.5" />
                                <span className="max-w-[150px] truncate">
                                  {file.split("/").pop()}
                                </span>
                              </div>
                            ))}
                            {task.comments?.length ? (
                              <div className="bg-surface-container-low border-outline-variant/40 flex items-center gap-1 rounded border px-2 py-1">
                                <MessageSquare className="text-primary h-3.5 w-3.5" />
                                <span>{task.comments.length} comments</span>
                              </div>
                            ) : null}
                          </div>
                        )}
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
      <button className="bg-primary text-on-primary-container group fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95">
        <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
        <span className="bg-surface-container-high text-on-surface border-outline-variant pointer-events-none absolute right-16 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100">
          Create Task
        </span>
      </button>
    </div>
  );
}
