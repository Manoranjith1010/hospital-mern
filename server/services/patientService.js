import Patient from '../models/Patient.js';
import logger from '../utils/logger.js';

/**
 * Patient service for managing patient records
 */
export const patientService = {
  /**
   * Get all patients
   */
  async getAllPatients(query = {}) {
    try {
      const { limit = 10, skip = 0, sortBy = '-createdAt' } = query;
      const filter = { role: 'PATIENT' };

      const patients = await Patient.find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select('-password');

      const total = await Patient.countDocuments(filter);

      return {
        patients,
        pagination: {
          total,
          limit,
          skip,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get all patients error:', error.message);
      throw error;
    }
  },

  /**
   * Get patient by ID
   */
  async getPatientById(patientId) {
    try {
      const patient = await Patient.findById(patientId)
        .populate('appointments')
        .populate('medicalRecords');

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      return patient;
    } catch (error) {
      logger.error('Get patient error:', error.message);
      throw error;
    }
  },

  /**
   * Update patient profile
   */
  async updatePatient(patientId, updateData) {
    try {
      const patient = await Patient.findByIdAndUpdate(patientId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Patient updated: ${patient._id}`);
      return patient;
    } catch (error) {
      logger.error('Update patient error:', error.message);
      throw error;
    }
  },

  /**
   * Add medical history
   */
  async addMedicalHistory(patientId, historyData) {
    try {
      const patient = await Patient.findById(patientId);

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      if (!patient.medicalHistory) {
        patient.medicalHistory = {};
      }

      Object.assign(patient.medicalHistory, historyData);
      await patient.save();

      logger.info(`Medical history updated for patient: ${patientId}`);
      return patient;
    } catch (error) {
      logger.error('Add medical history error:', error.message);
      throw error;
    }
  },

  /**
   * Get patient appointments
   */
  async getPatientAppointments(patientId) {
    try {
      const patient = await Patient.findById(patientId).populate({
        path: 'appointments',
        populate: { path: 'doctor', select: 'firstName lastName specialization' },
      });

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      return patient.appointments;
    } catch (error) {
      logger.error('Get patient appointments error:', error.message);
      throw error;
    }
  },

  /**
   * Get patient medical records
   */
  async getPatientMedicalRecords(patientId) {
    try {
      const patient = await Patient.findById(patientId).populate('medicalRecords');

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      return patient.medicalRecords;
    } catch (error) {
      logger.error('Get patient medical records error:', error.message);
      throw error;
    }
  },

  /**
   * Delete patient
   */
  async deletePatient(patientId) {
    try {
      const patient = await Patient.findByIdAndDelete(patientId);

      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Patient deleted: ${patientId}`);
      return { message: 'Patient deleted successfully' };
    } catch (error) {
      logger.error('Delete patient error:', error.message);
      throw error;
    }
  },
};

export default patientService;
