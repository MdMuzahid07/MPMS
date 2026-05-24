/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MpmsDatePicker from "@/components/features/form/MpmsDatePicker";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import MpmsTextArea from "@/components/features/form/MpmsTextArea";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/handleApiError";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/redux/feature/projects/projectsApi";
import { useUploadImageMutation } from "@/redux/feature/upload/uploadApi";
import { UpdateProjectDto, updateProjectSchema } from "@/types/projects.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Info, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ProjectEditFormProps = {
  projectId: string;
};

export function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const router = useRouter();
  const { data: project, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isThumbnailEdited, setIsThumbnailEdited] = useState(false);

  const currentThumbnailUrl = isThumbnailEdited
    ? thumbnailUrl
    : project?.thumbnail || "";

  // Format dates for input type="date"
  const defaultStartDate = project?.startDate
    ? new Date(project.startDate).toISOString().split("T")[0]
    : "";
  const defaultEndDate = project?.endDate
    ? new Date(project.endDate).toISOString().split("T")[0]
    : "";

  const defaultValues: Partial<UpdateProjectDto> = {
    title: project?.title || "",
    client: project?.client || "",
    description: project?.description || "",
    budget: project?.budget || "",
    status: project?.status || "planned",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  const methods = useForm<UpdateProjectDto>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues,
  });

  // Reset values when project is loaded
  useEffect(() => {
    if (project) {
      methods.reset({
        title: project.title,
        client: project.client,
        description: project.description,
        budget: project.budget,
        status: project.status,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      });
    }
  }, [project, methods, defaultStartDate, defaultEndDate]);

  if (isProjectLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  const onSubmit = async (data: UpdateProjectDto) => {
    try {
      const projectData = {
        ...(data.title && { title: data.title }),
        ...(data.client && { client: data.client }),
        ...(data.description && { description: data.description }),
        ...(data.budget !== undefined && { budget: Number(data.budget) }),
        ...(data.status && { status: data.status }),
        ...(data.startDate && {
          startDate: new Date(data.startDate).toISOString(),
        }),
        ...(data.endDate && { endDate: new Date(data.endDate).toISOString() }),
        thumbnail: currentThumbnailUrl, // set whatever url is current (can be empty string if removed)
      };

      await updateProject({ id: projectId, data: projectData }).unwrap();
      toast.success("Project updated successfully.");
      router.push("/projects");
    } catch (error: any) {
      if (error && error.status === 400) {
        const errorSources = error.data?.errorSources;
        if (Array.isArray(errorSources)) {
          errorSources.forEach((src: any) => {
            if (src.path) {
              methods.setError(src.path as any, {
                type: "server",
                message: src.message,
              });
            } else {
              toast.error(src.message);
            }
          });
        } else {
          toast.error(error.data?.message || "Invalid input details.");
        }
      } else {
        handleApiError(error);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResult = await uploadImage(formData).unwrap();
      const secureUrl =
        (uploadResult as any).data?.secure_url ||
        (uploadResult as any).secure_url;
      setThumbnailUrl(secureUrl);
      setIsThumbnailEdited(true);
      toast.success("Image uploaded successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to upload image.");
    }
  };

  const removeThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnailUrl("");
    setIsThumbnailEdited(true);
  };

  return (
    <MpmsForm<UpdateProjectDto> onSubmit={onSubmit} methods={methods}>
      <div className="mt-6 grid w-full gap-6 overflow-hidden lg:grid-cols-3">
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
                    { value: "planned", label: "Planning" },
                    { value: "active", label: "Active" },
                    { value: "archived", label: "On Hold" },
                    { value: "completed", label: "Completed" },
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
              <div className="border-border/80 bg-background/50 hover:bg-muted/50 relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground text-xs">
                      Uploading image...
                    </p>
                  </div>
                ) : currentThumbnailUrl ? (
                  <div className="group relative h-full min-h-30 w-full overflow-hidden rounded-md">
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      width={500}
                      height={128}
                      className="h-32 w-full rounded-md object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 shadow-sm transition-transform hover:scale-105"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                      onChange={handleFileChange}
                    />
                    <div className="bg-primary/10 text-primary mb-3 rounded-full p-3">
                      <CloudUpload className="size-6" />
                    </div>
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-muted-foreground mt-1 text-[10px] uppercase">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </span>
                  </>
                )}
              </div>
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
        <Button
          type="submit"
          disabled={isUpdating || isUploading}
          className="w-full px-6 sm:w-auto"
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </MpmsForm>
  );
}
