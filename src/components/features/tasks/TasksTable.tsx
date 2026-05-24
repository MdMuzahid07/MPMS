"use client";

import { TaskRow } from "./TaskRow";
import type { TaskItem } from "./task.types";

interface TasksTableProps {
  tasks: TaskItem[];
  selectedTaskIds: string[];
  onSelectTask: (taskId: string, checked: boolean | "indeterminate") => void;
  onSelectAllVisible: (checked: boolean | "indeterminate") => void;
  onDeleteTask: (task: TaskItem) => void;
}

export const TasksTable = ({
  tasks,
  selectedTaskIds,
  onSelectTask,
  onSelectAllVisible,
  onDeleteTask,
}: TasksTableProps) => {
  const allVisibleSelected =
    tasks.length > 0 &&
    tasks.every((task) => selectedTaskIds.includes(task.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-255 border-collapse">
        <thead className="bg-muted/35">
          <tr className="border-border border-b">
            <th className="w-12 px-3 py-3 text-left">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={(e) => onSelectAllVisible(e.target.checked)}
              />
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              TASK TITLE
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              PROJECT
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              SPRINT
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              ASSIGNEE
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              PRIORITY
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              STATUS
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold tracking-wide">
              DUE DATE
            </th>
            <th className="w-10 px-3 py-3 text-left" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={selectedTaskIds.includes(task.id)}
              onSelect={onSelectTask}
              onDelete={onDeleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
