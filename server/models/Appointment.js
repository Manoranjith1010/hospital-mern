import mongoose from 'mongoose';

/**
 * Appointment model for booking and managing appointments
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
      validate: {
        validator(v) {
          return v > new Date();
        },
        message: 'Appointment date must be in the future',
      },
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time (HH:mm)'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      minlength: [10, 'Reason must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      default: 'SCHEDULED',
    },
    notes: String,
    prescription: String,
    diagnosis: String,
    followUpDate: Date,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: Date,
    duration: {
      type: Number,
      default: 30,
      min: 15,
      max: 120,
    },
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
