"use client";

import FocusSection from "@/components/features/dashboard-overview/FocusSection";
import ProjectsTable from "@/components/features/dashboard-overview/ProjectsTable";
import StatBlock from "@/components/features/dashboard-overview/StatBlock";
import VelocityTrend from "@/components/features/dashboard-overview/VelocityTrend";
import { BarChart3, Bolt, BriefcaseBusiness, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

// ============================================
// Types & Schemas (Zod as source of truth)
// ============================================

type StatCard = {
  title: string;
  value: string;
  tag: string;
  icon: ReactNode;
  tagTone: string;
};

type ProjectHealth = "Healthy" | "At Risk";

type ProjectRow = {
  name: string;
  health: ProjectHealth;
  progress: number;
};

type FocusTone = "warning" | "compliance" | "people";

type FocusItem = {
  title: string;
  description: string;
  badge: string;
  meta: string;
  tone: FocusTone;
};

// ============================================
// Constants (extracted from component)
// ============================================

const STAT_CARDS: StatCard[] = [
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

const PROJECT_ROWS: ProjectRow[] = [
  { name: "Phoenix Infrastructure V2", health: "Healthy", progress: 78 },
  { name: "Nebula Cloud Migration", health: "At Risk", progress: 42 },
  { name: "Data Lake Optimization", health: "Healthy", progress: 92 },
  { name: "Edge Node Deployment", health: "Healthy", progress: 15 },
];

const FOCUS_ITEMS: FocusItem[] = [
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

interface DashboardViewProps {
  statCards?: StatCard[];
  projects?: ProjectRow[];
  focusItems?: FocusItem[];
  onViewAllProjects?: () => void;
}

const DashboardView = ({
  statCards = STAT_CARDS,
  projects = PROJECT_ROWS,
  focusItems = FOCUS_ITEMS,
  onViewAllProjects,
}: DashboardViewProps) => {
  return (
    <div className="container mx-auto w-full space-y-5 pb-8">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <StatBlock key={item.title} item={item} />
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ProjectsTable projects={projects} onViewAll={onViewAllProjects} />

        <aside className="space-y-4">
          <FocusSection items={focusItems} />
          <VelocityTrend />
        </aside>
      </section>
    </div>
  );
};

export default DashboardView;
