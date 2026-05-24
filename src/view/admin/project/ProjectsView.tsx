"use client";

import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { DeleteConfirmationModal } from "@/components/features/tasks/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce"; // Ensure this exists, or use local timeout. We'll use a local timeout.
import { handleApiError } from "@/lib/handleApiError";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/redux/feature/projects/projectsApi";
import type { Project } from "@/types/domain.types";
import { Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectsView() {
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
          className="h-10 w-full gap-2 px-5 font-semibold shadow-sm sm:w-auto"
        >
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="border-border/60 bg-card/40 flex flex-col items-center gap-4 rounded-xl border p-4 shadow-sm sm:flex-row">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
            Status:
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-border h-9 w-35 text-xs font-medium shadow-sm">
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
              className="bg-card border-border h-9 pl-9 text-xs shadow-sm focus-visible:ring-1"
              value={clientQuery}
              onChange={(event) => setClientQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="ml-auto flex w-full items-center justify-end gap-1.5 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="bg-card border-border text-muted-foreground h-9 w-9 shadow-sm"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <div className="border-border bg-card flex items-center rounded-md border p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-muted h-8 w-8 shadow-sm"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-border/50 bg-card flex h-100 flex-col rounded-xl border shadow-sm"
            >
              <Skeleton className="h-40 w-full rounded-t-xl rounded-b-none" />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-2 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex -space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
                <div className="border-border/50 mt-6 flex items-center justify-between border-t pt-4">
                  <Skeleton className="h-8 w-24" />
                  <div className="flex gap-1">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading && projects?.length === 0 ? (
        <div className="border-border/60 bg-card/20 animate-in fade-in flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
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
              className="text-xs shadow-sm"
            >
              Clear Filters
            </Button>
            <Button asChild className="text-xs shadow-sm" variant="default">
              <Link href="/projects/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New Project
              </Link>
            </Button>
          </div>
        </div>
      ) : (
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
            className="group border-border/60 hover:border-primary/50 hover:bg-primary/5 flex min-h-95 flex-col items-center justify-center rounded-xl border-2 border-dashed bg-transparent p-6 text-center transition-all"
          >
            <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-foreground text-lg font-semibold tracking-tight">
              New Project
            </h3>
            <p className="text-muted-foreground mt-2 max-w-50 text-xs font-light">
              Start a new venture by configuring a workspace.
            </p>
          </Link>
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
    </div>
  );
}
