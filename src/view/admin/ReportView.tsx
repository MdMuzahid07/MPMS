import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";

type TeamReportItem = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  completion: number;
  score: number;
  status: "Peak" | "Active" | "Delayed";
};

const teamReportRows: TeamReportItem[] = [
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

const statusBadgeTone: Record<TeamReportItem["status"], string> = {
  Peak: "border-emerald-500/25 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  Active:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  Delayed:
    "border-amber-500/25 bg-amber-500/12 text-amber-600 dark:text-amber-300",
};

function ReportStatCard({
  title,
  value,
  footer,
  tags,
}: {
  title: string;
  value: string;
  footer: string;
  tags?: { text: string; tone: string }[];
}) {
  return (
    <article className="border-border bg-card rounded-md border p-4">
      <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase">
        {title}
      </p>
      <p className="mt-2 text-4xl leading-none font-semibold tracking-tight">
        {value}
      </p>
      <p className="text-muted-foreground mt-3 text-xs">{footer}</p>
      {tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag.text}
              variant="outline"
              className={`h-5 rounded-sm border px-1.5 text-[10px] ${tag.tone}`}
            >
              {tag.text}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ProgressTrendChart() {
  return (
    <svg
      viewBox="0 0 820 250"
      className="h-52 w-full"
      role="img"
      aria-label="Sprint performance trend"
    >
      <defs>
        <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(125,128,255,0.65)" />
          <stop offset="100%" stopColor="rgba(176,177,255,1)" />
        </linearGradient>
      </defs>
      <path
        d="M 20 190 C 120 198, 160 168, 220 150 C 280 132, 340 138, 420 166 C 500 194, 560 110, 635 84 C 705 62, 760 78, 800 96"
        fill="none"
        stroke="url(#lineColor)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="220" cy="150" r="4" fill="rgba(182,185,255,1)" />
      <circle cx="420" cy="166" r="4" fill="rgba(182,185,255,1)" />
      <circle cx="700" cy="70" r="4" fill="rgba(182,185,255,1)" />
      <text x="20" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 18
      </text>
      <text x="270" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 19
      </text>
      <text x="520" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 20
      </text>
      <text x="760" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 21
      </text>
    </svg>
  );
}

export default function ReportView() {
  return (
    <div className="container mx-auto w-full space-y-5 pb-8">
      <section className="grid gap-3 md:grid-cols-3">
        <ReportStatCard
          title="Global Progress"
          value="74.2%"
          footer="+2.4% increase from last audit"
        />
        <ReportStatCard
          title="Tasks Remaining"
          value="128"
          footer="Active across all projects"
          tags={[
            {
              text: "12 OVERDUE",
              tone: "border-rose-500/25 bg-rose-500/12 text-rose-600 dark:text-rose-300",
            },
            {
              text: "14 CRITICAL",
              tone: "border-amber-500/25 bg-amber-500/12 text-amber-600 dark:text-amber-300",
            },
          ]}
        />
        <ReportStatCard
          title="Time Logged (This Week)"
          value="1,240h"
          footer="Avg. 38.5h per member"
        />
      </section>

      <section className="border-border bg-card rounded-md border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Sprint Progress Trend
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Team work pace across the last 4 sprint cycles
            </p>
          </div>
          <div className="text-muted-foreground hidden items-center gap-4 text-[11px] font-medium sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex size-2 rounded-full bg-indigo-300" />
              Actual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="border-muted-foreground inline-flex size-2 rounded-full border" />
              Target
            </span>
          </div>
        </div>
        <ProgressTrendChart />
      </section>

      <section className="border-border bg-card rounded-md border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Team Performance Breakdown
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-md px-2 text-xs"
          >
            <Download className="mr-1 size-3.5" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="bg-muted/20">
              <tr className="border-border border-y">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Member
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Task Completion
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Efficiency
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {teamReportRows.map((member) => (
                <tr key={member.id} className="border-border border-b">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="border-border size-8 rounded-md border">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="rounded-md text-[10px]">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-1.5 w-34 rounded-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            member.completion < 50
                              ? "bg-amber-500"
                              : "bg-primary"
                          }`}
                          style={{ width: `${member.completion}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold">
                        {member.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold">
                      {member.score}
                      <span className="text-muted-foreground text-xs">
                        {" "}
                        /5.0
                      </span>
                    </p>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Badge
                      variant="outline"
                      className={`h-5 rounded-sm px-1.5 text-[10px] ${statusBadgeTone[member.status]}`}
                    >
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-border bg-card text-muted-foreground rounded-md border p-3 text-xs">
        <p className="inline-flex items-center gap-1.5">
          <Info className="size-3.5" />
          This page summarizes delivery health, pending work risk, and team
          execution quality for quick weekly review.
        </p>
      </section>
    </div>
  );
}
