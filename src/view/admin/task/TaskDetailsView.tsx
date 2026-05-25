"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetActivityLogsQuery,
} from "@/redux/feature/tasks/tasksApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileDown,
  Paperclip,
  AlertCircle,
  Loader2,
  Users,
  CheckSquare,
  Square,
  BadgeAlert,
  ClipboardList,
  MessageSquare,
  Trash2,
  Send,
  History,
  CheckCircle,
} from "lucide-react";

type TaskDetailsViewProps = {
  params: {
    id: string;
    sprintId: string;
    taskId: string;
  };
  showEdit?: boolean;
};

export default function TaskDetailsView({
  params,
  showEdit = true,
}: TaskDetailsViewProps) {
  const router = useRouter();
  const {
    data: taskData,
    isLoading,
    error,
  } = useGetTaskByIdQuery(params.taskId);
  const [updateTask] = useUpdateTaskMutation();

  // Dynamic comments and activity logs queries
  const { data: comments = [] } = useGetCommentsQuery(params.taskId);
  const { data: activityLogs = [] } = useGetActivityLogsQuery(params.taskId);

  const [createComment, { isLoading: isPostingComment }] =
    useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [commentText, setCommentText] = useState("");

  // Unpack task data safely
  const task = (taskData as any)?.data || taskData;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        taskId: params.taskId,
        data: { body: commentText.trim() },
      }).unwrap();
      setCommentText("");
      toast.success("Comment added successfully.");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ taskId: params.taskId, commentId }).unwrap();
      toast.success("Comment deleted successfully.");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="border-primary/20 border-t-primary h-16 w-16 animate-spin rounded-full border-4"></div>
          <Loader2 className="text-primary absolute h-6 w-6 animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse text-sm font-semibold tracking-wider uppercase">
          Retrieving Task Details...
        </p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto flex h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-full border p-4">
          <AlertCircle className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          Unable to Load Task
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We couldn&apos;t load the details for this task. It might have been
          deleted, or there could be a temporary issue with the server.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="border-border hover:bg-muted mt-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Pre-formatted labels and classes
  const statusLabels: Record<string, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    REVIEW: "In Review",
    DONE: "Done",
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20",
    MEDIUM:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/20",
    HIGH: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/20",
    CRITICAL: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/20",
  };

  const statusColors: Record<string, string> = {
    TODO: "bg-secondary/45 text-muted-foreground border-border",
    IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
    REVIEW:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/20",
    DONE: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/20",
  };

  // Toggle subtask status
  const handleToggleSubtask = async (
    subtaskId: string,
    currentDone: boolean,
  ) => {
    try {
      const updatedSubtasks =
        task.subtasks?.map((st: any) => {
          if (st._id === subtaskId) {
            return { title: st.title, completed: !currentDone };
          }
          return { title: st.title, completed: st.completed };
        }) ?? [];

      await updateTask({
        taskId: params.taskId,
        data: {
          subtasks: updatedSubtasks,
        },
      }).unwrap();
      toast.success("Subtask status updated.");
    } catch (err) {
      console.error("Subtask toggle error:", err);
      toast.error("Failed to update subtask.");
    }
  };

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((st: any) => st.completed).length || 0;
  const completionPercentage =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto space-y-8 px-4 py-8 duration-500">
      {/* Top action row */}
      <div className="border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
            <Link
              href={
                showEdit
                  ? `/projects/${params.id}`
                  : `/my-projects/${params.id}`
              }
              className="hover:text-primary transition-colors"
            >
              Project
            </Link>
            <span>/</span>
            <Link
              href={
                showEdit
                  ? `/projects/${params.id}/sprints/${params.sprintId}`
                  : `/my-projects/${params.id}/sprints/${params.sprintId}`
              }
              className="hover:text-primary transition-colors"
            >
              Sprint Details
            </Link>
            <span>/</span>
            <span className="text-foreground font-bold">Task Info</span>
          </div>
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Task {task.taskNumber ? `#${task.taskNumber}` : ""}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="border-border hover:bg-muted font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {showEdit && (
            <Link
              href={`/projects/${params.id}/sprints/${params.sprintId}/tasks/${params.taskId}/edit`}
            >
              <Button
                size="sm"
                className="bg-primary text-primary-foreground px-4 font-semibold transition-all hover:brightness-105"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Task
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left main info column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Main Title and Description card */}
          <div className="border-border bg-card/40 space-y-6 rounded-2xl border p-6 backdrop-blur-xs md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                    statusColors[task.status] ||
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${task.status === "DONE" ? "bg-green-500" : task.status === "IN_PROGRESS" ? "bg-primary" : "bg-muted-foreground"}`}
                  />
                  {statusLabels[task.status] || task.status}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                    priorityColors[task.priority] ||
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  <BadgeAlert className="h-3.5 w-3.5" />
                  {task.priority} Priority
                </span>
              </div>
              <h2 className="text-foreground text-2xl leading-snug font-extrabold tracking-tight break-words whitespace-pre-wrap md:text-3xl">
                {task.title}
              </h2>
            </div>

            <div className="border-border/60 space-y-3 border-t pt-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <ClipboardList className="text-primary h-4 w-4" />
                Description
              </h3>
              <div className="text-muted-foreground bg-muted/15 border-border/30 rounded-xl border p-4 text-sm leading-relaxed break-words whitespace-pre-wrap md:text-base">
                {task.description || "No description provided for this task."}
              </div>
            </div>
          </div>

          {/* Subtasks checklist section */}
          <div className="border-border bg-card/40 space-y-6 rounded-2xl border p-6 backdrop-blur-xs md:p-8">
            <div className="space-y-4">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <CheckSquare className="text-primary h-4 w-4" />
                  Subtasks Checklist
                </h3>
                <span className="text-primary bg-primary/10 border-primary/20 animate-pulse rounded-full border px-3 py-1 text-xs font-bold">
                  {completedSubtasks} / {totalSubtasks} Completed
                </span>
              </div>

              {totalSubtasks > 0 && (
                <div className="space-y-2">
                  <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
                    <span>Progress</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="bg-secondary border-border/40 h-2 w-full overflow-hidden rounded-full border">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {task.subtasks && task.subtasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {task.subtasks.map((st: any, idx: number) => (
                  <div
                    key={st._id || idx}
                    onClick={() => handleToggleSubtask(st._id, !!st.completed)}
                    className={`flex cursor-pointer items-center gap-4.5 rounded-xl border p-4 transition-all duration-200 ${
                      st.completed
                        ? "border-green-500/20 bg-green-500/[0.02] hover:bg-green-500/[0.04]"
                        : "border-border bg-muted/10 hover:bg-muted/40"
                    }`}
                  >
                    <div className="shrink-0 transition-transform active:scale-90">
                      {st.completed ? (
                        <CheckSquare className="h-5.5 w-5.5 text-green-500 transition-colors" />
                      ) : (
                        <Square className="text-muted-foreground/60 h-5.5 w-5.5 transition-colors" />
                      )}
                    </div>
                    <span
                      className={`text-sm leading-relaxed font-semibold break-words whitespace-pre-wrap ${
                        st.completed
                          ? "text-muted-foreground/70 line-through"
                          : "text-foreground"
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-border/60 flex flex-col items-center justify-center rounded-xl border-dashed p-8 text-center">
                <ClipboardList className="text-muted-foreground/40 mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm font-medium italic">
                  No subtasks defined for this task.
                </p>
              </div>
            )}
          </div>

          {/* Dynamic Collaborative Discussion Engine */}
          <div className="border-border bg-card/40 space-y-6 rounded-2xl border p-6 backdrop-blur-xs md:p-8">
            <div className="border-border/60 flex items-center justify-between border-b pb-3">
              <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <MessageSquare className="text-primary h-4.5 w-4.5" />
                Discussion Board
              </h3>
              <span className="text-primary bg-primary/10 border-primary/20 rounded-full border px-3 py-1 text-xs font-bold">
                {comments.length} Comments
              </span>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: any) => {
                  const author = comment.author || { name: "Team Member" };
                  return (
                    <div
                      key={comment._id}
                      className="border-border/30 bg-muted/5 group hover:bg-muted/10 flex gap-4 rounded-xl border p-4 transition-colors"
                    >
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="h-9 w-9 shrink-0 rounded-full border object-cover"
                        />
                      ) : (
                        <div className="bg-primary/10 border-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold">
                          {author.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-foreground truncate text-sm font-bold">
                            {author.name}
                          </span>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {comment.body}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-secondary shrink-0 self-start rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm italic">
                No comments posted yet. Start the conversation below!
              </p>
            )}

            {/* Input Form */}
            <form
              onSubmit={handlePostComment}
              className="border-border/40 flex gap-3 border-t pt-4"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                disabled={isPostingComment}
                className="bg-muted/20 border-border/50 text-foreground focus:ring-primary placeholder:text-muted-foreground flex-grow rounded-xl border px-4 py-2.5 text-sm focus:ring-1 focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isPostingComment || !commentText.trim()}
                className="bg-primary shrink-0 rounded-xl px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right contextual meta column */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="border-border bg-card/40 space-y-5 rounded-2xl border p-6 backdrop-blur-xs">
            <h3 className="text-muted-foreground border-border/60 border-b pb-3 text-xs font-bold tracking-widest uppercase">
              Task Details
            </h3>

            <div className="space-y-4">
              <div className="border-border/20 flex items-center justify-between border-b py-1 text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-semibold">
                  <Clock className="text-primary h-4 w-4" />
                  Estimation
                </span>
                <span className="text-foreground bg-secondary/60 border-border/40 rounded-md border px-2.5 py-1 font-extrabold">
                  {task.estimate ? `${task.estimate} Hours` : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-semibold">
                  <Calendar className="text-primary h-4 w-4" />
                  Due Date
                </span>
                <span className="text-foreground bg-secondary/60 border-border/40 rounded-md border px-2.5 py-1 font-extrabold">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </span>
              </div>
            </div>
          </div>

          {/* Assignees Card */}
          <div className="border-border bg-card/40 space-y-4 rounded-2xl border p-6 backdrop-blur-xs">
            <h3 className="text-muted-foreground border-border/60 flex items-center gap-2 border-b pb-3 text-xs font-bold tracking-widest uppercase">
              <Users className="text-primary h-4.5 w-4.5" />
              Assignees
            </h3>

            {task.assignees && task.assignees.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {task.assignees.map((user: any, idx: number) => {
                  const resolvedUser =
                    typeof user === "string" ? { name: "Team Member" } : user;
                  return (
                    <div
                      key={resolvedUser._id || idx}
                      className="border-border/30 bg-muted/5 flex items-center gap-3 rounded-xl border p-2"
                    >
                      {resolvedUser.avatar ? (
                        <img
                          src={resolvedUser.avatar}
                          alt={resolvedUser.name}
                          className="border-border ring-primary/5 h-9 w-9 shrink-0 rounded-full border object-cover ring-2"
                        />
                      ) : (
                        <div className="bg-primary/10 border-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold">
                          {resolvedUser.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-foreground mb-1 truncate text-sm leading-none font-bold">
                          {resolvedUser.name}
                        </p>
                        {resolvedUser.email && (
                          <p className="text-muted-foreground truncate text-xs leading-none">
                            {resolvedUser.email}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm font-medium italic">
                No assignees assigned.
              </p>
            )}
          </div>

          {/* Attachments Card */}
          <div className="border-border bg-card/40 space-y-4 rounded-2xl border p-6 backdrop-blur-xs">
            <h3 className="text-muted-foreground border-border/60 flex items-center gap-2 border-b pb-3 text-xs font-bold tracking-widest uppercase">
              <Paperclip className="text-primary h-4.5 w-4.5" />
              Attachments
            </h3>

            {task.attachments && task.attachments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {task.attachments.map((att: any, idx: number) => (
                  <div
                    key={att._id || idx}
                    className="border-border/40 bg-muted/15 hover:bg-muted/30 flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors"
                  >
                    <div className="min-w-0 flex-grow">
                      <p className="text-foreground truncate text-sm font-bold break-all whitespace-nowrap">
                        {att.filename || "Attachment"}
                      </p>
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:bg-secondary border-border/40 shrink-0 rounded-lg border p-2 transition-colors"
                    >
                      <FileDown className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-border/60 flex flex-col items-center justify-center rounded-xl border-dashed p-6 text-center">
                <Paperclip className="text-muted-foreground/30 mb-1 h-6 w-6" />
                <p className="text-muted-foreground text-xs font-medium italic">
                  No attachments uploaded.
                </p>
              </div>
            )}
          </div>

          {/* Dynamic Task Activity Log Timeline */}
          <div className="border-border bg-card/40 space-y-4 rounded-2xl border p-6 backdrop-blur-xs">
            <h3 className="text-muted-foreground border-border/60 flex items-center gap-2 border-b pb-3 text-xs font-bold tracking-widest uppercase">
              <History className="text-primary h-4.5 w-4.5" />
              Activity Log
            </h3>

            {activityLogs.length > 0 ? (
              <div className="border-border/60 relative space-y-4 border-l pl-4 text-xs">
                {activityLogs.slice(0, 5).map((log: any) => {
                  const user = log.user || { name: "Team Member" };
                  return (
                    <div key={log._id} className="relative space-y-1">
                      <div className="bg-primary ring-card absolute top-1.5 -left-[21px] h-2 w-2 rounded-full ring-4" />
                      <p className="text-foreground">
                        <span className="font-bold">{user.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {log.detail || log.action}
                        </span>
                      </p>
                      <p className="text-muted-foreground/80 text-[10px]">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border-border/60 flex flex-col items-center justify-center rounded-xl border-dashed p-6 text-center">
                <CheckCircle className="text-muted-foreground/30 mb-1 h-5 w-5" />
                <p className="text-muted-foreground text-xs font-medium italic">
                  No activities logged yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
