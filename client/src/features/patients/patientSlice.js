import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientAPI } from '../../api/services';

const initialState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 10,
    skip: 0,
    pages: 0,
  },
};

/**
 * Async thunks
 */
export const getPatients = createAsyncThunk('patients/getPatients', async (params = {}) => {
  const response = await patientAPI.getAll(params);
  return response.data;
});

export const getPatientById = createAsyncThunk('patients/getPatientById', async (id) => {
  const response = await patientAPI.getById(id);
  return response.data.data;
});

export const updatePatient = createAsyncThunk('patients/updatePatient', async (data) => {
  const response = await patientAPI.update(data.id, data.payload);
  return response.data.data;
});

export const deletePatient = createAsyncThunk('patients/deletePatient', async (id) => {
  await patientAPI.delete(id);
  return id;
});

/**
 * Patient slice
 */
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Patients
    builder
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Get Patient by ID
    builder
      .addCase(getPatientById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatient = action.payload;
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Update Patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatient = action.payload;
        const index = state.patients.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Delete Patient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = state.patients.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;
