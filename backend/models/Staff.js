import mongoose from 'mongoose';
import User from './User.js';

/**
 * Staff model extending User
 */
const staffSchema = new mongoose.Schema(
  {
    // Staff-specific fields
    department: {
      type: String,
      enum: [
        'ADMIN',
        'RECEPTION',
        'NURSING',
        'PHARMACY',
        'LABORATORY',
        'RADIOLOGY',
        'IT',
        'MAINTENANCE',
        'SECURITY',
      ],
      required: [true, 'Department is required'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    employeeId: {
      type: String,
      unique: true,
      required: [true, 'Employee ID is required'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    salary: {
      type: Number,
      min: 0,
    },
    qualifications: [String],
    certifications: [String],
    shift: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'NIGHT', 'FLEXIBLE'],
      default: 'MORNING',
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    performanceRating: {
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

// Create Staff model with discriminator
const Staff = User.discriminator('STAFF', staffSchema);

export default Staff;
