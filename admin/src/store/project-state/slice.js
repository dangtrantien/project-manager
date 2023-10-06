import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const projectStateSlice = createSlice({
  name: 'projectState',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceProjectStateState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const projectStateActions = projectStateSlice.actions;

export const projectStateReducer = projectStateSlice.reducer;
