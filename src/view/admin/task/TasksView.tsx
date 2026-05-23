"use client";

import { FilterBar, TablePagination, TasksTable } from "@/components/tasks";
import { DeleteConfirmationModal } from "@/components/tasks/DeleteConfirmationModal";
import type { TaskItem } from "@/components/tasks/task.types";
import { useMemo, useState } from "react";

// ============================================
// Types & Schemas (Zod as source of truth)
// ============================================

// ============================================
// Constants
// ============================================

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Implement OAuth2 Authentication Flow",
    code: "TASK-1024",
    project: "Vortex UI",
    sprint: "Q4-\nSprint 3",
    assignee: "Alex R.",
    priority: "High",
    status: "Progress",
    dueDate: "Oct 24,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1024",
  },
  {
    id: "2",
    title: "API Endpoint Optimization for Analytics",
    code: "TASK-1025",
    project: "Pulse Analytics",
    sprint: "Q4-\nSprint 3",
    assignee: "Sarah K.",
    priority: "Medium",
    status: "Review",
    dueDate: "Oct 26,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-09",
    taskId: "task-1025",
  },
  {
    id: "3",
    title: "Refactor Legacy Shaders",
    code: "TASK-0992",
    project: "Aether Engine",
    sprint: "Backlog",
    assignee: "Unassigned",
    priority: "Low",
    status: "To Do",
    dueDate: "Nov 12,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-backlog",
    taskId: "task-0992",
  },
  {
    id: "4",
    title: "Documentation for SDK v2.4",
    code: "TASK-1102",
    project: "Vortex UI",
    sprint: "Q4-\nSprint 3",
    assignee: "Marcus T.",
    priority: "Medium",
    status: "Done",
    dueDate: "Oct 20,\n2023",
    projectId: "nc-4902",
    sprintId: "sprint-08",
    taskId: "task-1102",
  },
];

// Visual style maps moved into dedicated components

// ============================================
// Helper Functions
// ============================================

// Helper utilities

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

// ============================================
// Sub-components
// ============================================

// All subcomponent types and implementations moved to `components/tasks`

// ============================================
// Main Tasks View Component
// ============================================

interface TasksViewProps {
  initialTasksData?: TaskItem[];
  onTaskCreated?: () => void;
}

export const TasksView = ({
  initialTasksData = INITIAL_TASKS,
  onTaskCreated,
}: TasksViewProps) => {
  const [taskRows, setTaskRows] = useState(initialTasksData);
  const [projectFilter, setProjectFilter] = useState("all-projects");
  const [sprintFilter, setSprintFilter] = useState("current-sprint");
  const [assigneeFilter, setAssigneeFilter] = useState("all-assignees");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [taskPendingDelete, setTaskPendingDelete] = useState<TaskItem | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const projectOptions = useMemo(() => {
    const uniqueProjects = Array.from(
      new Set(taskRows.map((task) => task.project)),
    );
    return [
      { value: "all-projects", label: "All Projects" },
      ...uniqueProjects.map((project) => ({
        value: normalizeString(project),
        label: project,
      })),
    ];
  }, [taskRows]);

  const assigneeOptions = useMemo(() => {
    const uniqueAssignees = Array.from(
      new Set(taskRows.map((task) => task.assignee)),
    );
    return [
      { value: "all-assignees", label: "Assignee: All" },
      ...uniqueAssignees.map((assignee) => ({
        value: normalizeString(assignee),
        label: assignee,
      })),
    ];
  }, [taskRows]);

  const filteredTasks = useMemo(() => {
    return taskRows
      .filter((task) => {
        if (projectFilter !== "all-projects") {
          if (normalizeString(task.project) !== projectFilter) return false;
        }
        if (sprintFilter === "current-sprint") {
          if (!task.sprint.toLowerCase().includes("sprint 3")) return false;
        }
        if (sprintFilter === "backlog") {
          if (!task.sprint.toLowerCase().includes("backlog")) return false;
        }
        if (assigneeFilter !== "all-assignees") {
          if (normalizeString(task.assignee) !== assigneeFilter) return false;
        }
        if (statusFilter !== "all-status") {
          if (normalizeString(task.status) !== statusFilter) return false;
        }
        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [taskRows, projectFilter, sprintFilter, assigneeFilter, statusFilter]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  const handleSelectAllVisible = (checked: boolean | "indeterminate") => {
    if (checked) {
      setSelectedTaskIds((prev) => {
        const merged = new Set([
          ...prev,
          ...paginatedTasks.map((task) => task.id),
        ]);
        return Array.from(merged);
      });
    } else {
      setSelectedTaskIds((prev) =>
        prev.filter(
          (taskId) => !paginatedTasks.some((task) => task.id === taskId),
        ),
      );
    }
  };

  const handleSelectTask = (
    taskId: string,
    checked: boolean | "indeterminate",
  ) => {
    if (checked) {
      setSelectedTaskIds((prev) =>
        prev.includes(taskId) ? prev : [...prev, taskId],
      );
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleDeleteTask = (task: TaskItem) => {
    setTaskRows((prev) => prev.filter((t) => t.id !== task.id));
    setSelectedTaskIds((prev) => prev.filter((id) => id !== task.id));
    setTaskPendingDelete(null);
  };

  return (
    <div className="w-full space-y-4 pb-8">
      <FilterBar
        projectFilter={projectFilter}
        sprintFilter={sprintFilter}
        assigneeFilter={assigneeFilter}
        statusFilter={statusFilter}
        projectOptions={projectOptions}
        assigneeOptions={assigneeOptions}
        onProjectFilterChange={setProjectFilter}
        onSprintFilterChange={setSprintFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        onStatusFilterChange={setStatusFilter}
        onCreateTaskClick={onTaskCreated}
      />

      <section className="bg-card border-border overflow-hidden rounded-lg border">
        <TasksTable
          tasks={paginatedTasks}
          selectedTaskIds={selectedTaskIds}
          onSelectTask={handleSelectTask}
          onSelectAllVisible={handleSelectAllVisible}
          onDeleteTask={setTaskPendingDelete}
        />
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredTasks.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      <DeleteConfirmationModal
        open={Boolean(taskPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setTaskPendingDelete(null);
        }}
        title="Delete task?"
        description={`This will permanently delete "${taskPendingDelete?.title ?? "this task"}".`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (taskPendingDelete) handleDeleteTask(taskPendingDelete);
        }}
      />
    </div>
  );
};

// Default export for Next.js page compatibility
export default TasksView;
