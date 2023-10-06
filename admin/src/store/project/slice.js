import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceProjectState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const projectActions = projectSlice.actions;

export const projectReducer = projectSlice.reducer;
