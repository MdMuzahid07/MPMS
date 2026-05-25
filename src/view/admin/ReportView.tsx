"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PageHeader,
  ReportStatCard,
  SprintProgressSection,
  TeamPerformanceTable,
  TeamReportItem,
} from "@/components/features/report";
import { InfoBanner } from "@/components/shared/InfoBanner";
import {
  useGetOverviewReportQuery,
  useGetUsersReportQuery,
} from "@/redux/feature/reports/reportsApi";
import { Loader2, ShieldAlert } from "lucide-react";

export interface ReportViewProps {
  onExportCSV?: () => void;
  onDownloadReport?: () => void;
}

export const ReportView = ({
  onExportCSV,
  onDownloadReport,
}: ReportViewProps) => {
  const {
    data: overview,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetOverviewReportQuery();
  const {
    data: usersReport,
    isLoading: isUsersLoading,
    error: usersError,
  } = useGetUsersReportQuery();

  if (isOverviewLoading || isUsersLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (overviewError || usersError) {
    return (
      <div className="border-border bg-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl border-dashed p-12 text-center">
        <ShieldAlert className="text-destructive mb-4 size-12" />
        <h2 className="text-foreground mb-2 text-xl font-bold">
          Failed to Load Reports
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          There was an error retrieving report data from the server. Please try
          refreshing.
        </p>
      </div>
    );
  }

  // Calculate global progress
  const totalTasks =
    (overview?.completedTasks || 0) + (overview?.openTasks || 0);
  const globalProgressValue =
    totalTasks > 0
      ? Math.round(((overview?.completedTasks || 0) / totalTasks) * 100)
      : 0;

  const stats = {
    globalProgress: {
      value: `${globalProgressValue}%`,
      footer: "Based on overall task completion",
    },
    tasksRemaining: {
      value: (overview?.openTasks || 0).toString(),
      footer: "Active across all projects",
      tags: [
        {
          text: `${overview?.activeSprints || 0} ACTIVE SPRINTS`,
          tone: "border-indigo-500/25 bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
        },
      ],
    },
    timeLogged: {
      value: `${overview?.totalHoursLogged || 0}h`,
      footer:
        overview?.totalUsers && overview.totalUsers > 0
          ? `Avg. ${Math.round((overview.totalHoursLogged || 0) / overview.totalUsers)}h per member`
          : "No active members",
    },
  };

  const rawUsersReport = Array.isArray(usersReport) ? usersReport : [];

  const teamMembers: TeamReportItem[] = rawUsersReport.map(
    (userReport: any, index: number) => {
      return {
        id: userReport.user?._id || `fallback-user-${index}`,
        name: userReport.user?.name || "Unknown User",
        role: userReport.user?.role || "Member",
        avatar: userReport.user?.avatar || "",
        completion: Math.round(userReport.completionRate) || 0,
        score: 5.0, // Backend might not provide a score, fallback to 5.0
        status:
          userReport.completionRate >= 80
            ? "Peak"
            : userReport.completionRate >= 50
              ? "Active"
              : "Delayed",
      } as TeamReportItem;
    },
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full space-y-5 pb-8 duration-500">
      <PageHeader title="Reports / Overview" subtitle="Operations Workspace" />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ReportStatCard
          title="Global Progress"
          value={stats.globalProgress.value}
          footer={stats.globalProgress.footer}
        />
        <ReportStatCard
          title="Tasks Remaining"
          value={stats.tasksRemaining.value}
          footer={stats.tasksRemaining.footer}
          tags={stats.tasksRemaining.tags}
        />
        <ReportStatCard
          title="Time Logged (All Time)"
          value={stats.timeLogged.value}
          footer={stats.timeLogged.footer}
        />
      </section>

      <SprintProgressSection onDownloadReport={onDownloadReport} />

      <TeamPerformanceTable members={teamMembers} onExportCSV={onExportCSV} />

      <InfoBanner />
    </div>
  );
};

export default ReportView;
