/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockData } from "@/data/mockData";
import { Sprint } from "@/types/domain.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SprintsState {
  sprintsByProject: Record<string, Sprint[]>;
}

const initialState: SprintsState = {
  sprintsByProject: {
    "1": mockData.getSprintsByProject("1"),
    "2": mockData.getSprintsByProject("2"),
    "3": mockData.getSprintsByProject("3"),
  },
};

const sprintsSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {
    setSprints: (
      state,
      action: PayloadAction<{ projectId: string; sprints: Sprint[] }>,
    ) => {
      const { projectId, sprints } = action.payload;
      state.sprintsByProject[projectId] = sprints;
    },
    updateSprintProgress: (
      state,
      action: PayloadAction<{
        projectId: string;
        sprintId: string;
        progress: number;
      }>,
    ) => {
      const { projectId, sprintId, progress } = action.payload;
      const list = state.sprintsByProject[projectId];
      if (list) {
        const sprint = list.find((s: any) => (s.id || s._id) === sprintId);
        if (sprint) {
          (sprint as any).progress = progress;
        }
      }
    },
  },
});

export const { setSprints, updateSprintProgress } = sprintsSlice.actions;
export default sprintsSlice.reducer;
