"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCreateCommentMutation,
  useGetActivityLogsQuery,
  useGetCommentsQuery,
  useGetTaskByIdQuery,
} from "@/redux/feature/tasks/tasksApi";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  AtSign,
  CornerDownRight,
  FileDown,
  FileText,
  MessageSquare,
  MoreVertical,
  Paperclip,
  PlusCircle,
  RefreshCw,
  Smile,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface CommentItem {
  _id: string;
  author: { name: string; avatar?: string };
  createdAt: string;
  body: string;
}

interface AttachmentItem {
  filename: string;
  url: string;
  uploadedAt: string;
}

interface ActivityLogItem {
  _id: string;
  user: { name: string };
  action: string;
  createdAt: string;
}

export default function MyProjectTaskDetailsView() {
  const params = useParams();
  const taskId = (params?.taskId as string) || "1";

  const { data: task, isLoading: isTaskLoading } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });
  const { data: commentsData } = useGetCommentsQuery(taskId, {
    skip: !taskId,
  });
  const { data: activityLogs } = useGetActivityLogsQuery(taskId, {
    skip: !taskId,
  });
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();
  useCreateCommentMutation();

  // State for adding a top-level comment
  const [newComment, setNewComment] = useState("");
  // State for a nested reply frame
  const [nestedReply, setNestedReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({
        taskId,
        data: { body: newComment },
      }).unwrap();
      setNewComment("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!nestedReply.trim()) return;
    try {
      await createComment({
        taskId,
        data: { body: nestedReply, parentComment: parentId },
      }).unwrap();
      setNestedReply("");
      setReplyingTo(null);
      toast.success("Reply added");
    } catch {
      toast.error("Failed to add reply");
    }
  };

  if (isTaskLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="text-on-surface container mx-auto min-h-screen">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Task Details & Collaboration Dashboard */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Main Content Task Card */}
          <div className="bg-surface border-border rounded-xl border p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h1 className="text-on-surface mb-3 text-xl font-bold tracking-tight md:text-3xl">
                  {task.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-success/10 text-success border-success/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase">
                    <span className="bg-success h-1.5 w-1.5 rounded-full" />
                    {task.status.replace("_", " ")}
                  </span>
                  <span className="bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase">
                    <span className="bg-destructive h-1.5 w-1.5 rounded-full" />
                    {task.priority} Priority
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2 self-end md:self-auto">
                <button className="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-95">
                  Edit Task
                </button>
                <button className="border-border bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant rounded-lg border p-2 transition-colors active:scale-95">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-outline-variant/30 grid grid-cols-2 gap-4 border-y py-6 md:grid-cols-4">
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Assignee
                </p>
                <div className="flex items-center gap-2">
                  {task.assignees?.[0] ? (
                    <>
                      <img
                        className="ring-outline-variant h-6 w-6 rounded-full object-cover ring-1"
                        alt={task.assignees[0].name}
                        src={
                          task.assignees[0].avatar ||
                          "https://ui-avatars.com/api/?name=" +
                            task.assignees[0].name
                        }
                      />
                      <span className="text-on-surface text-sm font-medium">
                        {task.assignees[0].name}
                      </span>
                    </>
                  ) : (
                    <span className="text-on-surface text-sm font-medium">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Reporter
                </p>
                <div className="flex items-center gap-2">
                  {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    task.reporter ? (
                      <>
                        <img
                          className="ring-outline-variant h-6 w-6 rounded-full object-cover ring-1"
                          alt={
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            task.reporter.name
                          }
                          src={
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            task.reporter.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              //@ts-ignore
                              task.reporter.name
                          }
                        />
                        <span className="text-on-surface text-sm font-medium">
                          {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            task.reporter.name
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-on-surface text-sm font-medium">
                        Unknown
                      </span>
                    )
                  }
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Due Date
                </p>
                <p className="text-on-surface text-sm font-semibold">
                  {task.dueDate
                    ? format(new Date(task.dueDate), "MMM dd, yyyy")
                    : "No due date"}
                </p>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Estimation
                </p>
                <p className="text-primary text-sm font-semibold">
                  {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    task.estimate
                      ? `${
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          task.estimate
                        } hours`
                      : "Not estimated"
                  }
                </p>
              </div>
            </div>

            {/* Task Description Body */}
            <div className="mt-8">
              <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-widest uppercase">
                Description
              </h3>
              <div className="text-on-surface-variant max-w-3xl space-y-4 text-sm leading-relaxed md:text-base">
                <p>{task.description || "No description provided."}</p>
              </div>
            </div>
          </div>

          {/* Collaborative Threaded Discussion Framework */}
          <div className="bg-surface border-border overflow-hidden rounded-xl border">
            <div className="border-border bg-surface-container-low/40 flex items-center justify-between border-b px-6 py-4 md:px-8">
              <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Collaboration & Discussion
              </h3>
              <div className="text-text-muted flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-semibold">14 Comments</span>
              </div>
            </div>

            <div className="space-y-8 p-6 md:p-8">
              {((commentsData as CommentItem[]) || []).map(
                (comment: CommentItem) => (
                  <div key={comment._id} className="flex gap-4">
                    <img
                      className="ring-outline-variant h-10 w-10 shrink-0 rounded-full object-cover ring-1"
                      alt={comment.author?.name || "User"}
                      src={
                        comment.author?.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          (comment.author?.name || "User")
                      }
                    />
                    <div className="flex-grow">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="text-on-surface text-sm font-bold">
                          {comment.author?.name || "Unknown User"}
                        </span>
                        <span className="text-text-muted text-xs">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-on-surface-variant mb-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.body}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment._id ? null : comment._id,
                            )
                          }
                          className="text-primary text-xs font-bold transition-all hover:underline"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Nested Replies Rendering could go here if parentComment is populated */}

                      {/* Active Nested Thread Sub-Input Frame */}
                      {replyingTo === comment._id && (
                        <div className="border-outline-variant mt-6 space-y-6 border-l-2 pl-4">
                          <div className="flex gap-3 pt-2">
                            <div className="bg-primary-container/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                              <CornerDownRight className="h-4 w-4" />
                            </div>
                            <div className="flex-grow">
                              <textarea
                                value={nestedReply}
                                onChange={(e) => setNestedReply(e.target.value)}
                                className="bg-background border-border focus:ring-primary focus:border-primary text-on-surface placeholder:text-text-muted min-h-[80px] w-full resize-none rounded-lg border p-3 text-sm outline-hidden focus:ring-1"
                                placeholder="Write a reply..."
                              />
                              <div className="mt-2 flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setNestedReply("");
                                    setReplyingTo(null);
                                  }}
                                  className="text-on-surface-variant hover:text-on-surface px-3 py-1.5 text-xs font-semibold transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReplySubmit(comment._id)}
                                  disabled={isCommenting}
                                  className="bg-primary text-on-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
              {(!commentsData ||
                (commentsData as CommentItem[]).length === 0) && (
                <div className="text-on-surface-variant text-center text-sm">
                  No comments yet. Be the first to start the discussion!
                </div>
              )}

              {/* Core Top Level Input Engine */}
              <div className="border-border flex gap-4 border-t pt-6">
                <div className="bg-surface-container-high ring-outline-variant h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1">
                  <img
                    alt="User profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuADc5j-WTZI1smaD418Pez6Rzoku8hANEYnYMwhecvG4q4IAe4RyF7qIIzMCi2aMtLhy5AKz24eQP66YqOFfeFGxQmUmXsVbY9m_DZ2jrNAwBpZy8qegjaDkOPW75c0kyKvKhbkkwtCVFy0RGGCwvXWUw6_ML04JHIA6w20J_0BgZDc3DFz5tCtpIfC8vsauuu8N5-DQJWHuOrw5_h1C80sJzQ_lJiePS7PO6XWHmKnfi5T5CZKyO26MYAssoYlaQxyuUdDteMr9EAz"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="bg-surface-container-low border-border focus-within:border-primary focus-within:ring-primary/30 rounded-xl border p-4 transition-all focus-within:ring-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-on-surface placeholder:text-text-muted w-full resize-none border-none bg-transparent text-sm outline-hidden focus:ring-0"
                      placeholder="Join the discussion..."
                      rows={3}
                    />
                    <div className="border-outline-variant/20 mt-4 flex items-center justify-between border-t pt-3">
                      <div className="flex gap-1">
                        <button className="text-text-muted hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="text-text-muted hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                          <AtSign className="h-4 w-4" />
                        </button>
                        <button className="text-text-muted hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                          <Smile className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={handleCommentSubmit}
                        disabled={isCommenting}
                        className="bg-primary text-on-primary border-primary/5 rounded-lg border px-5 py-2 text-xs font-bold transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Context & Activity Streams */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Quick Stats Context Module */}
          <div className="bg-surface border-border rounded-xl border p-6">
            <h3 className="text-on-surface-variant mb-6 text-xs font-bold tracking-widest uppercase">
              Task Details
            </h3>
            <div className="space-y-4">
              <div className="border-outline-variant/20 flex items-center justify-between border-b pb-3">
                <span className="text-text-muted text-sm font-medium">
                  Status
                </span>
                <span className="text-on-surface text-sm font-semibold uppercase">
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <div className="border-outline-variant/20 flex items-center justify-between border-b pb-3">
                <span className="text-text-muted text-sm font-medium">
                  Priority
                </span>
                <span className="text-destructive flex items-center gap-1.5 text-sm font-semibold uppercase">
                  <AlertCircle className="text-destructive h-4 w-4" />
                  {task.priority}
                </span>
              </div>
              <div className="border-outline-variant/20 flex items-center justify-between border-b pb-3">
                <span className="text-text-muted text-sm font-medium">
                  Sub-tasks
                </span>
                <span className="text-on-surface text-sm font-semibold">
                  {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    task.subtasks?.length || 0
                  }{" "}
                  Total
                </span>
              </div>
            </div>
          </div>

          {/* Attachments Document Matrix */}
          <div className="bg-surface border-border rounded-xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Attachments
              </h3>
              <button className="text-primary hover:text-primary-container hover:bg-surface-container rounded-md p-1 transition-colors">
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              task.attachments?.map((att: AttachmentItem, idx: number) => (
                <div
                  key={idx}
                  className="group hover:bg-surface-container-high/60 hover:border-outline-variant flex items-center gap-3 rounded-xl border-transparent p-2.5 transition-all"
                >
                  <div className="bg-surface-container-highest text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-on-surface truncate text-sm font-semibold">
                      {att.filename}
                    </p>
                    <p className="text-text-muted text-xs">
                      {formatDistanceToNow(new Date(att.uploadedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                  </a>
                </div>
              ))}
              {(!task.attachments || task.attachments.length === 0) && (
                <p className="text-on-surface-variant text-center text-sm">
                  No attachments yet.
                </p>
              )}
            </div>
          </div>

          {/* Activity Logs Timeline */}
          <div className="bg-surface border-border flex max-h-[600px] flex-col overflow-hidden rounded-xl border">
            <div className="border-border bg-surface-container-low/20 border-b p-6">
              <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Activity Log
              </h3>
            </div>

            <div className="custom-scrollbar flex-grow space-y-6 overflow-y-auto p-6">
              {((activityLogs as ActivityLogItem[]) || []).map(
                (log: ActivityLogItem, idx: number) => (
                  <div key={idx} className="relative flex gap-4">
                    {idx !==
                      ((activityLogs as ActivityLogItem[])?.length || 0) -
                        1 && (
                      <div className="bg-outline-variant absolute top-[24px] bottom-[-28px] left-[11px] w-[1px]" />
                    )}
                    <div className="bg-primary/20 border-primary/40 text-primary z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                      <RefreshCw className="h-3 w-3" />
                    </div>
                    <div className="pb-1">
                      <p className="text-on-surface text-sm">
                        <span className="font-bold">
                          {log.user?.name || "System"}
                        </span>{" "}
                        {log.action}
                      </p>
                      <p className="text-text-muted mt-1 text-xs">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ),
              )}
              {(!activityLogs ||
                (activityLogs as ActivityLogItem[]).length === 0) && (
                <div className="text-on-surface-variant text-center text-sm">
                  No activity recorded yet.
                </div>
              )}
            </div>

            <div className="border-border bg-surface-container-low/40 border-t p-4 text-center">
              <button className="text-primary text-xs font-bold transition-all hover:underline">
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
