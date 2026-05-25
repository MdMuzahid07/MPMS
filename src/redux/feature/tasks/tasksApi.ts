/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task } from "@/types/domain.types";
import baseApi from "../../api/baseApi";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string>({
      query: (sprintId) => ({
        url: `/sprint/${sprintId}/tasks`,
        method: "GET",
      }),
      providesTags: ["tasks"],
    }),
    getAllTasks: builder.query<{ tasks: Task[]; pagination: any }, any>({
      query: (params) => ({
        url: `/tasks`,
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response: {
        data: { tasks: Task[]; pagination: any };
      }) => response.data,
      providesTags: ["tasks"],
    }),
    createTask: builder.mutation<
      Task,
      {
        projectId: string;
        sprintId: string;
        data: {
          title: string;
          description?: string;
          priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
          status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
          dueDate?: string;
          estimate?: number;
          assignees?: string[];
          subtasks?: { title: string; completed: boolean }[];
        };
      }
    >({
      query: ({ projectId, sprintId, data }) => ({
        url: `/projects/${projectId}/sprints/${sprintId}/tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    getTaskById: builder.query<Task, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Task }) => response.data,
      providesTags: ["tasks"],
    }),
    updateTask: builder.mutation<
      Task,
      {
        taskId: string;
        data: {
          title?: string;
          description?: string;
          priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
          status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
          dueDate?: string;
          estimate?: number;
          assignees?: string[];
          subtasks?: { title: string; completed: boolean }[];
        };
      }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    deleteTask: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (taskId) => ({
          url: `/tasks/${taskId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["tasks"],
      },
    ),
    getComments: builder.query<unknown[], string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}/comments`,
        method: "GET",
      }),
      transformResponse: (response: { data: unknown[] }) => response.data,
      providesTags: ["tasks"],
    }),
    createComment: builder.mutation<
      unknown,
      { taskId: string; data: { body: string; parentComment?: string } }
    >({
      query: ({ taskId, data }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    deleteComment: builder.mutation<
      unknown,
      { taskId: string; commentId: string }
    >({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
    getActivityLogs: builder.query<unknown[], string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}/activity`,
        method: "GET",
      }),
      transformResponse: (response: { data: unknown[] }) => response.data,
      providesTags: ["tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetActivityLogsQuery,
} = tasksApi;
