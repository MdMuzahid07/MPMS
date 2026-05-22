"use client";

import MpmsDatePicker from "@/components/form/MpmsDatePicker";
import MpmsForm from "@/components/form/MpmsForm";
import MpmsInput from "@/components/form/MpmsInput";
import MpmsSelect from "@/components/form/MpmsSelect";
import MpmsTextArea from "@/components/form/MpmsTextArea";
import { Button } from "@/components/ui/button";
import { CloudUpload, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ProjectFormValues = {
  title: string;
  client: string;
  description: string;
  budget: string;
  status: string;
  startDate: string;
  endDate: string;
};

const PROJECT_FORM_SEED: Record<string, ProjectFormValues> = {
  "proj-1": {
    title: "Nexus HQ Expansion",
    client: "NexaCorp Industries",
    description:
      "Expand HQ network and deploy a resilient infrastructure layer.",
    budget: "428000",
    status: "Active",
    startDate: "2024-10-12",
    endDate: "2024-12-24",
  },
  "proj-2": {
    title: "Infra Cloud Sync",
    client: "DataStream Systems",
    description: "Stabilize cloud sync operations and improve fault recovery.",
    budget: "240000",
    status: "On Hold",
    startDate: "2024-09-05",
    endDate: "2025-01-15",
  },
  "proj-3": {
    title: "Neural Core v2",
    client: "BioTech Neural",
    description: "Ship v2 core module with upgraded compute and observability.",
    budget: "310000",
    status: "Completed",
    startDate: "2024-08-01",
    endDate: "2024-10-30",
  },
  "proj-4": {
    title: "Core Design System",
    client: "Internal Product",
    description: "Unify product UI components and documentation standards.",
    budget: "120000",
    status: "Planning",
    startDate: "2024-10-20",
    endDate: "2025-02-10",
  },
};

type ProjectEditFormProps = {
  projectId: string;
};

export function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const router = useRouter();
  const seed = PROJECT_FORM_SEED[projectId] ?? {
    title: "Untitled Project",
    client: "",
    description: "",
    budget: "",
    status: "Planning",
    startDate: "",
    endDate: "",
  };

  const onSubmit = (data: ProjectFormValues) => {
    console.log("Project update payload:", { projectId, ...data });
    toast.success("Project updated successfully.");
    router.push("/projects");
  };

  return (
    <MpmsForm<ProjectFormValues> defaultValues={seed} onSubmit={onSubmit}>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="border-border/60 bg-card rounded-xl border p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold tracking-tight">
              General Information
            </h2>
            <div className="space-y-4">
              <MpmsInput
                name="title"
                label="Project Title"
                required
                placeholder="e.g. Quantum System Migration"
              />
              <MpmsInput
                name="client"
                label="Client / Entity"
                required
                placeholder="Type client name"
              />
              <MpmsTextArea
                name="description"
                label="Description"
                rows={5}
                placeholder="Define project scope, objectives and key deliverables..."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <MpmsInput
                  name="budget"
                  label="Budget ($)"
                  type="number"
                  placeholder="0.00"
                />
                <MpmsSelect
                  name="status"
                  label="Status"
                  required
                  options={[
                    { value: "Planning", label: "Planning" },
                    { value: "Active", label: "Active" },
                    { value: "On Hold", label: "On Hold" },
                    { value: "Completed", label: "Completed" },
                  ]}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border-border/60 bg-card rounded-xl border p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold tracking-tight">
              Timeline
            </h2>
            <div className="space-y-4">
              <MpmsDatePicker name="startDate" label="Start Date" required />
              <MpmsDatePicker
                name="endDate"
                label="End Date (Estimated)"
                required
              />
            </div>
          </section>

          <section className="border-border/60 bg-card rounded-xl border p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold tracking-tight">
              Project Assets
            </h2>
            <div className="space-y-3">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Thumbnail
              </span>
              <button
                type="button"
                className="border-border bg-background/40 hover:bg-muted/50 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors"
              >
                <span className="bg-primary/12 text-primary mb-3 rounded-full p-3">
                  <CloudUpload className="size-6" />
                </span>
                <span className="text-sm font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-muted-foreground mt-1 text-[10px] uppercase">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
              </button>
            </div>
          </section>

          <section className="border-primary/20 bg-primary/5 text-primary flex gap-3 rounded-xl border p-4">
            <Info className="mt-0.5 size-5 shrink-0" />
            <p className="text-xs leading-relaxed">
              Update project metadata to keep timelines, ownership, and
              workspace access aligned with your current delivery plan.
            </p>
          </section>
        </div>
      </div>

      <div className="border-border/60 mt-6 flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row">
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full px-6 sm:w-auto">
          Save Changes
        </Button>
      </div>
    </MpmsForm>
  );
}
