"use client";

import { DeleteConfirmationModal } from "@/components/tasks/DeleteConfirmationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  FilePenLine,
  Info,
  Rocket,
  Search,
  ShieldBan,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type TeamStatus = "Active" | "Inactive";
type TeamRole = "Admin" | "Manager" | "Member";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department: string;
  skills: string[];
  status: TeamStatus;
  avatar: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex.rivera@mpms.tech",
    role: "Admin",
    department: "Core Infrastructure",
    skills: ["Kubernetes", "Go"],
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATgT_j39Dxn-QI-GQjdgdzE9NFGj7Or9TP0Z_7sk4atsrM3BlONtmsmpP7Bkzzj2ewAJZCbQI9ci5GI_QbEeJZfsGU0c8XaQ1SGjWnPQXAg_zxHuhcwOrkq_J8zdq9wCCyOkVkZHMcG0m1BDEYMnXHJ6-vlDMQcFDB_ClCLNkJKzZV8tZK6pMcypm0eGj8s2whEous3XBosMO8gcD2h6du4CZjvWSu6XcDo9Ri7_qLzfmx3AmK51bYI5wGDzquDLtiWA9EKpY4c0BO",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "s.chen@mpms.tech",
    role: "Manager",
    department: "Product Design",
    skills: ["React", "TypeScript", "Figma"],
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX5P28pGOPSrfMPRxrqgsA5o9T2Eyk7JYqJQRGpHkh0lcq0e_NTqb23KgwYnbiBE45pO6Es-LuPHGQP_KKOH0Ce-hagGX2bytEomUu-B56veNjwSEGvyt8kLJ8ymJbXc7iek5FFlCKc4UXACq6Lm0uNaEYOe8x-gqD26hBnPpUQzi62ExVtYiaCyxp6YrKpnCg5txWsZBsWNrsp4postkKhXwJuKcqLPBMbLWUuWlAQPWUaEPyND4btuIpzRkFXe6JzpRDHp_enTnk",
  },
  {
    id: "3",
    name: "Marcus Thorne",
    email: "m.thorne@mpms.tech",
    role: "Member",
    department: "Backend Systems",
    skills: ["Rust", "PostgreSQL"],
    status: "Inactive",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzqzcFNW9tG1r4jChfW05tFWsarScd6TSQBrlhVamuGO8X_vVkxT82TomyAtW7lB7ixY2PAKwjTzLrtnS-DyuDcFXkExaqitB3zC2XogTEOnubjY8PwnBZc-g50q84tuwJEorQqdVgHqlv0sItzeCKQc2FoZlR52K5EeZXHKxHzogsyWler-_O9Sr-GmooNG1wYVYCWfNJLno2COPwX6jt_yLxvhJAqX5fGFQdl9tnb56CXSvQKWkiAhl1stnQLmamwnL_7EWhZuQ6",
  },
  {
    id: "4",
    name: "Elena Vance",
    email: "e.vance@mpms.tech",
    role: "Member",
    department: "Cybersecurity",
    skills: ["Python", "Ethical Hacking"],
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWvC2ZxBqppJXjYHHq4q8exBnTAlQ1F-u53yA3TMzNJJ1Eny1EkJRJ0SsHvVNR3OLWTMZNt-WAsxOxlDirBULHaEA19x-Lxpt8ckDf28yxvxOr_c5QIdTDXcGjPq2H-XZ6XoOSdnPwba_XADHJ3-GZhWL9dON-EOtdn_aprxCdrAsowaStiifQCGQZLrYQ04uGOtTHqYOr28cM4GLxI1lufLRWKnGDehTimaTP9PXE856vv6VpPn1RWBPK4Yb3wzga84SEtLRB8vfj",
  },
];

const ROLE_STYLE: Record<TeamRole, string> = {
  Admin:
    "border-primary/30 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground",
  Manager:
    "border-border bg-secondary text-secondary-foreground dark:border-border dark:bg-muted/70 dark:text-foreground",
  Member:
    "border-border bg-muted text-muted-foreground dark:border-border dark:bg-muted/60 dark:text-muted-foreground",
};

const STATUS_STYLE: Record<TeamStatus, string> = {
  Active:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Inactive:
    "border-border bg-muted text-muted-foreground dark:border-border dark:bg-muted/70 dark:text-muted-foreground",
};

function TeamStatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardContent className="flex h-36 flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase">
            {title}
          </p>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div>
          <p className="text-foreground text-[34px] leading-none font-semibold tracking-tight">
            {value}
          </p>
          <p className="text-muted-foreground mt-2 text-[11px]">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamView() {
  const [searchValue, setSearchValue] = useState("");
  const [memberRows, setMemberRows] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [memberPendingSuspend, setMemberPendingSuspend] =
    useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return memberRows;
    }

    return memberRows.filter((member) => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [memberRows, searchValue]);

  const toggleMemberStatus = (memberId: string) => {
    setMemberRows((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              status: member.status === "Active" ? "Inactive" : "Active",
            }
          : member,
      ),
    );
  };

  return (
    <div className="container mx-auto w-full space-y-6 pb-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-foreground text-[30px] leading-tight font-semibold tracking-tight">
            Organization Directory
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage permissions, roles, and technical expertise across the
            organization.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search members, roles or skills..."
              className="h-9 pl-8 text-xs"
            />
          </div>
          <Button
            asChild
            className="h-9 shrink-0 rounded-md px-3 text-xs font-semibold"
          >
            <Link href="/team/new">
              <UserPlus className="mr-1.5 size-3.5" />
              Add Member
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead className="bg-muted/35">
              <tr className="border-border border-b">
                <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
                  Member
                </th>
                <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
                  Role
                </th>
                <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
                  Department
                </th>
                <th className="text-muted-foreground px-5 py-3 text-left text-[10px] font-semibold tracking-[0.14em] uppercase">
                  Skills
                </th>
                <th className="text-muted-foreground px-5 py-3 text-right text-[10px] font-semibold tracking-[0.14em] uppercase">
                  Status
                </th>
                <th className="w-12 px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-border hover:bg-muted/25 border-b transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="lg"
                        className={`border ${member.status === "Inactive" ? "opacity-70 grayscale" : ""}`}
                      >
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground text-[13px] font-medium">
                          {member.name}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge
                      variant="outline"
                      className={`rounded-sm border px-2 py-0 text-[9px] font-bold tracking-[0.12em] uppercase ${ROLE_STYLE[member.role]}`}
                    >
                      {member.role}
                    </Badge>
                  </td>

                  <td className="text-muted-foreground px-5 py-3.5 text-[13px]">
                    {member.department}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="rounded-sm border px-2 py-0 text-[9px] font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <Badge
                      variant="outline"
                      className={`rounded-full border px-2.5 py-0 text-[10px] font-medium ${STATUS_STYLE[member.status]}`}
                    >
                      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <EllipsisVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuItem asChild>
                          <Link href={`/team/${member.id}`}>
                            <Info className="size-3.5" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/team/${member.id}/edit`}>
                            <FilePenLine className="size-3.5" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setMemberPendingSuspend(member)}
                        >
                          <ShieldBan className="size-3.5" />
                          {member.status === "Active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-muted/30 border-border flex items-center justify-between border-t px-5 py-3">
          <p className="text-muted-foreground text-[11px] font-medium">
            Showing {filteredMembers.length} of 48 members
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-md"
              disabled
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-md">
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TeamStatCard
          title="Total Headcount"
          value="48"
          description="+12% from last quarter"
          icon={<Users className="size-4" />}
        />
        <TeamStatCard
          title="Avg. Expertise"
          value="4.2/5"
          description="Calculated across 12 skill sets"
          icon={<BrainCircuit className="size-4 text-amber-500" />}
        />
        <TeamStatCard
          title="Active Projects"
          value="14"
          description="8 critical milestones this week"
          icon={<Rocket className="size-4" />}
        />
      </section>

      <DeleteConfirmationModal
        open={Boolean(memberPendingSuspend)}
        onOpenChange={(open) => {
          if (!open) setMemberPendingSuspend(null);
        }}
        title={
          memberPendingSuspend?.status === "Active"
            ? "Suspend team member?"
            : "Activate team member?"
        }
        description={
          memberPendingSuspend
            ? memberPendingSuspend.status === "Active"
              ? `This will suspend "${memberPendingSuspend.name}" and restrict account access.`
              : `This will reactivate "${memberPendingSuspend.name}" and restore account access.`
            : ""
        }
        confirmLabel={
          memberPendingSuspend?.status === "Active" ? "Suspend" : "Activate"
        }
        onConfirm={() => {
          if (!memberPendingSuspend) return;
          toggleMemberStatus(memberPendingSuspend.id);
          setMemberPendingSuspend(null);
        }}
      />
    </div>
  );
}
