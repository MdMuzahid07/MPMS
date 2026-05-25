"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import FocusSection from "@/components/features/dashboard-overview/FocusSection";
import ProjectsTable from "@/components/features/dashboard-overview/ProjectsTable";
import StatBlock from "@/components/features/dashboard-overview/StatBlock";
import VelocityTrend from "@/components/features/dashboard-overview/VelocityTrend";
import {
  useGetOverviewReportQuery,
  useGetProjectsReportQuery,
} from "@/redux/feature/reports/reportsApi";
import { InfoBanner } from "@/components/shared/InfoBanner";
import { Bolt, BriefcaseBusiness, ListChecks, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardViewSkeleton from "@/skeleton/dashboard/DashboardViewSkeleton";

export default function DashboardView() {
  const router = useRouter();

  // Fetch dynamic, live overview and project statistics
  const { data: overview, isLoading: isOverviewLoading } =
    useGetOverviewReportQuery();
  const { data: projectReports, isLoading: isProjectsLoading } =
    useGetProjectsReportQuery();

  if (isOverviewLoading || isProjectsLoading) {
    return <DashboardViewSkeleton />;
  }

  // Fallbacks
  const stats = overview || {
    totalProjects: 0,
    activeProjects: 0,
    activeSprints: 0,
    openTasks: 0,
    completedTasks: 0,
    totalUsers: 0,
    totalHoursLogged: 0,
  };

  const rawReports = Array.isArray(projectReports) ? projectReports : [];

  // 1. Dynamic Stat Cards
  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects.toString(),
      tag: `Active: ${stats.activeProjects}`,
      icon: <BriefcaseBusiness className="text-primary size-4" />,
      tagTone:
        "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Active Sprints",
      value: stats.activeSprints.toString(),
      tag: "Ongoing",
      icon: <Bolt className="text-primary size-4" />,
      tagTone:
        "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Open Tasks",
      value: stats.openTasks.toString(),
      tag: `Done: ${stats.completedTasks}`,
      icon: <ListChecks className="text-primary size-4" />,
      tagTone:
        "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Active Members",
      value: stats.totalUsers.toString(),
      tag: "Optimal Capacity",
      icon: <Users className="text-primary size-4" />,
      tagTone:
        "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    },
  ];

  // 2. Map Strategic Projects Table Rows
  const projectsData = rawReports.slice(0, 5).map((item: any) => ({
    _id: item.project?._id,
    name: item.project?.title || "Unnamed Project",
    health:
      item.project?.status === "active"
        ? ("Healthy" as const)
        : item.project?.status === "completed"
          ? ("Healthy" as const)
          : ("At Risk" as const),
    progress: item.percentComplete ?? 0,
  }));

  // 3. Dynamic Management Focus items generated from active projects needing attention
  const focusItems = rawReports.slice(0, 3).map((item: any, idx: number) => {
    const tones = ["warning", "compliance", "people"] as const;
    const badges = ["URGENT", "COMPLIANCE", "PROGRESS"] as const;

    const remainingTasks = item.remaining ?? 0;
    const budgetStr = item.project?.budget
      ? `$${item.project.budget.toLocaleString()}`
      : "No budget";

    const tone = tones[idx % tones.length] || "warning";
    const badge = badges[idx % badges.length] || "URGENT";

    return {
      title: `Review ${item.project?.title || "Project"}`,
      description: `Targeting client '${item.project?.client || "TBD"}'. Budget allocated: ${budgetStr}. Workspace has ${remainingTasks} remaining tasks.`,
      badge,
      meta: `${item.percentComplete}% complete`,
      tone,
    };
  });

  // Default Focus Items if no projects exist
  const defaultFocusItems = [
    {
      title: "Initialize First Project",
      description:
        "Setup your primary team workflow, initialize client deliverables, and allocate the starting budget.",
      badge: "URGENT",
      meta: "Get Started",
      tone: "warning" as const,
    },
  ];

  const finalFocusItems =
    focusItems.length > 0 ? focusItems : defaultFocusItems;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto w-full space-y-6 pb-8 duration-500">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <StatBlock key={item.title} item={item as any} />
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProjectsTable
          projects={projectsData}
          onViewAll={() => router.push("/projects")}
        />

        <aside className="space-y-6">
          <FocusSection items={finalFocusItems} />
          <VelocityTrend />
        </aside>
      </section>

      <InfoBanner />
    </div>
  );
}
