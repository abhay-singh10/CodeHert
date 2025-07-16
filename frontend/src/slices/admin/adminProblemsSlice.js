import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProblems, deleteProblem, updateProblem as apiUpdateProblem, createProblem as apiCreateProblem } from '../../api/adminProblems';

export const fetchAllProblems = createAsyncThunk(
  'adminProblems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProblems();
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch problems');
    }
  }
);

export const removeProblem = createAsyncThunk(
  'adminProblems/delete',
  async (code, { rejectWithValue }) => {
    try {
      await deleteProblem(code);
      return code;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete problem');
    }
  }
);

export const updateProblem = createAsyncThunk(
  'adminProblems/update',
  async ({ code, data }, { rejectWithValue }) => {
    try {
      return await apiUpdateProblem(code, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update problem');
    }
  }
);

export const createProblem = createAsyncThunk(
  'adminProblems/create',
  async (data, { rejectWithValue }) => {
    try {
      return await apiCreateProblem(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create problem');
    }
  }
);

const adminProblemsSlice = createSlice({
  name: 'adminProblems',
  initialState: {
    problems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = state.problems.filter(p => p.code !== action.payload);
      })
      .addCase(removeProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = state.problems.map(p => p.code === action.payload.code ? action.payload : p);
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.problems.push(action.payload);
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminProblemsSlice.reducer; 