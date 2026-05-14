import { asyncHandler } from '../middleware/errorHandler.js';
import patientService from '../services/patientService.js';
import { getPaginationParams } from '../utils/helpers.js';

/**
 * Patient controller
 */

/**
 * @desc Get all patients
 * @route GET /api/patients
 * @access Private/Admin
 */
export const getAllPatients = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const result = await patientService.getAllPatients({
    limit,
    skip,
    sortBy: req.query.sortBy || '-createdAt',
  });

  res.status(200).json({
    success: true,
    data: result.patients,
    pagination: result.pagination,
  });
});

/**
 * @desc Get patient by ID
 * @route GET /api/patients/:id
 * @access Private
 */
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);

  res.status(200).json({
    success: true,
    data: patient,
  });
});

/**
 * @desc Update patient profile
 * @route PUT /api/patients/:id
 * @access Private
 */
export const updatePatient = asyncHandler(async (req, res) => {
  // Allow patients to update only their own profile
  if (req.user.role === 'PATIENT' && req.user.userId !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile',
    });
  }

  const updateData = { ...req.body };
  // Remove sensitive fields
  delete updateData.role;
  delete updateData._id;

  const patient = await patientService.updatePatient(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Patient updated successfully',
    data: patient,
  });
});

/**
 * @desc Add medical history
 * @route POST /api/patients/:id/medical-history
 * @access Private/Doctor
 */
export const addMedicalHistory = asyncHandler(async (req, res) => {
  const { allergies, chronicDiseases, previousSurgeries, medications } = req.body;

  const patient = await patientService.addMedicalHistory(req.params.id, {
    allergies,
    chronicDiseases,
    previousSurgeries,
    medications,
  });

  res.status(200).json({
    success: true,
    message: 'Medical history updated successfully',
    data: patient,
  });
});

/**
 * @desc Get patient appointments
 * @route GET /api/patients/:id/appointments
 * @access Private
 */
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await patientService.getPatientAppointments(req.params.id);

  res.status(200).json({
    success: true,
    data: appointments,
  });
});

/**
 * @desc Get patient medical records
 * @route GET /api/patients/:id/medical-records
 * @access Private
 */
export const getPatientMedicalRecords = asyncHandler(async (req, res) => {
  const records = await patientService.getPatientMedicalRecords(req.params.id);

  res.status(200).json({
    success: true,
    data: records,
  });
});

/**
 * @desc Delete patient
 * @route DELETE /api/patients/:id
 * @access Private/Admin
 */
export const deletePatient = asyncHandler(async (req, res) => {
  const result = await patientService.deletePatient(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  getAllPatients,
  getPatientById,
  updatePatient,
  addMedicalHistory,
  getPatientAppointments,
  getPatientMedicalRecords,
  deletePatient,
};
