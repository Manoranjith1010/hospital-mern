import apiClient from './client';

/**
 * Authentication API service
 */
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (oldPassword, newPassword) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

/**
 * Patient API service
 */
export const patientAPI = {
  getAll: (params = {}) => apiClient.get('/patients', { params }),
  getById: (id) => apiClient.get(`/patients/${id}`),
  update: (id, data) => apiClient.put(`/patients/${id}`, data),
  delete: (id) => apiClient.delete(`/patients/${id}`),
  getAppointments: (id) => apiClient.get(`/patients/${id}/appointments`),
  getMedicalRecords: (id) => apiClient.get(`/patients/${id}/medical-records`),
  addMedicalHistory: (id, data) => apiClient.post(`/patients/${id}/medical-history`, data),
};

/**
 * Doctor API service
 */
export const doctorAPI = {
  getAll: (params = {}) => apiClient.get('/doctors', { params }),
  getById: (id) => apiClient.get(`/doctors/${id}`),
  getBySpecialization: (specialization) =>
    apiClient.get(`/doctors/specialization/${specialization}`),
  create: (data) => apiClient.post('/doctors', data),
  update: (id, data) => apiClient.put(`/doctors/${id}`, data),
  delete: (id) => apiClient.delete(`/doctors/${id}`),
  getAvailability: (id) => apiClient.get(`/doctors/${id}/availability`),
  updateAvailability: (id, data) => apiClient.put(`/doctors/${id}/availability`, data),
  getAppointments: (id) => apiClient.get(`/doctors/${id}/appointments`),
};

/**
 * Appointment API service
 */
export const appointmentAPI = {
  getAll: (params = {}) => apiClient.get('/appointments', { params }),
  getById: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  cancel: (id, reason) => apiClient.post(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, newDate, newTime) =>
    apiClient.post(`/appointments/${id}/reschedule`, { newDate, newTime }),
  complete: (id, notes) => apiClient.post(`/appointments/${id}/complete`, { notes }),
};

/**
 * Medical Record API service
 */
export const medicalRecordAPI = {
  getAll: (params = {}) => apiClient.get('/medical-records', { params }),
  getById: (id) => apiClient.get(`/medical-records/${id}`),
  create: (data) => apiClient.post('/medical-records', data),
  update: (id, data) => apiClient.put(`/medical-records/${id}`, data),
  getByPatient: (patientId) => apiClient.get(`/medical-records/patient/${patientId}`),
  delete: (id) => apiClient.delete(`/medical-records/${id}`),
};

export default {
  authAPI,
  patientAPI,
  doctorAPI,
  appointmentAPI,
  medicalRecordAPI,
};
