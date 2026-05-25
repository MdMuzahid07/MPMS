/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MpmsDatePicker from "@/components/features/form/MpmsDatePicker";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsTextArea from "@/components/features/form/MpmsTextArea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetSprintsQuery } from "@/redux/feature/sprints/sprintsApi";
import {
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} from "@/redux/feature/tasks/tasksApi";
import { useUploadAttachmentMutation } from "@/redux/feature/upload/uploadApi";
import { useGetUsersQuery } from "@/redux/feature/users/usersApi";
import {
  CircleAlert,
  Clock3,
  FileUp,
  Loader2,
  Paperclip,
  Plus,
  UserPlus2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
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
  attachments: {
    url: string;
    filename: string;
    publicId: string;
    resourceType?: "image" | "raw";
  }[];
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
  const { data: usersData, isLoading } = useGetUsersQuery({ limit: 100 });
  const members = usersData?.members ?? [];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssignee = (id: string) => {
    if (assignees.includes(id)) {
      setValue(
        "assignees",
        assignees.filter((item) => item !== id),
        { shouldDirty: true },
      );
    } else {
      setValue("assignees", [...assignees, id], { shouldDirty: true });
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative space-y-1">
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
          <div>
            {/* Popover trigger */}
            <div className="border-input bg-background/50 ring-offset-background flex min-h-[38px] w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              {assignees.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-muted-foreground hover:text-foreground flex w-full items-center gap-1.5 py-1 text-left text-xs transition-colors"
                >
                  <UserPlus2 className="size-3.5" />
                  <span>Assign to team members...</span>
                </button>
              ) : (
                <div className="flex w-full flex-wrap items-center gap-1.5">
                  <div className="mr-1 flex -space-x-1.5 overflow-hidden">
                    {assignees.map((id) => {
                      const member = members.find((m) => m.id === id);
                      if (!member) return null;
                      return (
                        <div
                          key={id}
                          className="border-background bg-primary text-primary-foreground inline-flex size-6 items-center justify-center rounded-full border-2 text-[8px] font-bold select-none"
                          title={member.name}
                        >
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="border-muted-foreground/40 bg-background hover:bg-muted text-muted-foreground hover:text-foreground inline-flex size-6 items-center justify-center rounded-full border border-dashed text-xs transition"
                    title="Add/Edit Assignees"
                  >
                    <Plus className="size-3" />
                  </button>
                  <span className="text-muted-foreground ml-2 text-[10px] font-medium">
                    {assignees.length} assigned
                  </span>
                </div>
              )}
            </div>

            {/* Absolute Popover */}
            {isOpen && (
              <>
                {/* Click outside backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />

                <div className="border-border bg-popover animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-1 w-full rounded-lg border p-2 shadow-lg duration-150">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search team members..."
                    className="border-input focus:ring-primary/40 focus:border-primary/50 text-foreground mb-2 h-8.5 w-full rounded-md border bg-transparent px-2.5 text-xs outline-none focus:ring-1"
                    autoFocus
                  />
                  <div className="bg-background/30 h-44 scrollbar-thin space-y-0.5 overflow-y-auto rounded-md p-1 pr-1">
                    {isLoading ? (
                      <p className="text-muted-foreground p-3 text-center text-xs">
                        Loading members...
                      </p>
                    ) : filteredMembers.length === 0 ? (
                      <p className="text-muted-foreground p-3 text-center text-xs">
                        No members found
                      </p>
                    ) : (
                      filteredMembers.map((member) => {
                        const isChecked = assignees.includes(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => toggleAssignee(member.id)}
                            className={cn(
                              "hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition select-none",
                              isChecked && "bg-accent/60",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="border-input text-primary focus:ring-primary pointer-events-none mr-0.5 size-3.5 rounded"
                            />
                            <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-[9px] font-bold">
                              {member.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground mb-0.5 truncate text-xs leading-none font-semibold">
                                {member.name}
                              </p>
                              <p className="text-muted-foreground truncate text-[9px] leading-none">
                                {member.role} • {member.department}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {fieldState.error && (
              <p className="mt-1.5 text-[11px] font-medium text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

function TaskAttachmentsField() {
  const { setValue, watch } = useFormContext<TaskFormValues>();
  const attachments = watch("attachments") ?? [];
  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadAttachment(formData).unwrap();
        const newAttachment = {
          url: response.secure_url,
          filename: response.original_filename || file.name,
          publicId: response.public_id,
          resourceType: file.type.startsWith("image/")
            ? ("image" as const)
            : ("raw" as const),
        };
        setValue("attachments", [...attachments, newAttachment], {
          shouldDirty: true,
        });
        toast.success("File uploaded successfully.");
      } catch (err) {
        console.error("File upload error:", err);
        toast.error("Failed to upload file.");
      }
    }
  };

  const removeAttachment = (publicId: string) => {
    setValue(
      "attachments",
      attachments.filter((item) => item.publicId !== publicId),
      { shouldDirty: true },
    );
  };

  return (
    <section className="border-border/50 bg-card space-y-4 rounded-xl border p-6">
      <h3 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Paperclip className="size-4 text-indigo-500" />
        Attachments (PDF / Images)
      </h3>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold">
            Uploaded Files
          </p>
          <div className="grid gap-2">
            {attachments.map((att) => (
              <div
                key={att.publicId}
                className="bg-muted/20 border-border flex items-center justify-between rounded-lg border p-2.5"
              >
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary flex max-w-[250px] items-center gap-2 truncate text-xs font-semibold hover:underline"
                >
                  <Paperclip className="size-3.5" />
                  {att.filename}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(att.publicId)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-md"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-border bg-muted/10 hover:bg-muted/20 relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <Loader2 className="text-primary size-6 animate-spin" />
            <p className="text-foreground text-xs font-semibold">
              Uploading file to secure storage...
            </p>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <FileUp className="text-muted-foreground mb-2 size-7" />
            <div>
              <p className="text-foreground text-xs font-semibold">
                Click to upload or drag & drop
              </p>
              <p className="text-muted-foreground mt-1 text-[10px]">
                PDF or Image files up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </section>
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
    <div className="border-border/50 bg-card rounded-xl border p-6">
      <div className="mb-6 flex items-center gap-2">
        <h3 className="text-foreground text-lg font-semibold tracking-tight">
          Subtasks
        </h3>
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
                className="bg-muted/30 border-border flex items-center justify-between rounded-md border px-3 py-2.5"
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

export function TaskUpsertForm({
  mode,
  projectId,
  sprintId,
  taskId: _taskId,
}: TaskUpsertFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const { data: taskData } = useGetTaskByIdQuery(_taskId || "", {
    skip: mode !== "update" || !_taskId,
  });

  const { data: sprintDataRaw, isLoading: isLoadingSprints } =
    useGetSprintsQuery(projectId);
  const sprints = Array.isArray(sprintDataRaw)
    ? sprintDataRaw
    : (sprintDataRaw as unknown as { data?: unknown[] })?.data || [];
  const router = useRouter();

  const defaultValues: TaskFormValues = {
    title: "",
    description: "",
    status: "todo",
    priority: "high",
    assignees: [],
    dueDate: "",
    estimatedHours: "",
    sprint: sprintId,
    subtasks: [],
    attachments: [],
  };

  const methods = useForm<TaskFormValues>({
    defaultValues,
  });

  const { control, setValue, reset } = methods;

  // Pre-populate values on update
  useEffect(() => {
    if (mode === "update" && taskData) {
      const tData = (taskData as any)?.data || taskData;
      const statusMap: Record<string, string> = {
        TODO: "todo",
        IN_PROGRESS: "in-progress",
        REVIEW: "review",
        DONE: "done",
      };
      const priorityMap: Record<string, string> = {
        LOW: "low",
        MEDIUM: "medium",
        HIGH: "high",
        CRITICAL: "high",
      };

      reset({
        title: tData.title ?? "",
        description: tData.description ?? "",
        status: statusMap[tData.status] ?? "todo",
        priority: priorityMap[tData.priority] ?? "high",

        assignees:
          tData.assignees?.map((a: any) =>
            typeof a === "string" ? a : a._id,
          ) ?? [],
        dueDate: tData.dueDate
          ? new Date(tData.dueDate).toISOString().split("T")[0]
          : "",
        estimatedHours: tData.estimate ? String(tData.estimate) : "",

        sprint:
          typeof tData.sprint === "object" && tData.sprint
            ? (tData.sprint as any)._id
            : (tData.sprint ?? sprintId),

        subtasks:
          tData.subtasks?.map((st: any) => ({
            id: st._id,
            title: st.title,
            done: st.completed,
          })) ?? [],

        attachments:
          tData.attachments?.map((att: any) => ({
            url: att.url,
            filename: att.filename,
            publicId: att.publicId,
            resourceType: att.resourceType,
          })) ?? [],
      });
    }
  }, [mode, taskData, reset, sprintId]);

  const isSaving = isCreating || isUpdating;

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const statusMap: Record<
        string,
        "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
      > = {
        todo: "TODO",
        "in-progress": "IN_PROGRESS",
        review: "REVIEW",
        done: "DONE",
      };
      const priorityMap: Record<
        string,
        "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      > = {
        low: "LOW",
        medium: "MEDIUM",
        high: "HIGH",
      };

      const payload = {
        title: data.title,
        description: data.description,
        status: statusMap[data.status] || "TODO",
        priority: priorityMap[data.priority] || "MEDIUM",
        dueDate: data.dueDate || undefined,
        estimate: Number(data.estimatedHours) || undefined,
        assignees: data.assignees,
        attachments: data.attachments,
        subtasks: data.subtasks?.map((st) => ({
          title: st.title,
          completed: st.done,
        })),
      };

      const targetSprintId =
        data.sprint && data.sprint !== "backlog" ? data.sprint : sprintId;

      if (mode === "update" && _taskId) {
        await updateTask({ taskId: _taskId, data: payload }).unwrap();
      } else {
        await createTask({
          projectId,
          sprintId: targetSprintId,
          data: payload,
        }).unwrap();
      }

      toast.success(
        mode === "update"
          ? "Task updated successfully."
          : "Task created successfully.",
      );
      if (targetSprintId && targetSprintId !== "backlog") {
        router.push(`/projects/${projectId}/sprints/${targetSprintId}`);
      } else {
        router.push(`/projects/${projectId}`);
      }
    } catch (err) {
      console.error("Task save error:", err);
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to save task.");
    }
  };

  return (
    <MpmsForm<TaskFormValues> onSubmit={onSubmit} methods={methods}>
      <div className="mt-8 w-full space-y-6 pb-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
        {/* Left Column: General Information & Subtasks */}
        <div className="space-y-8 lg:col-span-2">
          <div className="border-border/50 bg-card rounded-xl border p-6">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              General Information
            </h3>

            <div className="space-y-5">
              <MpmsInput
                name="title"
                label="Task Title"
                placeholder="e.g., Refactor Auth Middleware"
                required
              />

              <MpmsTextArea
                name="description"
                label="Description"
                placeholder="Describe the task requirements, objectives, or acceptance criteria..."
                rows={8}
                required
              />
            </div>
          </div>

          <TaskSubtasksField />
          <TaskAttachmentsField />
        </div>

        {/* Right Column: Settings & Schedule */}
        <div className="space-y-6">
          {/* Card 1: Task Settings */}
          <div className="border-border/50 bg-card space-y-6 rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold tracking-tight">
              Task Settings
            </h3>

            <div className="space-y-5">
              {/* Premium Status Selection with color dots */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Status <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-background/50 border-input h-10 w-full text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-slate-400" />
                            <span>To Do</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-indigo-500" />
                            <span>In Progress</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="review">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-amber-500" />
                            <span>Review</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="done">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span>Done</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Status-matching Segmented Control for Priority */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Priority <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <div className="bg-muted/50 border-border grid grid-cols-3 gap-1 rounded-lg border p-1">
                      {["high", "medium", "low"].map((p) => {
                        const active = field.value === p;
                        const labelMap: Record<string, string> = {
                          high: "High",
                          medium: "Medium",
                          low: "Low",
                        };
                        const colorMap: Record<string, string> = {
                          high: active
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "text-muted-foreground hover:text-red-400 hover:bg-red-500/5",
                          medium: active
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "text-muted-foreground hover:text-amber-400 hover:bg-amber-500/5",
                          low: active
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "text-muted-foreground hover:text-blue-400 hover:bg-blue-500/5",
                        };
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() =>
                              setValue("priority", p, { shouldDirty: true })
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-center rounded-md border border-transparent py-1.5 text-xs font-semibold capitalize transition",
                              colorMap[p],
                              active && "border-border border shadow-sm",
                            )}
                          >
                            {labelMap[p]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Premium custom Sprint Selector */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Sprint <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="sprint"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-background/50 border-input h-10 w-full text-sm">
                        <SelectValue placeholder="Select sprint" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSprints ? (
                          <SelectItem value={sprintId} disabled>
                            Loading sprints...
                          </SelectItem>
                        ) : (
                          sprints?.map((s: any) => (
                            <SelectItem key={s._id} value={s._id}>
                              {s.title}
                            </SelectItem>
                          ))
                        )}
                        <SelectItem value="backlog">Backlog</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Assignment & Schedule */}
          <div className="border-border/50 bg-card space-y-6 rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold tracking-tight">
              Assignment & Schedule
            </h3>

            <div className="space-y-5">
              <TaskAssigneesField />

              <div className="grid grid-cols-2 gap-4">
                <MpmsDatePicker name="dueDate" label="Due Date" required />
                <MpmsInput
                  name="estimatedHours"
                  label="Estimated Hours"
                  required
                  type="number"
                  placeholder="12"
                />
              </div>
            </div>
          </div>

          {mode === "update" && (
            <div className="border-border/50 bg-card space-y-4 rounded-xl border p-6">
              <h3 className="text-foreground text-lg font-semibold tracking-tight">
                History & Reporter
              </h3>
              <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
                  <Clock3 className="size-3.5" />
                  <span>Last Updated</span>
                </div>
                <p className="text-foreground text-xs font-semibold">
                  2 hours ago
                </p>

                <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
                  <CircleAlert className="size-3.5" />
                  <span>Reporter</span>
                </div>
                <p className="text-foreground text-xs font-semibold">
                  Marcus Thorne
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="border-border mt-6 flex items-center justify-between border-t pt-6 pb-4">
        <p className="text-muted-foreground text-xs font-medium">
          {mode === "update" && _taskId ? ` • ${_taskId}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-lg px-5 text-sm font-medium"
            asChild
            disabled={isSaving}
          >
            <Link href={`/projects/${projectId}`}>Discard Changes</Link>
          </Button>
          <Button
            type="submit"
            className="h-10 rounded-lg px-6 text-sm font-semibold shadow-sm"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : mode === "update"
                ? "Update Task"
                : "Create Task"}
          </Button>
        </div>
      </footer>
    </MpmsForm>
  );
}

export type { TaskFormValues };
