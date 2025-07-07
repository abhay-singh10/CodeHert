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
export const fetchProblemById = createAsyncThunk(
  'problems/fetchProblemById',
  async (problemId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/problems/${problemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch problem');
    }
  }
);

// Async thunk for submitting a solution
export const submitSolution = createAsyncThunk(
  'problems/submitSolution',
  async ({ problemId, code, language }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/problems/${problemId}/submit`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Submission failed');
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
    clearSubmissionResult: (state) => {
      state.submissionResult = null;
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
      .addCase(fetchProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })
      .addCase(fetchProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit solution
      .addCase(submitSolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResult = action.payload;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSubmissionResult, 
  setFilters, 
  clearCurrentProblem 
} = problemsSlice.actions;

export default problemsSlice.reducer; 