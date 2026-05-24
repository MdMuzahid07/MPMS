import baseApi from "../../api/baseApi";
import { Project } from "@/types/domain";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
      providesTags: ["projects"],
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApi;
