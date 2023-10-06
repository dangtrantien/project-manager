import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const projectCategorySlice = createSlice({
  name: 'projectCategory',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceCategoryState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const projectCategoryActions = projectCategorySlice.actions;

export const projectCategoryReducer = projectCategorySlice.reducer;
