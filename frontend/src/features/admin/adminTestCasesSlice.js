import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/adminTestCases';

// Async thunks
export const fetchTestCases = createAsyncThunk(
  'adminTestCases/fetchTestCases',
  async (problemCode, { rejectWithValue }) => {
    try {
      return await api.getTestCases(problemCode);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTestCase = createAsyncThunk(
  'adminTestCases/createTestCase',
  async (data, { rejectWithValue }) => {
    try {
      return await api.createTestCase(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateTestCase = createAsyncThunk(
  'adminTestCases/updateTestCase',
  async ({ testcaseId, data }, { rejectWithValue }) => {
    try {
      return await api.updateTestCase(testcaseId, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteTestCase = createAsyncThunk(
  'adminTestCases/deleteTestCase',
  async (testcaseId, { rejectWithValue }) => {
    try {
      await api.deleteTestCase(testcaseId);
      return testcaseId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const adminTestCasesSlice = createSlice({
  name: 'adminTestCases',
  initialState: {
    testCases: [],
    loading: false,
    error: null,
    selectedProblemCode: null,
  },
  reducers: {
    setSelectedProblemCode(state, action) {
      state.selectedProblemCode = action.payload;
    },
    clearTestCases(state) {
      state.testCases = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTestCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestCases.fulfilled, (state, action) => {
        state.loading = false;
        state.testCases = action.payload;
      })
      .addCase(fetchTestCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTestCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestCase.fulfilled, (state, action) => {
        state.loading = false;
        state.testCases.push(action.payload);
      })
      .addCase(createTestCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateTestCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestCase.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.testCases.findIndex(tc => tc._id === action.payload._id);
        if (idx !== -1) state.testCases[idx] = action.payload;
      })
      .addCase(updateTestCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTestCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestCase.fulfilled, (state, action) => {
        state.loading = false;
        state.testCases = state.testCases.filter(tc => tc._id !== action.payload);
      })
      .addCase(deleteTestCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProblemCode, clearTestCases } = adminTestCasesSlice.actions;
export default adminTestCasesSlice.reducer; 