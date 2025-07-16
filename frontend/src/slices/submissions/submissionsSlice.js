import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Async thunk for submitting a solution
export const submitSolution = createAsyncThunk(
  'submissions/submitSolution',
  async ({ problemCode, code, language, user }, { rejectWithValue }) => {
    try {
      // Adjust endpoint as needed for your backend
      const response = await axios.post(`/compile/submit`, {
        problemCode,
        code,
        language,
        user,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Submission failed');
    }
  }
);

// Async thunk for fetching submissions for a problem
export const fetchSubmissionsByProblem = createAsyncThunk(
  'submissions/fetchSubmissionsByProblem',
  async (problemCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/submissions/problem/${problemCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch submissions');
    }
  }
);

// Async thunk for fetching submissions for a user
export const fetchSubmissionsByUser = createAsyncThunk(
  'submissions/fetchSubmissionsByUser',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${username}/submissions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch submissions');
    }
  }
);

// Async thunk for fetching submissions for a problem and user
export const fetchSubmissionsByProblemAndUser = createAsyncThunk(
  'submissions/fetchSubmissionsByProblemAndUser',
  async ({ problemCode, username }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/submissions/${problemCode}/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch submissions');
    }
  }
);

// Async thunk for running code (not submitting)
export const runCode = createAsyncThunk(
  'submissions/runCode',
  async ({ code, language, input }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/compile/run', {
        code,
        language,
        input,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Run failed');
    }
  }
);

const initialState = {
  submissions: [],
  loading: false,
  error: null,
  submissionResult: null,
  runResult: null,
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSubmissionResult: (state) => {
      state.submissionResult = null;
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      // Fetch submissions by problem
      .addCase(fetchSubmissionsByProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchSubmissionsByProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch submissions by user
      .addCase(fetchSubmissionsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchSubmissionsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch submissions by problem and user
      .addCase(fetchSubmissionsByProblemAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByProblemAndUser.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data || [];
      })
      .addCase(fetchSubmissionsByProblemAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Run code
      .addCase(runCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.runResult = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.loading = false;
        state.runResult = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.runResult = { error: action.payload };
      });
  },
});

export const {
  clearError,
  clearSubmissionResult,
  clearSubmissions,
} = submissionsSlice.actions;

export default submissionsSlice.reducer; 