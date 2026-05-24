export type ProjectStatus = "planned" | "active" | "completed" | "archived";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member";
  department?: string;
  skills?: string[];
  avatar?: string;
}

export interface Project {
  _id: string;
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  thumbnail?: string;
  members: User[];
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  totalSprints: number;
  totalTasks: number;
  completedTasks: number;
  inReview: number;
  remaining: number;
  percentComplete: number;
}

export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
  _id: string;
  projectId: string;
  title: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Comment {
  _id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  action: string;
  performedBy: User;
  createdAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  sprintId: string;
  title: string;
  description?: string;
  assignees: User[];
  estimateHours?: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  attachments?: string[];
  comments?: Comment[];
  activityLogs?: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}
