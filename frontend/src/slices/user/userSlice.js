import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { setUser } from '../auth/authSlice';

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get('/user/me');
      // Set the user in auth state
      dispatch(setUser(response.data.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/user/me', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);

// Async thunk for getting user submissions
export const getUserSubmissions = createAsyncThunk(
  'user/getUserSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user/submissions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get submissions');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

const initialState = {
  profile: null,
  submissions: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Get User Submissions
      .addCase(getUserSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data;
      })
      .addCase(getUserSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.profile = null;
        state.submissions = [];
        state.error = null;
        state.updateError = null;
      });
  },
});

export const { clearError, clearSubmissions } = userSlice.actions;
export default userSlice.reducer; 