import express from 'express';
import authRoutes from './auth.js';
import patientRoutes from './patients.js';
import doctorRoutes from './doctors.js';
import appointmentRoutes from './appointments.js';
import medicalRecordRoutes from './medicalRecords.js';

const router = express.Router();

/**
 * API routes
 */
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);

export default router;
