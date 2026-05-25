"use client";

import { TaskItem, DashboardTask } from "./TaskItem";

interface ActiveTasksWidgetProps {
  tasks: DashboardTask[];
  totalCount: number;
  onViewAll?: () => void;
  onTaskClick?: (taskId: string) => void;
}

export const ActiveTasksWidget = ({
  tasks,
  totalCount,
  onViewAll,
  onTaskClick,
}: ActiveTasksWidgetProps) => {
  return (
    <div className="bg-card border-border rounded-lg border p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">
          Active Tasks
        </h3>
        <span className="text-label-sm bg-surface-container-high border-border text-primary rounded border px-2 py-1 font-bold">
          {totalCount.toString().padStart(2, "0")} Total
        </span>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
      <button
        onClick={onViewAll}
        className="text-label-md text-on-surface-variant hover:text-primary border-border hover:border-primary/20 mt-6 w-full rounded-lg border-dashed py-2 text-center font-bold transition-colors"
      >
        View All Tasks
      </button>
    </div>
  );
};
