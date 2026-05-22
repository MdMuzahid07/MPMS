"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bolt,
  BriefcaseBusiness,
  CircleAlert,
  Clock3,
  FileText,
  Funnel,
  ListChecks,
  TrendingUp,
} from "lucide-react";

type StatCard = {
  title: string;
  value: string;
  tag: string;
  icon: React.ReactNode;
  tagTone: string;
};

type ProjectRow = {
  name: string;
  health: "Healthy" | "At Risk";
  progress: number;
};

type FocusItem = {
  title: string;
  description: string;
  badge: string;
  meta: string;
  tone: "warning" | "compliance" | "people";
};

const statCards: StatCard[] = [
  {
    title: "Total Projects",
    value: "42",
    tag: "+12.5%",
    icon: <BriefcaseBusiness className="size-4" />,
    tagTone:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  },
  {
    title: "Active Sprints",
    value: "18",
    tag: "Active",
    icon: <Bolt className="size-4" />,
    tagTone:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  },
  {
    title: "Open Tasks",
    value: "156",
    tag: "8 Pending",
    icon: <ListChecks className="size-4" />,
    tagTone:
      "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20",
  },
  {
    title: "Resource Utilization",
    value: "94%",
    tag: "Optimal",
    icon: <BarChart3 className="size-4" />,
    tagTone:
      "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
  },
];

const projectRows: ProjectRow[] = [
  { name: "Phoenix Infrastructure V2", health: "Healthy", progress: 78 },
  { name: "Nebula Cloud Migration", health: "At Risk", progress: 42 },
  { name: "Data Lake Optimization", health: "Healthy", progress: 92 },
  { name: "Edge Node Deployment", health: "Healthy", progress: 15 },
];

const focusItems: FocusItem[] = [
  {
    title: "Review Q3 Budget Allocation",
    description:
      "Infrastructure costs exceeded threshold by 14% this month. Manage approval required for surplus.",
    badge: "URGENT",
    meta: "2h left",
    tone: "warning",
  },
  {
    title: "Security Audit Signing",
    description:
      "Approve final SOC2 compliance report for the external auditors. Document ready for signature.",
    badge: "COMPLIANCE",
    meta: "",
    tone: "compliance",
  },
  {
    title: "Team Lead One-on-Ones",
    description:
      "Scheduled for tomorrow. Review project health reports for Phoenix and Nebula before the call.",
    badge: "PEOPLE",
    meta: "",
    tone: "people",
  },
];

const healthTone = {
  Healthy:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  "At Risk":
    "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20",
} as const;

const focusTone = {
  warning: {
    icon: <CircleAlert className="size-4" />,
    iconWrap: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  },
  compliance: {
    icon: <FileText className="size-4" />,
    iconWrap: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  },
  people: {
    icon: <TrendingUp className="size-4" />,
    iconWrap: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
} as const;

function StatBlock({ item }: { item: StatCard }) {
  return (
    <article className="border-border bg-card rounded-md border p-4">
      <div className="mb-4 flex items-start justify-between">
        <span className="border-border bg-muted/35 text-muted-foreground inline-flex size-8 items-center justify-center rounded-md border">
          {item.icon}
        </span>
        <Badge
          variant="outline"
          className={`h-5 rounded-sm border px-1.5 text-[10px] ${item.tagTone}`}
        >
          {item.tag}
        </Badge>
      </div>
      <p className="text-muted-foreground text-[11px]">{item.title}</p>
      <p className="mt-1 text-3xl leading-none font-semibold tracking-tight">
        {item.value}
      </p>
    </article>
  );
}

function FocusCard({ item }: { item: FocusItem }) {
  const tone = focusTone[item.tone];
  return (
    <article className="border-border bg-card rounded-md border p-3.5">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md ${tone.iconWrap}`}
        >
          {tone.icon}
        </span>
        <div>
          <h4 className="text-sm font-semibold">{item.title}</h4>
          <p className="text-muted-foreground mt-1 text-xs leading-5">
            {item.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 rounded-sm px-1.5 text-[10px]"
            >
              {item.badge}
            </Badge>
            {item.meta ? (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                <Clock3 className="size-3" />
                {item.meta}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function VelocityBars() {
  const bars = [26, 41, 33, 52, 37, 68];
  return (
    <div className="flex items-end gap-1">
      {bars.map((height, index) => (
        <span
          key={index}
          className="bg-primary/65 w-1.5 rounded-sm"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

export default function DashboardView() {
  return (
    <div className="container mx-auto w-full space-y-5 pb-8">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <StatBlock key={item.title} item={item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="border-border bg-card space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Recent Strategic Projects
              </h2>
              <Badge
                variant="outline"
                className="h-5 rounded-sm px-1.5 text-[10px]"
              >
                LIVE
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View all
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead className="bg-muted/20">
                <tr className="border-border border-y">
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                    Project Name
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                    Health
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                    Progress
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((row) => (
                  <tr key={row.name} className="border-border border-b">
                    <td className="px-3 py-3 text-sm font-medium">
                      {row.name}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className={`h-5 rounded-sm border px-1.5 text-[10px] ${healthTone[row.health]}`}
                      >
                        {row.health}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-[11px] font-medium">
                          {row.progress}%
                        </span>
                        <div className="bg-muted h-1.5 w-24 rounded-full">
                          <div
                            className={`h-1.5 rounded-full ${row.health === "At Risk" ? "bg-amber-500" : "bg-primary"}`}
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border-border bg-card rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">
                Management Focus
              </h3>
              <Funnel className="text-muted-foreground size-4" />
            </div>
            <div className="space-y-3">
              {focusItems.map((item) => (
                <FocusCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="border-border bg-card rounded-md border p-4">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.12em] uppercase">
              Velocity Trend
            </p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight">+22%</p>
              <VelocityBars />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
