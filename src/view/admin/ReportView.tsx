"use client";

import {
  InfoBanner,
  PageHeader,
  ReportStatCard,
  SprintProgressSection,
  TeamPerformanceTable,
  TeamReportItem,
} from "@/components/features/report";

const TEAM_REPORT_ROWS: TeamReportItem[] = [
  {
    id: "1",
    name: "Marcus Thorne",
    role: "Senior Backend",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzqzcFNW9tG1r4jChfW05tFWsarScd6TSQBrlhVamuGO8X_vVkxT82TomyAtW7lB7ixY2PAKwjTzLrtnS-DyuDcFXkExaqitB3zC2XogTEOnubjY8PwnBZc-g50q84tuwJEorQqdVgHqlv0sItzeCKQc2FoZlR52K5EeZXHKxHzogsyWler-_O9Sr-GmooNG1wYVYCWfNJLno2COPwX6jt_yLxvhJAqX5fGFQdl9tnb56CXSvQKWkiAhl1stnQLmamwnL_7EWhZuQ6",
    completion: 92,
    score: 4.8,
    status: "Peak",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "Lead Designer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX5P28pGOPSrfMPRxrqgsA5o9T2Eyk7JYqJQRGpHkh0lcq0e_NTqb23KgwYnbiBE45pO6Es-LuPHGQP_KKOH0Ce-hagGX2bytEomUu-B56veNjwSEGvyt8kLJ8ymJbXc7iek5FFlCKc4UXACq6Lm0uNaEYOe8x-gqD26hBnPpUQzi62ExVtYiaCyxp6YrKpnCg5txWsZBsWNrsp4postkKhXwJuKcqLPBMbLWUuWlAQPWUaEPyND4btuIpzRkFXe6JzpRDHp_enTnk",
    completion: 88,
    score: 4.5,
    status: "Active",
  },
  {
    id: "3",
    name: "Elias Vance",
    role: "DevOps Engineer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWvC2ZxBqppJXjYHHq4q8exBnTAlQ1F-u53yA3TMzNJJ1Eny1EkJRJ0SsHvVNR3OLWTMZNt-WAsxOxlDirBULHaEA19x-Lxpt8ckDf28yxvxOr_c5QIdTDXcGjPq2H-XZ6XoOSdnPwba_XADHJ3-GZhWL9dON-EOtdn_aprxCdrAsowaStiifQCGQZLrYQ04uGOtTHqYOr28cM4GLxI1lufLRWKnGDehTimaTP9PXE856vv6VpPn1RWBPK4Yb3wzga84SEtLRB8vfj",
    completion: 41,
    score: 3.2,
    status: "Delayed",
  },
];

export interface ReportViewProps {
  teamMembers?: TeamReportItem[];
  onExportCSV?: () => void;
  onDownloadReport?: () => void;
}

export const ReportView = ({
  teamMembers = TEAM_REPORT_ROWS,
  onExportCSV,
  onDownloadReport,
}: ReportViewProps) => {
  const stats = {
    globalProgress: {
      value: "74.2%",
      footer: "+2.4% increase from last audit",
    },
    tasksRemaining: {
      value: "128",
      footer: "Active across all projects",
      tags: [
        {
          text: "12 OVERDUE",
          tone: "border-rose-500/25 bg-rose-500/12 text-rose-600 dark:text-rose-300",
        },
        {
          text: "14 CRITICAL",
          tone: "border-amber-500/25 bg-amber-500/12 text-amber-600 dark:text-amber-300",
        },
      ],
    },
    timeLogged: { value: "1,240h", footer: "Avg. 38.5h per member" },
  };

  return (
    <div className="w-full space-y-5 pb-8">
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
          title="Time Logged (This Week)"
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
