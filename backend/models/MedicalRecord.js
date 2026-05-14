import mongoose from 'mongoose';

/**
 * Medical Record model for storing patient medical history
 */
const medicalRecordSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    recordType: {
      type: String,
      enum: ['CONSULTATION', 'LAB_TEST', 'IMAGING', 'PRESCRIPTION', 'SURGERY', 'VACCINATION', 'OTHER'],
      required: [true, 'Record type is required'],
    },
    title: {
      type: String,
      required: [true, 'Record title is required'],
    },
    description: {
      type: String,
      required: [true, 'Record description is required'],
    },
    findings: String,
    diagnosis: String,
    treatment: String,
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    labResults: {
      testName: String,
      result: String,
      normalRange: String,
      status: {
        type: String,
        enum: ['NORMAL', 'ABNORMAL', 'CRITICAL'],
      },
    },
    isConfidential: {
      type: Boolean,
      default: false,
    },
    recordDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, recordDate: -1 });
medicalRecordSchema.index({ doctor: 1, recordDate: -1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
