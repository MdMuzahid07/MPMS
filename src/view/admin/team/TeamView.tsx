"use client";

import { DeleteConfirmationModal } from "@/components/features/tasks/DeleteConfirmationModal";
import {
  TeamHeader,
  TeamMember,
  TeamSearchBar,
  TeamStatCard,
  TeamTable,
  TeamTableFooter,
} from "@/components/features/team";
import { BrainCircuit, Rocket, Users } from "lucide-react";
import { useMemo, useState } from "react";

// ============================================
// Constants
// ============================================

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

// Main Team View logic (uses components exported from components/team)

interface TeamViewProps {
  initialMembers?: TeamMember[];
  totalHeadcount?: number;
  onAddMember?: () => void;
}

export const TeamView = ({
  initialMembers = TEAM_MEMBERS,
  totalHeadcount = 48,
  onAddMember,
}: TeamViewProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [memberRows, setMemberRows] = useState<TeamMember[]>(initialMembers);
  const [memberPendingSuspend, setMemberPendingSuspend] =
    useState<TeamMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredMembers = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return memberRows;
    return memberRows.filter((member) => {
      return (
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [memberRows, searchValue]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const handleSuspendToggle = (member: TeamMember) =>
    setMemberPendingSuspend(member);

  const confirmSuspendToggle = () => {
    if (!memberPendingSuspend) return;
    setMemberRows((prev) =>
      prev.map((m) =>
        m.id === memberPendingSuspend.id
          ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
          : m,
      ),
    );
    setMemberPendingSuspend(null);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const getDeleteModalConfig = () => {
    if (!memberPendingSuspend)
      return { title: "", description: "", confirmLabel: "" };
    const isActive = memberPendingSuspend.status === "Active";
    return {
      title: isActive ? "Suspend team member?" : "Activate team member?",
      description: isActive
        ? `This will suspend "${memberPendingSuspend.name}" and restrict account access.`
        : `This will reactivate "${memberPendingSuspend.name}" and restore account access.`,
      confirmLabel: isActive ? "Suspend" : "Activate",
    };
  };

  const modalConfig = getDeleteModalConfig();

  return (
    <div className="w-full space-y-6 pb-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <TeamHeader
          title="Organization Directory"
          description="Manage permissions, roles, and technical expertise across the organization."
        />
        <TeamSearchBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onAddMemberClick={onAddMember}
        />
      </section>

      <section className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <TeamTable
          members={paginatedMembers}
          onSuspendToggle={handleSuspendToggle}
        />
        <TeamTableFooter
          visibleCount={paginatedMembers.length}
          totalCount={filteredMembers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TeamStatCard
          title="Total Headcount"
          value={totalHeadcount.toString()}
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
        title={modalConfig.title}
        description={modalConfig.description}
        confirmLabel={modalConfig.confirmLabel}
        onConfirm={confirmSuspendToggle}
      />
    </div>
  );
};

export default TeamView;
