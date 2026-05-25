"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeleteConfirmationModal } from "@/components/features/tasks/DeleteConfirmationModal";
import { InfoBanner } from "@/components/shared/InfoBanner";
import {
  AddMemberDialog,
  TeamEmptyState,
  TeamHeader,
  TeamMember,
  TeamSearchBar,
  TeamStatCard,
  TeamTable,
  TeamTableFooter,
  TeamTableSkeleton,
} from "@/components/features/team";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/feature/users/usersApi";
import { BrainCircuit, Rocket, ShieldAlert, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const TeamView = () => {
  // ======= Queries & Filters State =======
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;

  // ======= Modals & Action States =======
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [memberPendingSuspend, setMemberPendingSuspend] =
    useState<TeamMember | null>(null);
  const [memberPendingDelete, setMemberPendingDelete] =
    useState<TeamMember | null>(null);

  // ======= RTK Query Hooks =======
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    role: roleFilter,
    status: statusFilter,
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handlePageChange = (page: number) => setCurrentPage(page);

  // ======= Intercept Search Click Event to prevent routing to "/team/new" and trigger inline Dialog instead =======
  const handleAddMemberClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsAddOpen(true);
  };

  // ======= Suspend/Reactivate toggle =======
  const confirmSuspendToggle = async () => {
    if (!memberPendingSuspend) return;
    const isCurrentlyActive = memberPendingSuspend.status === "Active";
    const nextStatus = isCurrentlyActive ? "inactive" : "active";

    const promise = updateUser({
      id: memberPendingSuspend.id,
      body: { status: nextStatus },
    }).unwrap();

    toast.promise(promise, {
      loading: `${isCurrentlyActive ? "Suspending" : "Reactivating"} team member...`,
      success: () => {
        setMemberPendingSuspend(null);
        return `Team member successfully ${isCurrentlyActive ? "suspended" : "reactivated"}!`;
      },
      error: (err: any) =>
        err?.data?.message || "Failed to update member status.",
    });
  };

  // ======= Delete Member Confirm =======
  const confirmDeleteMember = async () => {
    if (!memberPendingDelete) return;

    const promise = deleteUser(memberPendingDelete.id).unwrap();

    toast.promise(promise, {
      loading: "Deleting team member...",
      success: () => {
        setMemberPendingDelete(null);
        return "Team member successfully deleted from directory!";
      },
      error: (err: any) =>
        err?.data?.message || "Failed to delete team member.",
    });
  };

  // ======= Suspension configurations =======
  const getSuspendConfig = () => {
    if (!memberPendingSuspend)
      return { title: "", description: "", confirmLabel: "" };
    const isActive = memberPendingSuspend.status === "Active";
    return {
      title: isActive ? "Suspend team member?" : "Reactivate team member?",
      description: isActive
        ? `This will temporarily suspend "${memberPendingSuspend.name}" and restrict their platform permissions.`
        : `This will restore full system and workspace access permissions for "${memberPendingSuspend.name}".`,
      confirmLabel: isActive ? "Suspend" : "Activate",
    };
  };

  const suspendConfig = getSuspendConfig();

  // ======= ERROR HANDLER BOUNDARY =======
  if (isError) {
    const status = (error as any)?.status;
    const isForbidden = status === 403;

    if (isForbidden) {
      return (
        <div className="animate-in fade-in flex flex-col items-center justify-center py-16 text-center duration-200">
          <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <ShieldAlert className="size-7" />
          </div>
          <h2 className="text-foreground text-lg font-bold">
            Directory Access Restricted
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-xs leading-relaxed">
            The team directory contains sensitive clearance roles and
            infrastructure permissions. Only administrators and project managers
            have access to view or update records here.
          </p>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in flex flex-col items-center justify-center py-16 text-center duration-200">
        <div className="bg-muted text-muted-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="text-foreground text-lg font-bold">
          Failed to Load Directory
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm text-xs leading-relaxed">
          Could not establish secure database connection with the workspace
          service. Please verify your connection status and try again.
        </p>
        <Button
          variant="outline"
          className="mt-4 h-9 text-xs"
          onClick={() => refetch()}
        >
          Retry Database Connection
        </Button>
      </div>
    );
  }

  // ======= Derived properties from backend response =======
  const members = data?.members || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  // Calculate dynamic stats
  const avgSkillsCount = members.length
    ? (
        members.reduce((acc, m) => acc + (m.skills?.length || 0), 0) /
        members.length
      ).toFixed(1)
    : "0";
  const activeMembersCount = members.filter(
    (m) => m.status.toLowerCase() === "active",
  ).length;

  return (
    <div className="animate-in fade-in w-full space-y-6 pb-8 duration-200">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <TeamHeader
          title="Organization Directory"
          description="Manage permissions, roles, and technical expertise across the organization."
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* ======= Quick Filters ======= */}
          <div className="flex h-9 items-center gap-2">
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-muted text-muted-foreground h-9 w-32.5 border text-xs focus:ring-0 dark:bg-[#1b1b23]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-muted text-muted-foreground h-9 w-32.5 border text-xs focus:ring-0 dark:bg-[#1b1b23]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TeamSearchBar
            searchValue={searchValue}
            onSearchChange={(val) => {
              setSearchValue(val);
              setCurrentPage(1);
            }}
            onAddMemberClick={handleAddMemberClick}
          />
        </div>
      </section>

      {/* ======= Main Members Directory Table ======= */}
      <section className="bg-card overflow-hidden rounded-xl border">
        {isLoading ? (
          <TeamTableSkeleton />
        ) : members.length === 0 ? (
          <TeamEmptyState />
        ) : (
          <>
            <TeamTable
              members={members}
              onSuspendToggle={setMemberPendingSuspend}
              onDeleteClick={setMemberPendingDelete}
            />
            <TeamTableFooter
              visibleCount={members.length}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* ======= Overview Stat Grid ======= */}
      <section className="grid gap-4 md:grid-cols-3">
        <TeamStatCard
          title="Total Headcount"
          value={isLoading ? "..." : totalCount.toString()}
          description="Real-time synchronized headcount"
          icon={<Users className="size-4" />}
        />
        <TeamStatCard
          title="Avg. Expertise"
          value={isLoading ? "..." : `${avgSkillsCount} Skills`}
          description="Average skills per member"
          icon={
            <BrainCircuit className="size-4 animate-pulse text-amber-500" />
          }
        />
        <TeamStatCard
          title="Active Members"
          value={isLoading ? "..." : activeMembersCount.toString()}
          description="Members currently active in the directory"
          icon={<Rocket className="text-primary size-4" />}
        />
      </section>

      {/* ======= Modals ======= */}
      <AddMemberDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      {/* ======= SUSPEND MODAL DIALOG ======= */}
      <DeleteConfirmationModal
        open={Boolean(memberPendingSuspend)}
        onOpenChange={(open) => {
          if (!open) setMemberPendingSuspend(null);
        }}
        title={suspendConfig.title}
        description={suspendConfig.description}
        confirmLabel={suspendConfig.confirmLabel}
        onConfirm={confirmSuspendToggle}
      />

      {/* ======= DELETE CONFIRMATION DIALOG ======= */}
      <DeleteConfirmationModal
        open={Boolean(memberPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setMemberPendingDelete(null);
        }}
        title="Delete team member permanently?"
        description={`This will permanently delete "${memberPendingDelete?.name}" from the system. This action is irreversible and will remove all their active permissions.`}
        confirmLabel="Delete permanently"
        onConfirm={confirmDeleteMember}
      />

      <InfoBanner message="This page is strictly for managing organizational roles, system access, and user profile data." />
    </div>
  );
};

export default TeamView;
