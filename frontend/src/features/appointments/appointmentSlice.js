import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../../api/services';

const initialState = {
  appointments: [],
  currentAppointment: null,
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
export const getAppointments = createAsyncThunk(
  'appointments/getAppointments',
  async (params = {}) => {
    const response = await appointmentAPI.getAll(params);
    return response.data;
  },
);

export const getAppointmentById = createAsyncThunk(
  'appointments/getAppointmentById',
  async (id) => {
    const response = await appointmentAPI.getById(id);
    return response.data.data;
  },
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (data) => {
    const response = await appointmentAPI.create(data);
    return response.data.data;
  },
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async (data) => {
    const response = await appointmentAPI.update(data.id, data.payload);
    return response.data.data;
  },
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async (data) => {
    const response = await appointmentAPI.cancel(data.id, data.reason);
    return response.data.data;
  },
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async (data) => {
    const response = await appointmentAPI.reschedule(data.id, data.newDate, data.newTime);
    return response.data.data;
  },
);

/**
 * Appointment slice
 */
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Appointments
    builder
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Get Appointment by ID
    builder
      .addCase(getAppointmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Create Appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Update Appointment
    builder
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.currentAppointment = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Cancel Appointment
    builder
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });

    // Reschedule Appointment
    builder
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
