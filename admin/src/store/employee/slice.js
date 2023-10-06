import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    replaceEmployeeState(state, action) {
      state.data = action.payload.data;
      state.total = action.payload.total;
    },
  },
});

export const employeeActions = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;
