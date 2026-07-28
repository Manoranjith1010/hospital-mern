import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import patientReducer from './patients/patientSlice';
import appointmentReducer from './appointments/appointmentSlice';
import notificationReducer from './notifications/notificationSlice';

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    notifications: notificationReducer,
  },
});
