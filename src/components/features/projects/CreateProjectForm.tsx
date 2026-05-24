/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MpmsDatePicker from "@/components/features/form/MpmsDatePicker";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import MpmsTextArea from "@/components/features/form/MpmsTextArea";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/handleApiError";
import { useCreateProjectMutation } from "@/redux/feature/projects/projectsApi";
import { useUploadImageMutation } from "@/redux/feature/upload/uploadApi";
import { CreateProjectDto, createProjectSchema } from "@/types/projects.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Info, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateProjectForm() {
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const methods = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      client: "",
      description: "",
      budget: "",
      status: "planned",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: CreateProjectDto) => {
    try {
      const projectData = {
        title: data.title,
        client: data.client,
        description: data.description,
        budget: data.budget ? Number(data.budget) : undefined,
        status: data.status,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      };

      await createProject(projectData).unwrap();
      toast.success("Project workspace generated successfully!");
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
      toast.success("Image uploaded successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to upload image.");
    }
  };

  const removeThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnailUrl("");
  };

  return (
    <MpmsForm<CreateProjectDto> onSubmit={onSubmit} methods={methods}>
      <div className="mt-8 w-full space-y-6 overflow-hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
        {/* Left Column: General Information */}
        <div className="space-y-8 lg:col-span-2">
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              General Information
            </h3>

            <div className="space-y-5">
              <MpmsInput
                name="title"
                label="Project Title"
                placeholder="e.g., Quantum System Migration"
                required
              />

              <MpmsInput
                name="client"
                label="Client / Entity"
                placeholder="Select or type client name"
                required
              />

              <MpmsTextArea
                name="description"
                label="Description"
                placeholder="Define project scope, objectives, and key deliverables..."
                rows={4}
              />

              <div className="grid grid-cols-2 gap-4">
                <MpmsInput
                  name="budget"
                  label="Budget ($)"
                  type="number"
                  placeholder="0.00"
                />

                <MpmsSelect
                  name="status"
                  label="Status"
                  options={[
                    { label: "Planning", value: "planned" },
                    { label: "Active", value: "active" },
                    { label: "On Hold", value: "archived" },
                    { label: "Completed", value: "completed" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Assets */}
        <div className="space-y-6">
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              Timeline
            </h3>
            <div className="space-y-5">
              <MpmsDatePicker name="startDate" label="Start Date" required />

              <MpmsDatePicker
                name="endDate"
                label="End Date (Estimated)"
                required
              />
            </div>
          </div>

          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              Project Assets
            </h3>
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
                ) : thumbnailUrl ? (
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
                      <CloudUpload className="h-6 w-6" />
                    </div>
                    <p className="text-foreground text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px] uppercase">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-border/50 bg-primary/5 text-primary flex gap-3 rounded-xl border p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-xs leading-relaxed opacity-90">
              Complete the project metadata to automatically generate a
              collaboration workspace and assign initial team leads.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 pb-12 lg:col-span-3 lg:pb-0">
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-muted w-full text-xs font-semibold sm:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full px-6 text-xs font-semibold shadow-sm sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </div>
    </MpmsForm>
  );
}
