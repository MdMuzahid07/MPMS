export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export type ProjectStatus =
  | "Active"
  | "At Risk"
  | "Completed"
  | "Planning"
  | "On Hold";

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  progressColor?: string;
  team?: User[];
}

export type SprintStatus = "Active" | "Completed" | "Upcoming";

export interface Sprint {
  id: string;
  title: string;
  dateRange: string;
  status: SprintStatus;
  progress: number;
  team: string[]; // Picture URLs or initials
}

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  estimate: string;
  status: TaskStatus;
  description: string;
  attachments?: string[];
  commentsCount?: number;
  comments?: Comment[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}
