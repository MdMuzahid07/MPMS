"use client";

import {
  Project,
  ProjectCard,
} from "@/components/features/projects/ProjectCard";
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
import { Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data matching the screenshot
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Nexus HQ Expansion",
    client: "NexaCorp Industries",
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    progress: { completed: 12, total: 20 },
    timeline: { start: "Oct 12", end: "Dec 24" },
    team: [
      { id: "1", initials: "JD" },
      { id: "2", initials: "AK" },
      { id: "3", initials: "SA" },
      { id: "4", initials: "MK" },
      { id: "5", initials: "RJ" },
    ],
  },
  {
    id: "proj-2",
    title: "Infra Cloud Sync",
    client: "DataStream Systems",
    status: "On Hold",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    progress: { completed: 4, total: 15 },
    timeline: { start: "Sep 05", end: "Jan 15" },
    team: [
      { id: "1", initials: "JD" },
      { id: "2", initials: "AK" },
    ],
  },
  {
    id: "proj-3",
    title: "Neural Core v2",
    client: "BioTech Neural",
    status: "Completed",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    progress: { completed: 12, total: 12 },
    timeline: { start: "Aug 01", end: "Oct 30" },
    team: [
      { id: "1", initials: "JD" },
      { id: "2", initials: "AK" },
      { id: "3", initials: "SA" },
    ],
  },
  {
    id: "proj-4",
    title: "Core Design System",
    client: "Internal Product",
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    progress: { completed: 45, total: 60 },
    timeline: { start: "Oct 20", end: "Feb 10" },
    team: [{ id: "1", initials: "JD" }],
  },
];

export default function ProjectsView() {
  const [projectRows, setProjectRows] = useState(MOCK_PROJECTS);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [clientQuery, setClientQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const filteredProjects = projectRows.filter((project) => {
    const matchesStatus =
      statusFilter === "All Statuses" || project.status === statusFilter;
    const query = clientQuery.trim().toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      project.client.toLowerCase().includes(query) ||
      project.title.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

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
            <SelectTrigger className="bg-card border-border h-9 w-[140px] text-xs font-medium shadow-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
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
              placeholder="Search by client name..."
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={(target) => setPendingDelete(target)}
          />
        ))}

        {/* Create New Project Placeholder Card */}
        <Link
          href="/projects/new"
          className="group border-border/60 hover:border-primary/50 hover:bg-primary/5 flex min-h-[380px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-transparent p-6 text-center transition-all"
        >
          <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-foreground text-lg font-semibold tracking-tight">
            New Project
          </h3>
          <p className="text-muted-foreground mt-2 max-w-[200px] text-xs font-light">
            Start a new venture by configuring a workspace.
          </p>
        </Link>
      </div>

      <DeleteConfirmationModal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete project?"
        description={`This will permanently delete "${pendingDelete?.title ?? "this project"}".`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (!pendingDelete) return;
          setProjectRows((prev) =>
            prev.filter((project) => project.id !== pendingDelete.id),
          );
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
