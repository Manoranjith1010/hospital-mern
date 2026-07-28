import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import logger from '../utils/logger.js';
import { sendAppointmentConfirmation, sendCancellationNotification } from '../utils/email.js';

/**
 * Appointment service for managing appointments
 */
export const appointmentService = {
  /**
   * Get all appointments
   */
  async getAllAppointments(query = {}) {
    try {
      const { limit = 10, skip = 0, sortBy = '-appointmentDate', status, patientId, doctorId } = query;
      const filter = {};

      if (status) filter.status = status;
      if (patientId) filter.patient = patientId;
      if (doctorId) filter.doctor = doctorId;

      const appointments = await Appointment.find(filter)
        .populate('patient', 'firstName lastName email phone')
        .populate('doctor', 'firstName lastName specialization')
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

      const total = await Appointment.countDocuments(filter);

      return {
        appointments,
        pagination: {
          total,
          limit,
          skip,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get all appointments error:', error.message);
      throw error;
    }
  },

  /**
   * Get appointment by ID
   */
  async getAppointmentById(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient')
        .populate('doctor');

      if (!appointment) {
        const error = new Error('Appointment not found');
        error.statusCode = 404;
        throw error;
      }

      return appointment;
    } catch (error) {
      logger.error('Get appointment error:', error.message);
      throw error;
    }
  },

  /**
   * Create appointment
   */
  async createAppointment(appointmentData) {
    try {
      // Validate patient and doctor exist
      const patient = await Patient.findById(appointmentData.patient);
      const doctor = await Doctor.findById(appointmentData.doctor);

      if (!patient || !doctor) {
        const error = new Error('Invalid patient or doctor');
        error.statusCode = 400;
        throw error;
      }

      // Check for conflicting appointments
      const conflictingAppointment = await Appointment.findOne({
        doctor: appointmentData.doctor,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
      });

      if (conflictingAppointment) {
        const error = new Error('Doctor is not available at this time');
        error.statusCode = 400;
        throw error;
      }

      const appointment = await Appointment.create(appointmentData);

      // Add to patient and doctor appointments
      patient.appointments.push(appointment._id);
      doctor.appointments.push(appointment._id);
      await patient.save();
      await doctor.save();

      // Send confirmation email
      await sendAppointmentConfirmation(
        patient.email,
        patient.firstName,
        appointment.appointmentDate,
        appointment.appointmentTime,
        doctor.firstName,
      );

      logger.info(`Appointment created: ${appointment._id}`);
      return appointment;
    } catch (error) {
      logger.error('Create appointment error:', error.message);
      throw error;
    }
  },

  /**
   * Update appointment
   */
  async updateAppointment(appointmentId, updateData) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, {
        new: true,
        runValidators: true,
      })
        .populate('patient')
        .populate('doctor');

      if (!appointment) {
        const error = new Error('Appointment not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Appointment updated: ${appointmentId}`);
      return appointment;
    } catch (error) {
      logger.error('Update appointment error:', error.message);
      throw error;
    }
  },

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId, reason, cancelledBy) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient')
        .populate('doctor');

      if (!appointment) {
        const error = new Error('Appointment not found');
        error.statusCode = 404;
        throw error;
      }

      if (appointment.status === 'CANCELLED') {
        const error = new Error('Appointment is already cancelled');
        error.statusCode = 400;
        throw error;
      }

      appointment.status = 'CANCELLED';
      appointment.cancellationReason = reason;
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = cancelledBy;

      await appointment.save();

      // Send cancellation email
      await sendCancellationNotification(
        appointment.patient.email,
        appointment.patient.firstName,
        appointment.appointmentDate,
      );

      logger.info(`Appointment cancelled: ${appointmentId}`);
      return appointment;
    } catch (error) {
      logger.error('Cancel appointment error:', error.message);
      throw error;
    }
  },

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(appointmentId, newDate, newTime) {
    try {
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        const error = new Error('Appointment not found');
        error.statusCode = 404;
        throw error;
      }

      // Check for conflicts
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointmentId },
        doctor: appointment.doctor,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
      });

      if (conflictingAppointment) {
        const error = new Error('Doctor is not available at this time');
        error.statusCode = 400;
        throw error;
      }

      appointment.appointmentDate = newDate;
      appointment.appointmentTime = newTime;
      appointment.status = 'RESCHEDULED';
      await appointment.save();

      logger.info(`Appointment rescheduled: ${appointmentId}`);
      return appointment;
    } catch (error) {
      logger.error('Reschedule appointment error:', error.message);
      throw error;
    }
  },

  /**
   * Complete appointment
   */
  async completeAppointment(appointmentId, notes) {
    try {
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        const error = new Error('Appointment not found');
        error.statusCode = 404;
        throw error;
      }

      appointment.status = 'COMPLETED';
      if (notes) {
        appointment.notes = notes;
      }
      await appointment.save();

      logger.info(`Appointment completed: ${appointmentId}`);
      return appointment;
    } catch (error) {
      logger.error('Complete appointment error:', error.message);
      throw error;
    }
  },
};

export default appointmentService;
