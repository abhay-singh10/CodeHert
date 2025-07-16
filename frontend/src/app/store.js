import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/auth/authSlice';
import problemsReducer from '../slices/problems/problemsSlice';
import submissionsReducer from '../slices/submissions/submissionsSlice';
import adminProblemsReducer from '../slices/admin/adminProblemsSlice';
import adminTestCasesReducer from '../slices/admin/adminTestCasesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    submissions: submissionsReducer,
    adminProblems: adminProblemsReducer,
    adminTestCases: adminTestCasesReducer,
  },
});
 