import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import logger from '../utils/logger.js';

/**
 * Medical record service
 */
export const medicalRecordService = {
  /**
   * Get all medical records
   */
  async getAllRecords(query = {}) {
    try {
      const { limit = 10, skip = 0, sortBy = '-recordDate', patientId, recordType } = query;
      const filter = {};

      if (patientId) filter.patient = patientId;
      if (recordType) filter.recordType = recordType;

      const records = await MedicalRecord.find(filter)
        .populate('patient', 'firstName lastName email')
        .populate('doctor', 'firstName lastName specialization')
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

      const total = await MedicalRecord.countDocuments(filter);

      return {
        records,
        pagination: {
          total,
          limit,
          skip,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get all records error:', error.message);
      throw error;
    }
  },

  /**
   * Get record by ID
   */
  async getRecordById(recordId) {
    try {
      const record = await MedicalRecord.findById(recordId)
        .populate('patient')
        .populate('doctor')
        .populate('appointment');

      if (!record) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }

      return record;
    } catch (error) {
      logger.error('Get record error:', error.message);
      throw error;
    }
  },

  /**
   * Create medical record
   */
  async createRecord(recordData) {
    try {
      const patient = await Patient.findById(recordData.patient);
      if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
      }

      const record = await MedicalRecord.create(recordData);

      // Add to patient medical records
      if (!patient.medicalRecords) {
        patient.medicalRecords = [];
      }
      patient.medicalRecords.push(record._id);
      await patient.save();

      logger.info(`Medical record created: ${record._id}`);
      return record;
    } catch (error) {
      logger.error('Create record error:', error.message);
      throw error;
    }
  },

  /**
   * Update medical record
   */
  async updateRecord(recordId, updateData) {
    try {
      const record = await MedicalRecord.findByIdAndUpdate(recordId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!record) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Medical record updated: ${recordId}`);
      return record;
    } catch (error) {
      logger.error('Update record error:', error.message);
      throw error;
    }
  },

  /**
   * Get patient records
   */
  async getPatientRecords(patientId) {
    try {
      const records = await MedicalRecord.find({ patient: patientId })
        .populate('doctor', 'firstName lastName specialization')
        .sort('-recordDate');

      return records;
    } catch (error) {
      logger.error('Get patient records error:', error.message);
      throw error;
    }
  },

  /**
   * Delete record
   */
  async deleteRecord(recordId) {
    try {
      const record = await MedicalRecord.findByIdAndDelete(recordId);

      if (!record) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }

      // Remove from patient
      await Patient.findByIdAndUpdate(record.patient, {
        $pull: { medicalRecords: recordId },
      });

      logger.info(`Medical record deleted: ${recordId}`);
      return { message: 'Record deleted successfully' };
    } catch (error) {
      logger.error('Delete record error:', error.message);
      throw error;
    }
  },
};

export default medicalRecordService;
