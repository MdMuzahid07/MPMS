import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectsState {
  selectedId: string | null;
  filters: Record<string, string>;
}

const initialState: ProjectsState = {
  selectedId: null,
  filters: {},
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    setFilters: (state, action: PayloadAction<Record<string, string>>) => {
      state.filters = action.payload;
    },
    resetProjectsState: () => initialState,
  },
});

export const { setSelectedProject, setFilters, resetProjectsState } =
  projectsSlice.actions;
export default projectsSlice.reducer;
