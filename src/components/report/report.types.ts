import { z } from "zod";

export const TeamMemberStatusSchema = z.enum(["Peak", "Active", "Delayed"]);
export type TeamMemberStatus = z.infer<typeof TeamMemberStatusSchema>;

export const TeamReportItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string().url(),
  completion: z.number().min(0).max(100),
  score: z.number().min(0).max(5),
  status: TeamMemberStatusSchema,
});
export type TeamReportItem = z.infer<typeof TeamReportItemSchema>;

export const TagSchema = z.object({
  text: z.string(),
  tone: z.string(),
});
export type Tag = z.infer<typeof TagSchema>;
