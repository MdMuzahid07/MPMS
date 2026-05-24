"use client";

import MpmsDatePicker from "@/components/features/form/MpmsDatePicker";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsRadioGroup from "@/components/features/form/MpmsRadioGroup";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import MpmsTextArea from "@/components/features/form/MpmsTextArea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CircleAlert, Clock3, Plus, UserPlus2, X } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

type TaskFormValues = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: string[];
  dueDate: string;
  estimatedHours: string;
  sprint: string;
  subtasks: { id: string; title: string; done: boolean }[];
};

type TaskUpsertFormProps = {
  mode: "create" | "update";
  projectId: string;
  sprintId: string;
  taskId?: string;
};

function TaskAssigneesField() {
  const { control, setValue, watch } = useFormContext<TaskFormValues>();
  const assignees = watch("assignees") ?? [];
  const [value, setValueInput] = useState("");

  const addAssignee = () => {
    const clean = value.trim();
    if (!clean) return;
    if (assignees.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setValueInput("");
      return;
    }
    setValue("assignees", [...assignees, clean], { shouldDirty: true });
    setValueInput("");
  };

  const removeAssignee = (name: string) => {
    setValue(
      "assignees",
      assignees.filter((item) => item !== name),
      { shouldDirty: true },
    );
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
        Assignees
      </label>
      <Controller
        name="assignees"
        control={control}
        rules={{
          validate: (value) =>
            Array.isArray(value) && value.length > 0
              ? true
              : "Please assign at least one member",
        }}
        render={({ fieldState }) => (
          <div
            className={cn(
              "rounded-md border border-slate-200 bg-white p-2.5 dark:border-[#1e1e2e] dark:bg-[#111118]/80",
              fieldState.error && "border-red-500",
            )}
          >
            <div className="mb-2 flex flex-wrap gap-1.5">
              {assignees.map((assignee) => (
                <Badge
                  key={assignee}
                  variant="outline"
                  className="h-6 rounded-sm border-slate-300 bg-slate-100 px-2 text-[10px] dark:border-[#2a2a3a] dark:bg-[#1a1a29]"
                >
                  <span className="bg-primary/80 text-primary-foreground mr-1 inline-flex size-3.5 items-center justify-center rounded-full text-[8px] font-semibold">
                    {assignee
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  {assignee}
                  <button
                    type="button"
                    onClick={() => removeAssignee(assignee)}
                    className="text-muted-foreground hover:text-foreground ml-1"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={value}
                onChange={(event) => setValueInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addAssignee();
                  }
                }}
                placeholder="Add assignee..."
                className="h-8 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-md text-xs"
                onClick={addAssignee}
              >
                <UserPlus2 className="mr-1 size-3.5" />
                Add
              </Button>
            </div>
            {fieldState.error && (
              <p className="mt-2 text-[11px] font-medium text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

function TaskSubtasksField() {
  const { control, setValue, watch } = useFormContext<TaskFormValues>();
  const subtasks = watch("subtasks") ?? [];
  const [subtaskInput, setSubtaskInput] = useState("");

  const addSubtask = () => {
    const clean = subtaskInput.trim();
    if (!clean) return;
    setValue(
      "subtasks",
      [...subtasks, { id: crypto.randomUUID(), title: clean, done: false }],
      { shouldDirty: true },
    );
    setSubtaskInput("");
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-[#1e1e2e]">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold">Subtasks</h3>
        <Badge variant="secondary" className="h-5 rounded-sm text-[10px]">
          {subtasks.filter((item) => item.done).length}/{subtasks.length}
        </Badge>
      </div>

      <Controller
        name="subtasks"
        control={control}
        render={() => (
          <div className="space-y-2">
            {subtasks.map((subtask, index) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 dark:border-[#1e1e2e]"
              >
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.done}
                    onCheckedChange={(checked) => {
                      const updated = [...subtasks];
                      const subtaskItem = updated[index];
                      if (subtaskItem) {
                        updated[index] = { ...subtaskItem, done: !!checked };
                        setValue("subtasks", updated, { shouldDirty: true });
                      }
                    }}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      subtask.done && "text-muted-foreground line-through",
                    )}
                  >
                    {subtask.title}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "subtasks",
                      subtasks.filter((item) => item.id !== subtask.id),
                      { shouldDirty: true },
                    )
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={subtaskInput}
                onChange={(event) => setSubtaskInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSubtask();
                  }
                }}
                placeholder="Add subtask"
                className="border-input h-9 flex-1 rounded-md border bg-transparent px-2.5 text-sm outline-none"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-md text-xs"
                onClick={addSubtask}
              >
                <Plus className="mr-1 size-3.5" />
                Add
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export function TaskUpsertForm({ mode, taskId }: TaskUpsertFormProps) {
  const defaultValues: TaskFormValues = {
    title:
      mode === "update"
        ? "Implement GraphQL Subscription for Real-time Log Updates"
        : "",
    description:
      mode === "update"
        ? [
            "## Implementation Plan",
            "1. Define the LogUpdated subscription in the schema.",
            "2. Hook into the existing LogWorker to publish events.",
            "3. Update the client-side Apollo link to support WebSockets.",
            "",
            "The real-time updates should handle up to 500 events/sec without UI lag. Ensure we throttle the dispatch to the React state.",
          ].join("\n")
        : "",
    status: mode === "update" ? "in-progress" : "todo",
    priority: mode === "update" ? "medium" : "high",
    assignees: mode === "update" ? ["Alex Rivera", "Sarah Chen"] : [],
    dueDate: mode === "update" ? "2024-11-28" : "",
    estimatedHours: mode === "update" ? "12" : "",
    sprint: mode === "update" ? "sprint-42" : "",
    subtasks:
      mode === "update"
        ? [
            {
              id: "1",
              title: "schema definition for subscription type",
              done: true,
            },
            { id: "2", title: "Redis PubSub integration", done: false },
            {
              id: "3",
              title: "Frontend WebSocket connection setup",
              done: false,
            },
          ]
        : [],
  };

  const onSubmit = (data: TaskFormValues) => {
    console.log("Task form payload:", data);
    toast.success(
      mode === "update"
        ? "Task updated successfully."
        : "Task created successfully.",
    );
  };

  return (
    <div className="container mx-auto w-full pb-8">
      <MpmsForm<TaskFormValues>
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      >
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-[#1e1e2e]">
              <MpmsInput
                label="Task Title"
                name="title"
                required
                placeholder="Write task title..."
                className="h-11"
              />
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-[#1e1e2e]">
              <MpmsTextArea
                label="Description"
                name="description"
                required
                rows={10}
                className="min-h-55"
                placeholder="Describe the task requirements..."
              />
            </div>

            <TaskSubtasksField />
          </div>

          <aside className="rounded-lg border border-slate-200 p-4 dark:border-[#1e1e2e]">
            <div className="space-y-4">
              <MpmsSelect
                name="status"
                label="Status"
                required
                options={[
                  { value: "todo", label: "To Do" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                  { value: "done", label: "Done" },
                ]}
              />

              <MpmsRadioGroup
                name="priority"
                label="Priority"
                required
                orientation="horizontal"
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />

              <TaskAssigneesField />

              <div className="grid grid-cols-2 gap-3">
                <MpmsDatePicker
                  name="dueDate"
                  label="Due Date"
                  required
                  className="h-11"
                />
                <MpmsInput
                  name="estimatedHours"
                  label="Estimated Hours"
                  required
                  type="number"
                  placeholder="12"
                  className="h-11"
                />
              </div>

              <MpmsSelect
                name="sprint"
                label="Sprint"
                required
                options={[
                  { value: "sprint-42", label: "Sprint 42: Andromeda" },
                  { value: "sprint-41", label: "Sprint 41: Atlas" },
                  { value: "backlog", label: "Backlog" },
                ]}
              />

              {mode === "update" && (
                <div className="space-y-1 rounded-md border border-slate-200 p-3 dark:border-[#1e1e2e]">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Clock3 className="size-3.5" />
                    Last Updated
                  </p>
                  <p className="text-xs font-medium">2 hours ago</p>
                  <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-[11px]">
                    <CircleAlert className="size-3.5" />
                    Reporter
                  </p>
                  <p className="text-xs font-medium">Marcus Thorne</p>
                </div>
              )}
            </div>
          </aside>
        </section>

        <footer className="border-border mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Auto-saved at 14:32
            {mode === "update" && taskId ? ` • ${taskId}` : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" className="px-4">
              Discard Changes
            </Button>
            <Button type="submit" className="px-5">
              {mode === "update" ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </footer>
      </MpmsForm>
    </div>
  );
}

export type { TaskFormValues };
