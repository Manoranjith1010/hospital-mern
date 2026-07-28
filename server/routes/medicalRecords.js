import express from 'express';
import medicalRecordController from '../controllers/medicalRecordController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Medical Record routes
 */
router.get('/', authenticateToken, authorize('ADMIN', 'DOCTOR'), medicalRecordController.getAllRecords);
router.post('/', authenticateToken, authorize('DOCTOR', 'ADMIN'), medicalRecordController.createRecord);
router.get('/:id', authenticateToken, medicalRecordController.getRecordById);
router.put('/:id', authenticateToken, authorize('DOCTOR', 'ADMIN'), medicalRecordController.updateRecord);
router.get('/patient/:patientId', authenticateToken, medicalRecordController.getPatientRecords);
router.delete('/:id', authenticateToken, authorize('ADMIN', 'DOCTOR'), medicalRecordController.deleteRecord);

export default router;
