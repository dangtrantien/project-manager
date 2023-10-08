import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './user/slice';
import { projectCategoryReducer } from './project-category/slice';
import { projectStateReducer } from './project-state/slice';
import { techStackReducer } from './tech-stack/slice';
import { employeeReducer } from './employee/slice';
import { departmentReducer } from './department/slice';
import { projectReducer } from './project/slice';

// ==================================================

export const store = configureStore({
  reducer: {
    user: userReducer,
    projectCategory: projectCategoryReducer,
    projectState: projectStateReducer,
    techStack: techStackReducer,
    employee: employeeReducer,
    department: departmentReducer,
    project: projectReducer,
  },
});

export const host = 'https://pm-server-dangtrantien.vercel.app';
// export const host = 'http://localhost:5000';
