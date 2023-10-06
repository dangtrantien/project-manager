import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceDepartmentState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const departmentActions = departmentSlice.actions;

export const departmentReducer = departmentSlice.reducer;
