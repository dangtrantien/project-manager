import { createSlice } from '@reduxjs/toolkit';

// ==================================================

const userSlice = createSlice({
  name: 'user',
  initialState: {
    displayName: '',
    email: '',
    password: '',
    profile: {},
  },
  reducers: {
    replaceUserState(state, action) {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.profile = action.payload.profile;
    },
  },
});

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
