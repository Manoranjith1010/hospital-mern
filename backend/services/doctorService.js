import Doctor from '../models/Doctor.js';
import logger from '../utils/logger.js';

/**
 * Doctor service for managing doctor records
 */
export const doctorService = {
  /**
   * Get all doctors
   */
  async getAllDoctors(query = {}) {
    try {
      const { limit = 10, skip = 0, sortBy = '-createdAt', specialization } = query;
      const filter = { role: 'DOCTOR' };

      if (specialization) {
        filter.specialization = specialization;
      }

      const doctors = await Doctor.find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select('-password');

      const total = await Doctor.countDocuments(filter);

      return {
        doctors,
        pagination: {
          total,
          limit,
          skip,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get all doctors error:', error.message);
      throw error;
    }
  },

  /**
   * Get doctor by ID
   */
  async getDoctorById(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId)
        .select('-password')
        .populate('appointments');

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      return doctor;
    } catch (error) {
      logger.error('Get doctor error:', error.message);
      throw error;
    }
  },

  /**
   * Get doctors by specialization
   */
  async getDoctorsBySpecialization(specialization) {
    try {
      const doctors = await Doctor.find({
        role: 'DOCTOR',
        specialization,
        isActive: true,
      }).select('-password');

      return doctors;
    } catch (error) {
      logger.error('Get doctors by specialization error:', error.message);
      throw error;
    }
  },

  /**
   * Create doctor
   */
  async createDoctor(doctorData) {
    try {
      const existingDoctor = await Doctor.findOne({ email: doctorData.email });
      if (existingDoctor) {
        const error = new Error('Doctor with this email already exists');
        error.statusCode = 400;
        throw error;
      }

      const doctor = await Doctor.create(doctorData);
      logger.info(`New doctor created: ${doctor.email}`);
      return doctor;
    } catch (error) {
      logger.error('Create doctor error:', error.message);
      throw error;
    }
  },

  /**
   * Update doctor profile
   */
  async updateDoctor(doctorId, updateData) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(doctorId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Doctor updated: ${doctor._id}`);
      return doctor;
    } catch (error) {
      logger.error('Update doctor error:', error.message);
      throw error;
    }
  },

  /**
   * Get doctor availability
   */
  async getDoctorAvailability(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      return doctor.availability;
    } catch (error) {
      logger.error('Get doctor availability error:', error.message);
      throw error;
    }
  },

  /**
   * Update doctor availability
   */
  async updateDoctorAvailability(doctorId, availabilityData) {
    try {
      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      doctor.availability = { ...doctor.availability, ...availabilityData };
      await doctor.save();

      logger.info(`Doctor availability updated: ${doctorId}`);
      return doctor;
    } catch (error) {
      logger.error('Update doctor availability error:', error.message);
      throw error;
    }
  },

  /**
   * Get doctor appointments
   */
  async getDoctorAppointments(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId).populate({
        path: 'appointments',
        populate: { path: 'patient', select: 'firstName lastName email phone' },
      });

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      return doctor.appointments;
    } catch (error) {
      logger.error('Get doctor appointments error:', error.message);
      throw error;
    }
  },

  /**
   * Delete doctor
   */
  async deleteDoctor(doctorId) {
    try {
      const doctor = await Doctor.findByIdAndDelete(doctorId);

      if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Doctor deleted: ${doctorId}`);
      return { message: 'Doctor deleted successfully' };
    } catch (error) {
      logger.error('Delete doctor error:', error.message);
      throw error;
    }
  },
};

export default doctorService;
