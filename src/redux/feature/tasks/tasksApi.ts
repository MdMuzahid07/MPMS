import baseApi from "../../api/baseApi";
import { Task } from "@/types/domain.types";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string>({
      query: (sprintId) => ({
        url: `/sprint/${sprintId}/tasks`,
        method: "GET",
      }),
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
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} = tasksApi;
