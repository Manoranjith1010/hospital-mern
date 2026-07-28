import express from 'express';
import patientController from '../controllers/patientController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Patient routes
 */
router.get('/', authenticateToken, authorize('ADMIN', 'DOCTOR'), patientController.getAllPatients);
router.get('/:id', authenticateToken, patientController.getPatientById);
router.put('/:id', authenticateToken, patientController.updatePatient);
router.delete('/:id', authenticateToken, authorize('ADMIN'), patientController.deletePatient);

// Medical history routes
router.post('/:id/medical-history', authenticateToken, authorize('DOCTOR', 'ADMIN'), patientController.addMedicalHistory);

// Appointments routes
router.get('/:id/appointments', authenticateToken, patientController.getPatientAppointments);

// Medical records routes
router.get('/:id/medical-records', authenticateToken, patientController.getPatientMedicalRecords);

export default router;
