import { logout } from "@/redux/feature/auth/authSlice";
import type { Store } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
  baseURL: url,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Avoid circular dependency by injecting the store
let store: Store | undefined;

export const injectStore = (_store: Store) => {
  store = _store;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (store) {
      // Use any to avoid complex circular typing, or infer state if possible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = store.getState() as any;
      const token = state.auth.accessToken;
      if (token) {
        // Backend expects raw token without "Bearer " prefix based on current implementation
        config.headers.Authorization = `${token}`;
      }
    }

    // Automatically let browser set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store) {
      store.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
