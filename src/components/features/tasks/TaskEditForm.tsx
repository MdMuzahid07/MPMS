"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TaskItem, TaskPriority, TaskStatus } from "./task.types";
import { useState } from "react";

type TaskEditFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskItem | null;
  onSave: (task: TaskItem) => void;
};

type TaskEditDraft = {
  title: string;
  project: string;
  sprint: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
};

function normalizeSprintForInput(value: string) {
  return value.replace("\n", " ");
}

function normalizeSprintForTable(value: string) {
  if (value.includes("\n")) return value;
  if (value.includes("- ")) return value.replace("- ", "-\n");
  return value;
}

function normalizeDueDateForInput(value: string) {
  return value.replace(",\n", ", ");
}

function normalizeDueDateForTable(value: string) {
  if (value.includes("\n")) return value;
  return value.replace(", ", ",\n");
}

function createDraft(task: TaskItem | null): TaskEditDraft {
  return {
    title: task?.title ?? "",
    project: task?.project ?? "",
    sprint: task ? normalizeSprintForInput(task.sprint) : "",
    assignee: task?.assignee ?? "",
    priority: task?.priority ?? "Medium",
    status: task?.status ?? "Progress",
    dueDate: task ? normalizeDueDateForInput(task.dueDate) : "",
  };
}

export function TaskEditForm({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskEditFormProps) {
  const [draft, setDraft] = useState<TaskEditDraft>(() => createDraft(task));

  const [prevTask, setPrevTask] = useState<TaskItem | null>(null);
  if (task !== prevTask) {
    setPrevTask(task);
    setDraft(createDraft(task));
  }

  const handleSave = () => {
    if (!task) return;

    onSave({
      ...task,
      title: draft.title.trim(),
      project: draft.project.trim(),
      sprint: normalizeSprintForTable(draft.sprint.trim()),
      assignee: draft.assignee.trim() || "Unassigned",
      priority: draft.priority,
      status: draft.status,
      dueDate: normalizeDueDateForTable(draft.dueDate.trim()),
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Update task details, assignee, priority and delivery timeline.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Task Title</label>
            <Input
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Project</label>
            <Input
              value={draft.project}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, project: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Sprint</label>
            <Input
              value={draft.sprint}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, sprint: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Assignee</label>
            <Input
              value={draft.assignee}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, assignee: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Priority</label>
              <Select
                value={draft.priority}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    priority: value as TaskPriority,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Status</label>
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: value as TaskStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Progress">Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Due Date</label>
            <Input
              value={draft.dueDate}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              placeholder="Oct 24, 2023"
            />
          </div>
        </div>

        <SheetFooter className="mt-auto border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
