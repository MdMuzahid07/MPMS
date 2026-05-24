"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FilePenLine, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCanvas } from "@/components/features/tasks";
import type { TaskItem } from "@/components/features/tasks/task.types";

const INITIAL_SPRINT_TASKS = (
  projectId: string,
  sprintId: string,
): TaskItem[] => [
  {
    id: "sprint-t1",
    title: "Refactor Auth Middleware for Session Caching",
    code: "CP-102",
    project: "Core Platform",
    sprint: "Q4.2 Sprint",
    assignee: "Alex Rivers",
    priority: "High",
    status: "Progress",
    dueDate: "Oct 22, 2023",
    projectId,
    sprintId,
    taskId: "task-102",
  },
  {
    id: "sprint-t2",
    title: "Implement Real-time Sync across instances",
    code: "CP-105",
    project: "Core Platform",
    sprint: "Q4.2 Sprint",
    assignee: "Sarah Chen",
    priority: "Medium",
    status: "To Do",
    dueDate: "Oct 24, 2023",
    projectId,
    sprintId,
    taskId: "task-105",
  },
  {
    id: "sprint-t3",
    title: "Design System Audit & Web Accessibility Review",
    code: "CP-092",
    project: "Core Platform",
    sprint: "Q4.2 Sprint",
    assignee: "Sarah Chen",
    priority: "Low",
    status: "Done",
    dueDate: "Oct 15, 2023",
    projectId,
    sprintId,
    taskId: "task-092",
  },
  {
    id: "sprint-t4",
    title: "API Documentation Update and Swagger Sync",
    code: "CP-110",
    project: "Core Platform",
    sprint: "Q4.2 Sprint",
    assignee: "Alex Rivers",
    priority: "Medium",
    status: "Review",
    dueDate: "Oct 20, 2023",
    projectId,
    sprintId,
    taskId: "task-110",
  },
];

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
    <article className="border-border/60 rounded-xl border bg-[#111118] p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {title}
        </p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#1b1b23]">
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

  return (
    <div className="animate-in fade-in w-full space-y-6 pb-8 duration-300">
      {/* Breadcrumb & Navigation */}
      <section className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
          <span>Projects</span>
          <ChevronRight className="size-3" />
          <span>Core Platform</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Q4.2 - Core Features
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <Badge className="border-success/20 bg-success/10 text-success h-6 rounded-full border px-2.5 text-[10px] font-bold">
                Active Sprint
              </Badge>
              <span className="text-muted-foreground font-medium">
                Oct 12 - Oct 26
              </span>
              <span className="text-muted-foreground font-medium">
                • 12 Team Members
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
          accentClass="bg-warning"
        />
        <article className="border-border/60 rounded-xl border bg-[#111118] p-5 shadow-sm">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Blockers
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-destructive text-3xl font-extrabold">2</span>
            <span className="text-muted-foreground pb-0.5 text-[10px] font-bold tracking-wider uppercase">
              CRITICAL BLOCKERS
            </span>
          </div>
          <div className="mt-4 flex -space-x-1.5">
            <span className="bg-primary/20 text-primary border-primary/30 inline-flex size-6 items-center justify-center rounded-full border text-[9px] font-bold tracking-wider">
              JR
            </span>
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 text-[9px] font-bold tracking-wider text-amber-500">
              AK
            </span>
          </div>
        </article>
      </section>

      {/* Shareable TaskCanvas dual view switcher */}
      <section>
        <TaskCanvas
          initialTasks={INITIAL_SPRINT_TASKS(id, sprintId)}
          title="Sprint Work Canvas"
          subtitle="Toggle views to track sprint items and update priorities."
        />
      </section>
    </div>
  );
}
