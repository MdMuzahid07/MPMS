import {
  TeamMember,
  TeamRole,
  TeamStatus,
} from "@/components/features/team/team.types";
import baseApi from "../../api/baseApi";

interface ServerUser {
  _id: string;
  name: string;
  email: string;
  role?: "ADMIN" | "MANAGER" | "MEMBER";
  department?: string;
  skills?: string[];
  status?: "active" | "inactive";
  avatar?: string;
}

interface ServerUsersResponse {
  users: ServerUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const mapServerUserToTeamMember = (user: ServerUser): TeamMember => {
  const role = user.role || "MEMBER";
  const status = user.status || "active";

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: user._id || (user as any).id,
    name: user.name,
    email: user.email,
    role: (role.charAt(0).toUpperCase() +
      role.slice(1).toLowerCase()) as TeamRole,
    department: user.department || "Core Platform",
    skills: user.skills || [],
    status: (status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()) as TeamStatus,
    avatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
  };
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      {
        members: TeamMember[];
        totalCount: number;
        totalPages: number;
      },
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
        department?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.department)
          queryParams.append("department", params.department);

        if (params.role && params.role !== "all") {
          queryParams.append("role", params.role.toLowerCase());
        }
        if (params.status && params.status !== "all") {
          queryParams.append("status", params.status.toLowerCase());
        }

        return {
          url: `/user?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: ServerUsersResponse }) => {
        const serverData = response.data;
        return {
          members: (serverData.users || []).map(mapServerUserToTeamMember),
          totalCount: serverData.pagination?.total ?? 0,
          totalPages: serverData.pagination?.totalPages ?? 1,
        };
      },
      providesTags: ["user"],
    }),

    getUserById: builder.query<TeamMember, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ServerUser }) =>
        mapServerUserToTeamMember(response.data),
      providesTags: (_result, _error, id) => [{ type: "user", id }],
    }),

    createUser: builder.mutation<TeamMember, Record<string, unknown>>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ServerUser }) =>
        mapServerUserToTeamMember(response.data),
      invalidatesTags: ["user"],
    }),

    updateUser: builder.mutation<
      TeamMember,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: ServerUser }) =>
        mapServerUserToTeamMember(response.data),
      invalidatesTags: ["user"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
