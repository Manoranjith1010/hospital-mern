import mongoose from 'mongoose';
import User from './User.js';

/**
 * Doctor model extending User
 */
const doctorSchema = new mongoose.Schema(
  {
    // Doctor-specific fields
    specialization: {
      type: String,
      enum: [
        'CARDIOLOGY',
        'NEUROLOGY',
        'ORTHOPEDICS',
        'DERMATOLOGY',
        'PEDIATRICS',
        'PSYCHIATRY',
        'ONCOLOGY',
        'GENERAL',
        'ENT',
        'OPHTHALMOLOGY',
      ],
      required: [true, 'Specialization is required'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    qualifications: [String],
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: 0,
    },
    availability: {
      monday: { startTime: String, endTime: String, isAvailable: Boolean },
      tuesday: { startTime: String, endTime: String, isAvailable: Boolean },
      wednesday: { startTime: String, endTime: String, isAvailable: Boolean },
      thursday: { startTime: String, endTime: String, isAvailable: Boolean },
      friday: { startTime: String, endTime: String, isAvailable: Boolean },
      saturday: { startTime: String, endTime: String, isAvailable: Boolean },
      sunday: { startTime: String, endTime: String, isAvailable: Boolean },
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    department: String,
    bio: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Create Doctor model with discriminator
const Doctor = User.discriminator('DOCTOR', doctorSchema);

export default Doctor;
