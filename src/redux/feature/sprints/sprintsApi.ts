import baseApi from "../../api/baseApi";
import { Sprint } from "@/types/domain.types";

export const sprintsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query<Sprint[], string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/sprints`,
        method: "GET",
      }),
      providesTags: ["sprints"],
    }),
  }),
});

export const { useGetSprintsQuery } = sprintsApi;
