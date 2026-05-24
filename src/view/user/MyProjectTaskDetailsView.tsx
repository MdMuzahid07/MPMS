"use client";

/* eslint-disable @next/next/no-img-element */

import {
  AlertCircle,
  AtSign,
  CornerDownRight,
  Edit3,
  FileDown,
  FileText,
  FolderArchive,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  PlusCircle,
  RefreshCw,
  Smile,
  ThumbsUp,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
}

export default function MyProjectTaskDetailsView() {
  // State for adding a top-level comment
  const [newComment, setNewComment] = useState("");
  // State for a nested reply frame
  const [nestedReply, setNestedReply] = useState("");

  // Local active comment track
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c-1",
      author: "Alex Rivers",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK8Bn-I5wiuSwk3EVrZaA3zNs3tjqhViNunK6V6ihQ_qmIG8nvrdGdUtAiNcrg_jQwBfiV_iVq-WHstmJJwQ92ssILsEcdfNV5Dz2nTUQyyzD1E70ADvBjPBK_yIh179V4lL6ruLLIzG76-07bWDrGu_nrMIIKprLWK-8E_DK8ksFgHgacDWZaFGkknLP8aIHWJ6TsBrJZKJWK4qvZNxmD-oFpIZET_NYc8euI0fmlT0iBKW11OnqpLVS0c5xhK8sXBYXT9_Sm0Wfh",
      timestamp: "2 hours ago",
      content:
        "I've started the initial benchmarking. The bottleneck is definitely in the `verifySession` hook. It's hitting the Postgres DB for user preferences every single time.",
      likes: 3,
      hasLiked: false,
    },
  ]);

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
            hasLiked: !c.hasLiked,
          };
        }
        return c;
      }),
    );
  };

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
                  Refactor API middleware for performance optimization
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-success/10 text-success border-success/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                    <span className="bg-success h-1.5 w-1.5 rounded-full" />
                    In Progress
                  </span>
                  <span className="bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                    <span className="bg-destructive h-1.5 w-1.5 rounded-full" />
                    High Priority
                  </span>
                  <span className="bg-surface-container-high text-on-surface-variant border-outline-variant rounded-full border px-3 py-1 text-xs font-medium">
                    Backend
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

            {/* Meta Assignments Grid */}
            <div className="border-outline-variant/30 grid grid-cols-2 gap-4 border-y py-6 md:grid-cols-4">
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Assignee
                </p>
                <div className="flex items-center gap-2">
                  <img
                    className="ring-outline-variant h-6 w-6 rounded-full ring-1"
                    alt="Alex Rivers"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDq_EzAq-smo93c5spQ7oxkHceQc_TzJh-Hdl0-zec4Eb9Hzx2O3tPMtAI1VOiES0snaG_3X_CHu2NrNuNhE8Rhypacv2b2R9OM53Kis_pGSB5FHnKbA3L_I_rwIscjNbhwA3faIKqt80QnGZaL_eA_0AXejdE-hKW90RC8vb4YWWhtpgqXU0rEXNfP0KUzVGdgAmJpG_9K_K-TSSMmwyM4hlWs9n7zpJbPWggP7Z2KXAZiED_-bZIXd7MJhRLzfzXMKmhHhbgx7wo"
                  />
                  <span className="text-on-surface text-sm font-medium">
                    Alex Rivers
                  </span>
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Reporter
                </p>
                <div className="flex items-center gap-2">
                  <img
                    className="ring-outline-variant h-6 w-6 rounded-full ring-1"
                    alt="Sarah Chen"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4UJcTexpe7ZGNpgNQIT5skooLfjOD-H_E_JLO4zrTPPw3KYfr2gwUl1iCjD_ddvVzy0Lw0bMZESTn--F2wlWtIjcMeNTtHQSiJ8b0EPUIfG6Kkdrxfx5_s8BxFTNtKCr6zuEQuFXFoeDFOvoeMa2hbAFmHFllXB10f3-C6Yy3Gplps1G40t9QjG64kJ8AtFGq0z8v3j0TVDIBpagVDo-WZVdQ4ig_1m7AjwxNJpruRSJForVTySO8NDXdzjBqDQRFdYFRvxqCJiQJ"
                  />
                  <span className="text-on-surface text-sm font-medium">
                    Sarah Chen
                  </span>
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Due Date
                </p>
                <p className="text-on-surface text-sm font-semibold">
                  Oct 24, 2023
                </p>
              </div>
              <div>
                <p className="text-text-muted mb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  Estimation
                </p>
                <p className="text-primary text-sm font-semibold">
                  12 Story Points
                </p>
              </div>
            </div>

            {/* Task Description Body */}
            <div className="mt-8">
              <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-widest uppercase">
                Description
              </h3>
              <div className="text-on-surface-variant max-w-3xl space-y-4 text-sm leading-relaxed md:text-base">
                <p>
                  We need to address the bottleneck in the authentication layer.
                  Current middleware implementation performs redundant database
                  lookups on every sub-request within the same session context.
                </p>
                <p className="text-on-surface font-medium">
                  Goals for this refactor:
                </p>
                <ul className="text-on-surface/80 list-disc space-y-2 pl-5">
                  <li>
                    Implement Redis-based session caching for frequent metadata.
                  </li>
                  <li>Reduce latency by approximately 45ms per request.</li>
                  <li>
                    Simplify the error handling logic to ensure standardized
                    responses.
                  </li>
                </ul>
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
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img
                    className="ring-outline-variant h-10 w-10 shrink-0 rounded-full object-cover ring-1"
                    alt={comment.author}
                    src={comment.avatar}
                  />
                  <div className="flex-grow">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="text-on-surface text-sm font-bold">
                        {comment.author}
                      </span>
                      <span className="text-text-muted text-xs">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-on-surface-variant mb-3 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="text-primary text-xs font-bold transition-all hover:underline">
                        Reply
                      </button>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`hover:bg-surface-container flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                          comment.hasLiked
                            ? "text-primary font-bold"
                            : "text-text-muted hover:text-on-surface"
                        }`}
                      >
                        <ThumbsUp
                          className={`h-3.5 w-3.5 ${comment.hasLiked ? "fill-current" : ""}`}
                        />
                        <span>{comment.likes}</span>
                      </button>
                    </div>

                    {/* Nested Reply UI Trace */}
                    <div className="border-outline-variant mt-6 space-y-6 border-l-2 pl-4">
                      <div className="flex gap-4">
                        <img
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                          alt="Mark J."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmGWm-kSozVV5aUdtJlF4rcNveysMwZRhH0PuRzReQbUpGA8uwd0yc4qSRyHUr6s99HgsIH8JHaerghv619xXqOBC6D_HEiWY30NUc8d0a1d3an-eYXRWmiZgTTDfFZv-DOXNn0hZ_PHNm2DB87wrgh377f_AYRbxz3_tk5w45JSieVEZJek_801-NxHLFYqyzXFfRxuv34VSYsoU7ibAIDB5g4NaxfMlvsm_eOiIA4RCpoYN_8h_OYyCZ3kVavOk_hcIDgHZSydgc"
                        />
                        <div className="flex-grow">
                          <div className="mb-1 flex items-center gap-3">
                            <span className="text-on-surface text-sm font-bold">
                              Mark J.
                            </span>
                            <span className="text-text-muted text-xs">
                              1 hour ago
                            </span>
                          </div>
                          <p className="text-on-surface-variant mb-2 text-sm leading-relaxed">
                            Have we considered using a LRU cache instead of
                            Redis for the user preference part? It&apos;s
                            relatively static data.
                          </p>
                          <button className="text-primary text-xs font-bold transition-all hover:underline">
                            Reply
                          </button>
                        </div>
                      </div>

                      {/* Active Nested Thread Sub-Input Frame */}
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
                              onClick={() => setNestedReply("")}
                              className="text-on-surface-variant hover:text-on-surface px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                              Cancel
                            </button>
                            <button className="bg-primary text-on-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:brightness-105 active:scale-95">
                              Post Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

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
                      <button className="bg-primary text-on-primary shadow-primary/5 rounded-lg px-5 py-2 text-xs font-bold shadow-md transition-all hover:brightness-105 active:scale-95">
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
                <span className="text-on-surface text-sm font-semibold">
                  In Progress
                </span>
              </div>
              <div className="border-outline-variant/20 flex items-center justify-between border-b pb-3">
                <span className="text-text-muted text-sm font-medium">
                  Priority
                </span>
                <span className="text-destructive flex items-center gap-1.5 text-sm font-semibold">
                  <AlertCircle className="text-destructive h-4 w-4" />
                  High
                </span>
              </div>
              <div className="border-outline-variant/20 flex items-center justify-between border-b pb-3">
                <span className="text-text-muted text-sm font-medium">
                  Component
                </span>
                <span className="text-on-surface text-sm font-semibold">
                  Authentication
                </span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-text-muted text-sm font-medium">
                  Sub-tasks
                </span>
                <span className="bg-surface-container-high text-primary rounded-md px-2 py-0.5 text-xs font-bold">
                  4 / 9 Done
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
              {/* Image Item */}
              <div className="group hover:bg-surface-container-high/60 hover:border-outline-variant flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all">
                <div className="bg-surface-container-highest text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-on-surface truncate text-sm font-semibold">
                    ui_mockup_v1.png
                  </p>
                  <p className="text-text-muted text-xs">
                    2.4 MB • Oct 22, 2023
                  </p>
                </div>
                <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                  <FileDown className="h-4 w-4" />
                </button>
              </div>

              {/* PDF Item */}
              <div className="group hover:bg-surface-container-high/60 hover:border-outline-variant flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all">
                <div className="bg-surface-container-highest text-error flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-on-surface truncate text-sm font-semibold">
                    specification_doc.pdf
                  </p>
                  <p className="text-text-muted text-xs">
                    840 KB • Oct 21, 2023
                  </p>
                </div>
                <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                  <FileDown className="h-4 w-4" />
                </button>
              </div>

              {/* Archive Item */}
              <div className="group hover:bg-surface-container-high/60 hover:border-outline-variant flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all">
                <div className="bg-surface-container-highest text-warning flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <FolderArchive className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-on-surface truncate text-sm font-semibold">
                    assets_bundle.zip
                  </p>
                  <p className="text-text-muted text-xs">
                    15.2 MB • Oct 20, 2023
                  </p>
                </div>
                <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg p-2 transition-colors">
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
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
              {/* Log Item 1 */}
              <div className="relative flex gap-4">
                <div className="bg-outline-variant absolute top-[24px] bottom-[-28px] left-[11px] w-[1px]" />
                <div className="bg-primary/20 border-primary/40 text-primary z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                  <RefreshCw className="h-3 w-3" />
                </div>
                <div className="pb-1">
                  <p className="text-on-surface text-sm">
                    <span className="font-bold">Alex Rivers</span> changed
                    status to{" "}
                    <span className="text-success font-semibold">
                      In Progress
                    </span>
                  </p>
                  <p className="text-text-muted mt-1 text-xs">10 minutes ago</p>
                </div>
              </div>

              {/* Log Item 2 */}
              <div className="relative flex gap-4">
                <div className="bg-outline-variant absolute top-[24px] bottom-[-28px] left-[11px] w-[1px]" />
                <div className="bg-tertiary/20 border-tertiary/40 text-tertiary z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                  <Edit3 className="h-3 w-3" />
                </div>
                <div className="pb-1">
                  <p className="text-on-surface text-sm">
                    <span className="font-bold">Sarah Chen</span> updated the
                    task description
                  </p>
                  <p className="text-text-muted mt-1 text-xs">2 hours ago</p>
                </div>
              </div>

              {/* Log Item 3 */}
              <div className="relative flex gap-4">
                <div className="bg-outline-variant absolute top-[24px] bottom-[-28px] left-[11px] w-[1px]" />
                <div className="bg-surface-container-high border-outline-variant text-on-surface-variant z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                  <Plus className="h-3 w-3" />
                </div>
                <div className="pb-1">
                  <p className="text-on-surface text-sm">
                    <span className="font-bold">System</span> added attachment:{" "}
                    <span className="text-primary cursor-pointer font-medium hover:underline">
                      benchmark_v1.json
                    </span>
                  </p>
                  <p className="text-text-muted mt-1 text-xs">4 hours ago</p>
                </div>
              </div>

              {/* Log Item 4 */}
              <div className="relative flex gap-4">
                <div className="bg-primary/20 border-primary/40 text-primary z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                  <UserPlus className="h-3 w-3" />
                </div>
                <div className="pb-1">
                  <p className="text-on-surface text-sm">
                    <span className="font-bold">Sarah Chen</span> assigned task
                    to Alex Rivers
                  </p>
                  <p className="text-text-muted mt-1 text-xs">
                    Yesterday at 4:32 PM
                  </p>
                </div>
              </div>
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
