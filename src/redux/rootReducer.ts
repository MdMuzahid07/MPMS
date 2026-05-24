import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "./feature/auth/authSlice";
import projectsReducer from "./feature/projects/projectsSlice";
import sprintsReducer from "./feature/sprints/sprintsSlice";
import tasksReducer from "./feature/tasks/tasksSlice";
import baseApi from "./api/baseApi";

// SSR-Safe Storage Fallback
const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user", "isAuthenticated"],
};

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  projects: projectsReducer,
  sprints: sprintsReducer,
  tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
