import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Async thunk for fetching problems
export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/problems');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch problems');
    }
  }
);

// Async thunk for fetching a single problem
export const fetchProblemByCode = createAsyncThunk(
  'problems/fetchProblemByCode',
  async (problemCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/problems/code/${problemCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch problem');
    }
  }
);

const initialState = {
  problems: [],
  currentProblem: null,
  loading: false,
  error: null,
  submissionResult: null,
  filters: {
    difficulty: 'all',
    category: 'all',
    status: 'all',
  },
};

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProblem: (state) => {
      state.currentProblem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch problems
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single problem
      .addCase(fetchProblemByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })
      .addCase(fetchProblemByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { 
  clearError, 
  setFilters, 
  clearCurrentProblem 
} = problemsSlice.actions;

export default problemsSlice.reducer; 