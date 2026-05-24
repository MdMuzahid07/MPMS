export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Progress" | "Review" | "To Do" | "Done";

export type TaskItem = {
  id: string;
  title: string;
  code: string;
  project: string;
  sprint: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  sprintId: string;
  taskId: string;
};
