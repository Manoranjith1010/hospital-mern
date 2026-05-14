import { asyncHandler } from '../middleware/errorHandler.js';
import appointmentService from '../services/appointmentService.js';
import { getPaginationParams } from '../utils/helpers.js';

/**
 * Appointment controller
 */

/**
 * @desc Get all appointments
 * @route GET /api/appointments
 * @access Private/Admin
 */
export const getAllAppointments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const result = await appointmentService.getAllAppointments({
    limit,
    skip,
    sortBy: req.query.sortBy || '-appointmentDate',
    status: req.query.status,
    patientId: req.query.patientId,
    doctorId: req.query.doctorId,
  });

  res.status(200).json({
    success: true,
    data: result.appointments,
    pagination: result.pagination,
  });
});

/**
 * @desc Get appointment by ID
 * @route GET /api/appointments/:id
 * @access Private
 */
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

/**
 * @desc Create appointment
 * @route POST /api/appointments
 * @access Private
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, appointmentDate, appointmentTime, reason, duration } = req.body;

  // Validate required fields
  if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  const appointmentData = {
    patient: patientId,
    doctor: doctorId,
    appointmentDate,
    appointmentTime,
    reason,
    duration: duration || 30,
    status: 'SCHEDULED',
  };

  const appointment = await appointmentService.createAppointment(appointmentData);

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: appointment,
  });
});

/**
 * @desc Update appointment
 * @route PUT /api/appointments/:id
 * @access Private
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const updateData = {};

  // Allow only certain fields to be updated
  if (req.body.notes) updateData.notes = req.body.notes;
  if (req.body.diagnosis) updateData.diagnosis = req.body.diagnosis;
  if (req.body.prescription) updateData.prescription = req.body.prescription;
  if (req.body.followUpDate) updateData.followUpDate = req.body.followUpDate;
  if (req.body.status) updateData.status = req.body.status;

  const appointment = await appointmentService.updateAppointment(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Appointment updated successfully',
    data: appointment,
  });
});

/**
 * @desc Cancel appointment
 * @route POST /api/appointments/:id/cancel
 * @access Private
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const appointment = await appointmentService.cancelAppointment(req.params.id, reason, req.user.role);

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: appointment,
  });
});

/**
 * @desc Reschedule appointment
 * @route POST /api/appointments/:id/reschedule
 * @access Private
 */
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { newDate, newTime } = req.body;

  if (!newDate || !newTime) {
    return res.status(400).json({
      success: false,
      message: 'Please provide new date and time',
    });
  }

  const appointment = await appointmentService.rescheduleAppointment(req.params.id, newDate, newTime);

  res.status(200).json({
    success: true,
    message: 'Appointment rescheduled successfully',
    data: appointment,
  });
});

/**
 * @desc Complete appointment
 * @route POST /api/appointments/:id/complete
 * @access Private/Doctor
 */
export const completeAppointment = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  const appointment = await appointmentService.completeAppointment(req.params.id, notes);

  res.status(200).json({
    success: true,
    message: 'Appointment completed successfully',
    data: appointment,
  });
});

export default {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
};
