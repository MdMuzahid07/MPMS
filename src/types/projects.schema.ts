import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  client: z.string().min(2, "Client name must be at least 2 characters"),
  description: z.string().optional(),
  budget: z.union([z.string(), z.number()]).optional(),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  startDate: z.string().min(1, "A start date is required."),
  endDate: z.string().min(1, "An end date is required."),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
