import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types/domain";
import { mockData } from "@/data/mockData";

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: mockData.getProjects(),
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    updateProjectProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>,
    ) => {
      const { id, progress } = action.payload;
      const project = state.projects.find((p) => p.id === id);
      if (project) {
        project.progress = progress;
      }
    },
  },
});

export const { setProjects, updateProjectProgress } = projectsSlice.actions;
export default projectsSlice.reducer;
