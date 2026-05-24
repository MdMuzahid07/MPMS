import baseApi from "../../api/baseApi";
import { Task } from "@/types/domain";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string>({
      query: (sprintId) => ({
        url: `/sprints/${sprintId}/tasks`,
        method: "GET",
      }),
      providesTags: ["tasks"],
    }),
  }),
});

export const { useGetTasksQuery } = tasksApi;
