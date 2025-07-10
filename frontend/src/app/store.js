import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import problemsReducer from '../features/problems/problemsSlice';
import userReducer from '../features/user/userSlice';
import submissionsReducer from '../features/submissions/submissionsSlice';
import adminProblemsReducer from '../features/admin/adminProblemsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    submissions: submissionsReducer,
    adminProblems: adminProblemsReducer,
    //user: userReducer,
  },
});
 