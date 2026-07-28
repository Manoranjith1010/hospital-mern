import mongoose from 'mongoose';
import User from './User.js';

/**
 * Patient model extending User
 */
const patientSchema = new mongoose.Schema(
  {
    // Patient-specific fields
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: [true, 'Gender is required'],
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
      },
      relationship: String,
    },
    medicalHistory: {
      allergies: [String],
      chronicDiseases: [String],
      previousSurgeries: [String],
      medications: [String],
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    medicalRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create Patient model with discriminator
const Patient = User.discriminator('PATIENT', patientSchema);

export default Patient;
