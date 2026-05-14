import mongoose from 'mongoose';

/**
 * Notification model for sending alerts to users
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    type: {
      type: String,
      enum: [
        'APPOINTMENT_REMINDER',
        'APPOINTMENT_CONFIRMED',
        'APPOINTMENT_CANCELLED',
        'PRESCRIPTION_READY',
        'TEST_RESULT_READY',
        'DOCTOR_MESSAGE',
        'SYSTEM_ALERT',
        'BILLING_NOTIFICATION',
      ],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    reference: {
      type: String,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: ['Appointment', 'MedicalRecord', 'Patient', 'Doctor'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    channel: {
      type: String,
      enum: ['IN_APP', 'EMAIL', 'SMS', 'PUSH'],
      default: 'IN_APP',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ sentAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
