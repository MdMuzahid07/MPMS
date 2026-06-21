"use client";

import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { DeleteConfirmationModal } from "@/components/features/tasks/DeleteConfirmationModal";
import { InfoBanner } from "@/components/shared/InfoBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce"; // Ensure this exists, or use local timeout. We'll use a local timeout.
import { handleApiError } from "@/lib/handleApiError";
import ProjectsViewSkeleton from "@/skeleton/projects/ProjectsViewSkeleton";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/redux/feature/projects/projectsApi";
import type { Project } from "@/types/domain.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
  CalendarDays,
  ExternalLink,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectsView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientQuery, setClientQuery] = useState("");
  const debouncedQuery = useDebounce(clientQuery, 300);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const queryParams: Record<string, string> = {};
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (debouncedQuery) queryParams.search = debouncedQuery; // backend uses $text or client regex

  const { data: projects, isLoading, error } = useGetProjectsQuery(queryParams);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProject(pendingDelete._id).unwrap();
      toast.success("Project deleted successfully");
      setPendingDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Errors handled by handleApiError, but we can do local catch
    }
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-light">
            Manage and track your ongoing infrastructure developments.
          </p>
        </div>
        <Button
          asChild
          className="h-10 w-full gap-2 border px-5 font-semibold sm:w-auto"
        >
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="border-border/60 bg-card/40 flex flex-col items-center gap-4 rounded-xl border p-4 sm:flex-row">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
            Status:
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-border h-9 w-35 border text-xs font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planned">Planning</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-border mx-2 hidden h-4 w-px sm:block" />

        <div className="flex w-full flex-1 items-center gap-4">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
            Client:
          </span>
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="bg-card border-border h-9 border pl-9 text-xs focus-visible:ring-1"
              value={clientQuery}
              onChange={(event) => setClientQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="ml-auto flex w-full items-center justify-end gap-1.5 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="bg-card border-border text-muted-foreground h-9 w-9 border"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <div className="border-border bg-card flex items-center rounded-md border p-0.5">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className={`h-8 w-8 ${
                viewMode === "list"
                  ? "bg-muted text-foreground border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className={`h-8 w-8 ${
                viewMode === "grid"
                  ? "bg-muted text-foreground border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <ProjectsViewSkeleton />
      ) : !isLoading && projects?.length === 0 ? (
        <div className="border-border/60 bg-card/20 animate-in fade-in flex min-h-100 flex-col items-center justify-center rounded-xl border-dashed py-12 text-center">
          <div className="bg-muted/50 text-muted-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <h3 className="text-foreground text-lg font-semibold tracking-tight">
            No projects found
          </h3>
          <p className="text-muted-foreground mt-2 max-w-75 text-sm font-light">
            We {`couldn't`} find any projects matching your current filters. Try
            adjusting your search.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setClientQuery("");
              }}
              className="border text-xs"
            >
              Clear Filters
            </Button>
            <Button asChild className="border text-xs" variant="default">
              <Link href="/projects/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New Project
              </Link>
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={(target) => setPendingDelete(target)}
            />
          ))}

          {/* Create New Project Placeholder Card */}
          <Link
            href="/projects/new"
            className="group border-border/50 hover:border-primary/30 hover:bg-primary/5 bg-card/10 flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center backdrop-blur-xl transition-all duration-300"
          >
            <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110">
              <Plus className="h-7 w-7" />
            </div>
            <h3 className="text-foreground group-hover:text-primary text-lg font-bold tracking-tight transition-colors">
              New Project
            </h3>
            <p className="text-muted-foreground mt-2 max-w-[200px] text-xs leading-relaxed font-medium">
              Start a new venture by configuring a custom project workspace.
            </p>
          </Link>
        </div>
      ) : (
        <div className="border-border/60 bg-card overflow-x-auto rounded-xl border">
          <table className="w-full min-w-245 border-collapse text-left">
            <thead className="bg-muted/15 border-border border-b">
              <tr>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Project Name
                </th>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Client
                </th>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Status
                </th>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Timeline
                </th>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Budget
                </th>
                <th className="text-muted-foreground px-5 py-4 text-xs font-bold tracking-wider uppercase">
                  Team
                </th>
                <th className="w-12 px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y">
              {projects?.map((project) => {
                const getStatusStyle = (status: Project["status"]) => {
                  switch (status) {
                    case "active":
                      return "border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";
                    case "completed":
                      return "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
                    case "planned":
                      return "border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
                    case "archived":
                      return "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
                    default:
                      return "border-muted bg-muted/50 text-muted-foreground";
                  }
                };

                const getStatusDot = (status: Project["status"]) => {
                  switch (status) {
                    case "active":
                      return "bg-indigo-500";
                    case "completed":
                      return "bg-emerald-500";
                    case "planned":
                      return "bg-blue-500";
                    case "archived":
                      return "bg-amber-500";
                    default:
                      return "bg-muted-foreground";
                  }
                };

                return (
                  <tr
                    key={project._id}
                    className="hover:bg-muted/10 border-border/40 border-b transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/projects/${project._id}`}
                        className="text-foreground hover:text-primary block text-sm font-bold transition-colors"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="text-muted-foreground px-5 py-4 text-xs font-semibold tracking-wider uppercase">
                      {project.client}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${getStatusStyle(
                          project.status,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            project.status,
                          )}`}
                        />
                        {project.status}
                      </Badge>
                    </td>
                    <td className="text-foreground/80 px-5 py-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="text-primary h-3.5 w-3.5 shrink-0 opacity-80" />
                        <span>
                          {project.startDate
                            ? format(
                                new Date(project.startDate),
                                "MMM dd, yyyy",
                              )
                            : "TBD"}{" "}
                          —{" "}
                          {project.endDate
                            ? format(new Date(project.endDate), "MMM dd, yyyy")
                            : "TBD"}
                        </span>
                      </div>
                    </td>
                    <td className="text-foreground px-5 py-4 text-xs font-bold">
                      {project.budget
                        ? `$${project.budget.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "$0.00"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex -space-x-1.5 overflow-hidden p-0.5">
                        {project.members?.slice(0, 3).map((member) => {
                          const initials = member.name
                            .substring(0, 2)
                            .toUpperCase();
                          return (
                            <Avatar
                              key={member._id}
                              className="ring-background border-border/50 inline-block h-6 w-6 rounded-full border ring-2"
                            >
                              <AvatarImage src={member.avatar} alt={initials} />
                              <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {(project.members?.length ?? 0) > 3 && (
                          <div className="bg-muted border-border/50 ring-background flex h-6 w-6 items-center justify-center rounded-full border ring-2">
                            <span className="text-foreground/70 text-[9px] font-extrabold">
                              +{(project.members?.length ?? 0) - 3}
                            </span>
                          </div>
                        )}
                        {(!project.members || project.members.length === 0) && (
                          <span className="text-muted-foreground text-xs font-medium italic">
                            No team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-muted h-8 w-8 rounded-lg border-none"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl border"
                        >
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/projects/${project._id}`}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/projects/${project._id}/edit`}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            onClick={() => setPendingDelete(project)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete project?"
        description={`This will permanently delete "${pendingDelete?.title ?? "this project"}".`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
      />

      <InfoBanner message="This page displays all your strategic projects. You can filter by status, search by client, and manage high-level project details here." />
    </div>
  );
}
