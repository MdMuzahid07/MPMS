import baseApi from "../../api/baseApi";
import type { Project, ProjectStats } from "@/types/domain.types";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // READ LIST
    getProjects: builder.query<
      Project[],
      {
        status?: string;
        client?: string;
        search?: string;
        userId?: string;
      } | void
    >({
      query: (params) => ({
        url: `/projects`,
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response: { data: Project[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "projects" as const,
                id: _id,
              })),
              { type: "projects", id: "LIST" },
            ]
          : [{ type: "projects", id: "LIST" }],
    }),

    // READ SINGLE
    getProjectById: builder.query<Project, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "GET" }),
      transformResponse: (response: { data: Project }) => response.data,
      providesTags: (_, __, id) => [{ type: "projects", id }],
    }),

    // CREATE
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: `/projects`, method: "POST", body }),
      transformResponse: (response: { data: Project }) => response.data,
      invalidatesTags: [{ type: "projects", id: "LIST" }],
    }),

    // UPDATE
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Project }) => response.data,
      invalidatesTags: (_, __, { id }) => [{ type: "projects", id }],
    }),

    // DELETE
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      transformResponse: (response: { data: void }) => response.data,
      invalidatesTags: [{ type: "projects", id: "LIST" }],
    }),

    // STATS
    getProjectStats: builder.query<ProjectStats, string>({
      query: (id) => ({ url: `/projects/${id}/stats`, method: "GET" }),
      transformResponse: (response: { data: ProjectStats }) => response.data,
      providesTags: (_, __, id) => [{ type: "reports", id }],
    }),

    // ADD MEMBER
    addProjectMember: builder.mutation<
      Project,
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { userId },
      }),
      transformResponse: (response: { data: Project }) => response.data,
      invalidatesTags: (_, __, { projectId }) => [
        { type: "projects", id: projectId },
      ],
    }),

    // REMOVE MEMBER
    removeProjectMember: builder.mutation<
      Project,
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Project }) => response.data,
      invalidatesTags: (_, __, { projectId }) => [
        { type: "projects", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectStatsQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectsApi;
