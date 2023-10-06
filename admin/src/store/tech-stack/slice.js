import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const techStackSlice = createSlice({
  name: 'techStack',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceTechStackState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const techStackActions = techStackSlice.actions;

export const techStackReducer = techStackSlice.reducer;
