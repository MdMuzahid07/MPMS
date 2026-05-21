/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../feature/auth/authSlice";
import { RootState } from "../store";

const url = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: url,
  credentials: "include",
  // extra added with fetchBaseQuery
  // in prepareHeaders we get two parameters (header,api), we get the getState() from the api
  prepareHeaders: (headers, { getState }) => {
    const fromStore = (getState() as RootState).auth.accessToken;
    const fromStorage =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null;
    const token = fromStore || fromStorage;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

// when our access token invalidate we are getting an error,
// we need to renew our access token by using refresh token
// to do this we can make an custom base query by following redux documentation (Implementing a custom baseQuery);
// we have to take tree arguments(args, api, and extraOptions) to create custom base query

const baseQueryWithRefreshToken = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  // we can call our baseQuery here with this three arguments received in custom base query
  let result = await baseQuery(args, api, extraOptions);
  let res;
  if (result?.error?.status === 401 && url) {
    res = await fetch(`${url}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
  }

  if (res) {
    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      await api.dispatch(
        setCredentials({
          user,
          accessToken: data?.data?.accessToken,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
    return result;
  }

  return result;
};

export const tagTypes = {
  user: "user",
  projects: "projects",
  sprints: "sprints",
  tasks: "tasks",
  teams: "teams",
  reports: "reports",
} as const;

export type TagType = (typeof tagTypes)[keyof typeof tagTypes];

const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({
  //     baseUrl: "http://localhost:5000/api/v1",
  //     credentials: "include"
  // }),
  // cleaner syntax => just storing in a variable and using here
  // we calling baseQuery in our custom base query, thats why it will call from there
  // because we called our baseQuery in our custom base query thats why we need to set here the custom one
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: Object.values(tagTypes),
  endpoints: () => ({}),
});

export default baseApi;
