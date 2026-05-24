export type TeamRole = "Admin" | "Manager" | "Member";
export type TeamStatus = "Active" | "Inactive";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department: string;
  skills: string[];
  status: TeamStatus;
  avatar: string;
};
