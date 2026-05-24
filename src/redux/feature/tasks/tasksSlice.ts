/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockData } from "@/data/mockData";
import { ActivityLog, Task, TaskStatus } from "@/types/domain.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TasksState {
  tasksBySprint: Record<string, Task[]>;
  activityLogsByTask: Record<string, ActivityLog[]>;
}

const initialState: TasksState = {
  tasksBySprint: {
    "sprint-4": mockData.getTasksBySprint("sprint-4"),
  },
  activityLogsByTask: {
    "task-1": mockData.getActivityLogs("task-1"),
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasksForSprint: (
      state,
      action: PayloadAction<{ sprintId: string; tasks: Task[] }>,
    ) => {
      const { sprintId, tasks } = action.payload;
      state.tasksBySprint[sprintId] = tasks;
    },
    updateTaskStatusInStore: (
      state,
      action: PayloadAction<{
        sprintId: string;
        taskId: string;
        status: TaskStatus;
        user: string;
      }>,
    ) => {
      const { sprintId, taskId, status, user } = action.payload;
      const list = state.tasksBySprint[sprintId];
      if (list) {
        const task = list.find((t: any) => (t.id || t._id) === taskId);
        if (task) {
          const oldStatus = task.status;
          task.status = status;

          // Append to Activity Logs
          const newLog: any = {
            id: `log-${Date.now()}`,
            user,
            action: `changed status from ${oldStatus} to ${status}`,
            timestamp: "Just now",
          };
          const logs = state.activityLogsByTask[taskId] || [];
          state.activityLogsByTask[taskId] = [newLog, ...logs];
        }
      }
    },
    addCommentToTaskInStore: (
      state,
      action: PayloadAction<{
        sprintId: string;
        taskId: string;
        content: string;
        author: string;
        avatar: string;
      }>,
    ) => {
      const { sprintId, taskId, content, author, avatar } = action.payload;
      const list = state.tasksBySprint[sprintId];
      if (list) {
        const task = list.find((t: any) => (t.id || t._id) === taskId);
        if (task) {
          const newComment: any = {
            id: `c-${Date.now()}`,
            author,
            avatar,
            timestamp: "Just now",
            content,
            likes: 0,
            hasLiked: false,
          };
          task.comments = [...(task.comments || []), newComment];
          (task as any).commentsCount = task.comments.length;

          // Append to Activity Logs
          const newLog: any = {
            id: `log-${Date.now()}`,
            user: author,
            action: "added a comment",
            timestamp: "Just now",
          };
          const logs = state.activityLogsByTask[taskId] || [];
          state.activityLogsByTask[taskId] = [newLog, ...logs];
        }
      }
    },
    likeCommentInStore: (
      state,
      action: PayloadAction<{
        sprintId: string;
        taskId: string;
        commentId: string;
      }>,
    ) => {
      const { sprintId, taskId, commentId } = action.payload;
      const list = state.tasksBySprint[sprintId];
      if (list) {
        const task = list.find((t: any) => (t.id || t._id) === taskId);
        if (task && task.comments) {
          task.comments = task.comments.map((c: any) => {
            if ((c.id || c._id) === commentId) {
              return {
                ...c,
                likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
                hasLiked: !c.hasLiked,
              };
            }
            return c;
          });
        }
      }
    },
  },
});

export const {
  setTasksForSprint,
  updateTaskStatusInStore,
  addCommentToTaskInStore,
  likeCommentInStore,
} = tasksSlice.actions;
export default tasksSlice.reducer;
