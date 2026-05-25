import baseApi from "../../api/baseApi";
import { Sprint } from "@/types/domain.types";

export const sprintsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query<Sprint[], string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/sprints`,
        method: "GET",
      }),
      transformResponse: (response: { data: Sprint[] }) => response.data,
      providesTags: ["sprints"],
    }),
    createSprint: builder.mutation<
      Sprint,
      {
        projectId: string;
        data: {
          title: string;
          startDate: string;
          endDate: string;
          status: string;
        };
      }
    >({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/sprints`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: Sprint }) => response.data,
      invalidatesTags: ["sprints"],
    }),
    updateSprint: builder.mutation<
      Sprint,
      {
        projectId: string;
        sprintId: string;
        data: {
          title?: string;
          startDate?: string;
          endDate?: string;
          status?: string;
        };
      }
    >({
      query: ({ projectId, sprintId, data }) => ({
        url: `/projects/${projectId}/sprints/${sprintId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Sprint }) => response.data,
      invalidatesTags: ["sprints"],
    }),
    deleteSprint: builder.mutation<
      void,
      { projectId: string; sprintId: string }
    >({
      query: ({ projectId, sprintId }) => ({
        url: `/projects/${projectId}/sprints/${sprintId}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: void }) => response.data,
      invalidatesTags: ["sprints"],
    }),
  }),
});

export const {
  useGetSprintsQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsApi;
