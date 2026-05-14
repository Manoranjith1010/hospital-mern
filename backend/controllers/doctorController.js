import { asyncHandler } from '../middleware/errorHandler.js';
import doctorService from '../services/doctorService.js';
import { getPaginationParams } from '../utils/helpers.js';

/**
 * Doctor controller
 */

/**
 * @desc Get all doctors
 * @route GET /api/doctors
 * @access Public
 */
export const getAllDoctors = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const result = await doctorService.getAllDoctors({
    limit,
    skip,
    sortBy: req.query.sortBy || '-createdAt',
    specialization: req.query.specialization,
  });

  res.status(200).json({
    success: true,
    data: result.doctors,
    pagination: result.pagination,
  });
});

/**
 * @desc Get doctor by ID
 * @route GET /api/doctors/:id
 * @access Public
 */
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

/**
 * @desc Get doctors by specialization
 * @route GET /api/doctors/specialization/:specialization
 * @access Public
 */
export const getDoctorsBySpecialization = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getDoctorsBySpecialization(req.params.specialization);

  res.status(200).json({
    success: true,
    data: doctors,
  });
});

/**
 * @desc Create doctor (Admin only)
 * @route POST /api/doctors
 * @access Private/Admin
 */
export const createDoctor = asyncHandler(async (req, res) => {
  const doctorData = {
    ...req.body,
    role: 'DOCTOR',
  };

  const doctor = await doctorService.createDoctor(doctorData);

  res.status(201).json({
    success: true,
    message: 'Doctor created successfully',
    data: doctor,
  });
});

/**
 * @desc Update doctor profile
 * @route PUT /api/doctors/:id
 * @access Private
 */
export const updateDoctor = asyncHandler(async (req, res) => {
  // Allow doctors to update only their own profile
  if (req.user.role === 'DOCTOR' && req.user.userId !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile',
    });
  }

  const updateData = { ...req.body };
  // Remove sensitive fields
  delete updateData.role;
  delete updateData._id;
  delete updateData.licenseNumber;

  const doctor = await doctorService.updateDoctor(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: doctor,
  });
});

/**
 * @desc Get doctor availability
 * @route GET /api/doctors/:id/availability
 * @access Public
 */
export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const availability = await doctorService.getDoctorAvailability(req.params.id);

  res.status(200).json({
    success: true,
    data: availability,
  });
});

/**
 * @desc Update doctor availability
 * @route PUT /api/doctors/:id/availability
 * @access Private
 */
export const updateDoctorAvailability = asyncHandler(async (req, res) => {
  // Allow doctors to update only their own availability
  if (req.user.role === 'DOCTOR' && req.user.userId !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own availability',
    });
  }

  const doctor = await doctorService.updateDoctorAvailability(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Availability updated successfully',
    data: doctor,
  });
});

/**
 * @desc Get doctor appointments
 * @route GET /api/doctors/:id/appointments
 * @access Private
 */
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await doctorService.getDoctorAppointments(req.params.id);

  res.status(200).json({
    success: true,
    data: appointments,
  });
});

/**
 * @desc Delete doctor
 * @route DELETE /api/doctors/:id
 * @access Private/Admin
 */
export const deleteDoctor = asyncHandler(async (req, res) => {
  const result = await doctorService.deleteDoctor(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  createDoctor,
  updateDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorAppointments,
  deleteDoctor,
};
