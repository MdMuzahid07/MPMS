/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../../api/baseApi";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewReport: builder.query<
      {
        totalProjects: number;
        activeProjects: number;
        activeSprints: number;
        openTasks: number;
        completedTasks: number;
        totalUsers: number;
        totalHoursLogged: number;
      },
      void
    >({
      query: () => ({
        url: "/report/overview",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["reports"],
    }),
    getProjectsReport: builder.query<any[], void>({
      query: () => ({
        url: "/report/projects",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["reports"],
    }),
    getUsersReport: builder.query<any[], void>({
      query: () => ({
        url: "/report/users",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["reports"],
    }),
    getSprintsReport: builder.query<any[], void>({
      query: () => ({
        url: "/report/sprints",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetOverviewReportQuery,
  useGetProjectsReportQuery,
  useGetUsersReportQuery,
  useGetSprintsReportQuery,
} = reportsApi;
