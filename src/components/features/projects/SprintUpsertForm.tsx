/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MpmsDatePicker from "@/components/features/form/MpmsDatePicker";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsTextArea from "@/components/features/form/MpmsTextArea";
import { Button } from "@/components/ui/button";
import {
  useCreateSprintMutation,
  useGetSprintsQuery,
  useUpdateSprintMutation,
} from "@/redux/feature/sprints/sprintsApi";
import { Flag, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

type SprintMilestone = {
  id: string;
  name: string;
  dueDate: string;
};

type SprintFormValues = {
  sprintTitle: string;
  sprintNumber: string;
  startDate: string;
  endDate: string;
  sprintGoal: string;
  estimatedHours: string;
  teamCapacity: string;
  sprintLead: string;
  associatedProject: string;
  milestones: SprintMilestone[];
};

type SprintUpsertFormProps = {
  mode: "create" | "edit";
  projectId: string;
  sprintId?: string;
};

function SprintMilestonesField() {
  const { watch, setValue } = useFormContext<SprintFormValues>();
  const milestones = watch("milestones") ?? [];
  const nextMilestoneIdRef = useRef(100);

  const addMilestone = () => {
    setValue(
      "milestones",
      [
        ...milestones,
        {
          id: `ms-${nextMilestoneIdRef.current++}`,
          name: "",
          dueDate: "",
        },
      ],
      { shouldDirty: true },
    );
  };

  const removeMilestone = (id: string) => {
    setValue(
      "milestones",
      milestones.filter((item) => item.id !== id),
      { shouldDirty: true },
    );
  };

  return (
    <section className="border-border bg-card rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Flag className="size-4" />
          Sprint Milestones
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-2 text-xs font-semibold"
          onClick={addMilestone}
        >
          <Plus className="mr-1 size-3.5" />
          Add Milestone
        </Button>
      </div>

      <div className="space-y-2">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="grid gap-2 sm:grid-cols-[1fr_190px_auto] sm:items-end"
          >
            <MpmsInput
              name={`milestones.${index}.name`}
              label="Milestone Name"
              placeholder="Milestone name"
              size="md"
            />
            <MpmsDatePicker
              name={`milestones.${index}.dueDate`}
              label="Due Date"
              className="h-10 px-3"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground mb-0.5 h-10 w-10 rounded-md"
              onClick={() => removeMilestone(milestone.id)}
              aria-label="Remove milestone"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}

        {milestones.length === 0 ? (
          <button
            type="button"
            onClick={addMilestone}
            className="text-muted-foreground hover:bg-muted border-border flex h-10 w-full items-center gap-2 rounded-md border-dashed px-3 text-sm transition-colors"
          >
            <Plus className="size-3.5" />
            Add milestone
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function SprintUpsertForm({
  mode,
  projectId,
  sprintId,
}: SprintUpsertFormProps) {
  const isEdit = mode === "edit";
  const [createSprint, { isLoading: isCreating }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: isUpdating }] = useUpdateSprintMutation();
  const isSaving = isCreating || isUpdating;
  const router = useRouter();

  // Load project sprints to pre-populate edit form dynamically
  const { data: sprintDataRaw, isLoading: isLoadingSprints } =
    useGetSprintsQuery(projectId, {
      skip: !isEdit,
    });

  const sprints = Array.isArray(sprintDataRaw)
    ? sprintDataRaw
    : (sprintDataRaw as any)?.data || [];

  const currentSprint = sprints.find((s: any) => s._id === sprintId);

  // Load saved metadata from localStorage if exists
  let savedMeta: any = null;
  if (typeof window !== "undefined" && isEdit && sprintId) {
    const rawMeta = localStorage.getItem(`sprint_meta_${sprintId}`);
    if (rawMeta) {
      try {
        savedMeta = JSON.parse(rawMeta);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const defaultValues: SprintFormValues =
    isEdit && currentSprint
      ? {
          sprintTitle: currentSprint.title || "",
          sprintNumber: String(currentSprint.sprintNumber || 42),
          startDate: currentSprint.startDate
            ? (new Date(currentSprint.startDate)
                .toISOString()
                .split("T")[0] as string)
            : "",
          endDate: currentSprint.endDate
            ? (new Date(currentSprint.endDate)
                .toISOString()
                .split("T")[0] as string)
            : "",
          sprintGoal:
            savedMeta?.sprintGoal ||
            currentSprint.goal ||
            "Reduce infra overhead and finalize migration checkpoints for phase 3.",
          estimatedHours:
            savedMeta?.estimatedHours ||
            String(currentSprint.estimatedHours || 320),
          teamCapacity:
            savedMeta?.teamCapacity ||
            String(currentSprint.teamCapacity || 400),
          sprintLead:
            savedMeta?.sprintLead || currentSprint.sprintLead || "Alex Rivera",
          associatedProject:
            currentSprint.associatedProject || "Global Edge Network",
          milestones: savedMeta?.milestones ||
            currentSprint.milestones || [
              {
                id: "ms-1",
                name: "Schema Migration Completed",
                dueDate: "2023-10-15",
              },
            ],
        }
      : {
          sprintTitle: "",
          sprintNumber: "42",
          startDate: "",
          endDate: "",
          sprintGoal: "",
          estimatedHours: "320",
          teamCapacity: "400",
          sprintLead: "Alex Rivera",
          associatedProject: "Global Edge Network",
          milestones: [{ id: "ms-1", name: "", dueDate: "" }],
        };

  const onSubmit = async (data: SprintFormValues) => {
    try {
      const payload = {
        title: data.sprintTitle,
        startDate: data.startDate,
        endDate: data.endDate,
        status: isEdit ? currentSprint?.status || "PLANNING" : "PLANNING",
      };

      let activeSprintId = sprintId;
      if (isEdit && sprintId) {
        await updateSprint({ projectId, sprintId, data: payload }).unwrap();
        toast.success("Sprint updated successfully.");
      } else {
        const response = (await createSprint({
          projectId,
          data: payload,
        }).unwrap()) as any;
        activeSprintId = response?.data?._id || response?._id;
        toast.success("Sprint created successfully.");
      }

      if (activeSprintId) {
        const metadata = {
          sprintGoal: data.sprintGoal,
          estimatedHours: data.estimatedHours,
          teamCapacity: data.teamCapacity,
          sprintLead: data.sprintLead,
          milestones: data.milestones,
        };
        localStorage.setItem(
          `sprint_meta_${activeSprintId}`,
          JSON.stringify(metadata),
        );
      }

      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error("Sprint save error:", err);
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to save sprint.");
    }
  };

  if (isEdit && isLoadingSprints) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full pb-8">
      <MpmsForm<SprintFormValues>
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
              <span>Sprints</span>
              <span>&gt;</span>
              <span>{isEdit ? "Edit Sprint" : "New Sprint"}</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {isEdit ? "Edit Sprint" : "Create New Sprint"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Define a new iteration cycle for the Infrastructure Core team.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" asChild disabled={isSaving}>
              <Link href={`/projects/${projectId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Save Sprint"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <section className="border-border bg-card rounded-lg border p-4">
            <h3 className="mb-3 text-2xl font-semibold tracking-tight">
              General Configuration
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <MpmsInput
                name="sprintTitle"
                label="Sprint Title"
                required
                placeholder="e.g. Q3 Performance Optimization"
                size="md"
              />
              <div className="space-y-1">
                <MpmsInput
                  name="sprintNumber"
                  label="Sprint Number"
                  required
                  disabled
                  size="md"
                />
                <p className="text-muted-foreground text-right text-[10px] font-semibold tracking-wide uppercase">
                  Auto-increment
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <MpmsDatePicker
                name="startDate"
                label="Start Date"
                required
                className="h-10 px-3"
              />
              <MpmsDatePicker
                name="endDate"
                label="End Date"
                required
                className="h-10 px-3"
              />
            </div>

            <div className="mt-3">
              <MpmsTextArea
                name="sprintGoal"
                label="Sprint Goal"
                rows={4}
                required
                placeholder="Briefly describe the primary objective for this sprint..."
                size="md"
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <MpmsInput
                name="estimatedHours"
                label="Estimated Hours"
                type="number"
                required
                size="md"
              />
              <MpmsInput
                name="teamCapacity"
                label="Team Capacity"
                type="number"
                required
                size="md"
              />
              <MpmsInput
                name="sprintLead"
                label="Sprint Lead"
                required
                size="md"
              />
              <MpmsInput
                name="associatedProject"
                label="Associated Project"
                required
                size="md"
              />
            </div>
          </section>

          <SprintMilestonesField />

          <div className="flex items-center justify-end gap-2 sm:hidden">
            <Button variant="outline" asChild disabled={isSaving}>
              <Link href={`/projects/${projectId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Save Sprint"}
            </Button>
          </div>
        </div>
      </MpmsForm>
    </div>
  );
}
