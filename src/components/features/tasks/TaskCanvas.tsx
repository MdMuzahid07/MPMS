"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { KanbanBoard } from "./KanbanBoard";
import type { TaskItem, TaskStatus } from "./task.types";
import { TaskEditForm } from "./TaskEditForm";
import { TasksTable } from "./TasksTable";

interface TaskCanvasProps {
  initialTasks: TaskItem[];
  title?: string;
  subtitle?: string;
  hideFiltersForMember?: boolean;
}

export const TaskCanvas = ({
  initialTasks,
  title,
  subtitle,
  hideFiltersForMember = false,
}: TaskCanvasProps) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [sprintFilter, setSprintFilter] = useState<string>("all");

  // Selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Edit & Delete modal states
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Extract unique filter items for dropdowns dynamically
  const uniqueSprints = useMemo(() => {
    const sprints = tasks.map((t) => t.sprint.replace("\n", " ").trim());
    return Array.from(new Set(sprints)).filter(Boolean);
  }, [tasks]);

  const uniqueAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.assignee))).filter(Boolean);
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "all" || task.assignee === assigneeFilter;
      const matchesSprint =
        sprintFilter === "all" ||
        task.sprint.replace("\n", " ").trim() === sprintFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesSprint
      );
    });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    sprintFilter,
  ]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  const handleSaveEdit = (updatedTask: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
    setSelectedTaskIds((prev) => prev.filter((id) => id !== deletingTask.id));
    setIsDeleteDialogOpen(false);
    setDeletingTask(null);
  };

  const handleSelectTask = (
    taskId: string,
    checked: boolean | "indeterminate",
  ) => {
    if (checked === true) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAllVisible = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const visibleIds = filteredTasks.map((t) => t.id);
      setSelectedTaskIds(visibleIds);
    } else {
      setSelectedTaskIds([]);
    }
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all" ||
    sprintFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setSprintFilter("all");
  };

  return (
    <div className="animate-in fade-in space-y-5 duration-200">
      {/* Header Panel */}
      {(title || subtitle) && (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            {title && (
              <h2 className="text-foreground text-xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-xs font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Control Canvas (Switcher & Filters) */}
      <div className="border-border flex flex-col gap-4 rounded-xl border bg-[#f4f4f7]/60 p-4 dark:bg-[#111118]/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Quick Search */}
          <div className="relative max-w-md flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by title, code, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border focus:ring-primary/20 h-9 pr-8 pl-9 text-xs focus:ring-1 dark:bg-[#1b1b23]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle & Clear Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground flex h-9 items-center gap-1.5 px-3 text-xs font-semibold hover:bg-[#1b1b23]"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filters</span>
              </Button>
            )}

            <div className="bg-muted border-border flex h-9 items-center rounded-lg border p-1 dark:bg-[#1b1b23]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("board")}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all",
                  viewMode === "board"
                    ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent",
                )}
              >
                <LayoutGrid className="size-3.5" />
                <span>Board</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent",
                )}
              >
                <List className="size-3.5" />
                <span>List</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Row */}
        {!hideFiltersForMember && (
          <div className="border-border/40 grid grid-cols-2 gap-2 border-t pt-3 sm:grid-cols-4 sm:gap-3">
            {/* Status Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground pl-1 text-[10px] font-bold tracking-wider uppercase">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border-border text-foreground hover:border-border/80 focus:border-primary/50 h-8.5 cursor-pointer rounded-lg border px-3 text-xs transition duration-150 outline-none dark:bg-[#1b1b23]"
              >
                <option value="all">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground pl-1 text-[10px] font-bold tracking-wider uppercase">
                Priority
              </span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-background border-border text-foreground hover:border-border/80 focus:border-primary/50 h-8.5 cursor-pointer rounded-lg border px-3 text-xs transition duration-150 outline-none dark:bg-[#1b1b23]"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assignee Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground pl-1 text-[10px] font-bold tracking-wider uppercase">
                Assignee
              </span>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="bg-background border-border text-foreground hover:border-border/80 focus:border-primary/50 h-8.5 max-w-full cursor-pointer rounded-lg border px-3 text-xs transition duration-150 outline-none dark:bg-[#1b1b23]"
              >
                <option value="all">All Assignees</option>
                {uniqueAssignees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sprint Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground pl-1 text-[10px] font-bold tracking-wider uppercase">
                Sprint
              </span>
              <select
                value={sprintFilter}
                onChange={(e) => setSprintFilter(e.target.value)}
                className="bg-background border-border text-foreground hover:border-border/80 focus:border-primary/50 h-8.5 cursor-pointer rounded-lg border px-3 text-xs transition duration-150 outline-none dark:bg-[#1b1b23]"
              >
                <option value="all">All Sprints</option>
                {uniqueSprints.map((sprint) => (
                  <option key={sprint} value={sprint}>
                    {sprint}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Render Canvas Contents */}
      <div className="border-border overflow-hidden rounded-xl border bg-[#f4f4f7]/40 p-4 dark:bg-[#111118]/40">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <SlidersHorizontal className="text-muted-foreground/45 mb-4 size-10" />
            <h3 className="text-foreground text-sm font-semibold">
              No Tasks Found
            </h3>
            <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
              No tasks match your search or filter configuration. Try adjusting
              your query or resetting filters.
            </p>
          </div>
        ) : viewMode === "board" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onSelectTask={(task) => {
              setEditingTask(task);
              setIsEditDialogOpen(true);
            }}
            onDeleteTask={(task) => {
              setDeletingTask(task);
              setIsDeleteDialogOpen(true);
            }}
          />
        ) : (
          <TasksTable
            tasks={filteredTasks}
            selectedTaskIds={selectedTaskIds}
            onSelectTask={handleSelectTask}
            onSelectAllVisible={handleSelectAllVisible}
            onDeleteTask={(task) => {
              setDeletingTask(task);
              setIsDeleteDialogOpen(true);
            }}
          />
        )}
      </div>

      {/* Interactive Sheet Form & Confirm Dialog */}
      <TaskEditForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={editingTask}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={deletingTask?.title ?? ""}
      />
    </div>
  );
};
