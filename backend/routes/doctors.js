import express from 'express';
import doctorController from '../controllers/doctorController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Doctor routes
 */
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);
router.post('/', authenticateToken, authorize('ADMIN'), doctorController.createDoctor);
router.put('/:id', authenticateToken, authorize('DOCTOR', 'ADMIN'), doctorController.updateDoctor);
router.delete('/:id', authenticateToken, authorize('ADMIN'), doctorController.deleteDoctor);

// Availability routes
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.put('/:id/availability', authenticateToken, authorize('DOCTOR', 'ADMIN'), doctorController.updateDoctorAvailability);

// Appointments routes
router.get('/:id/appointments', authenticateToken, authorize('DOCTOR', 'ADMIN'), doctorController.getDoctorAppointments);

export default router;
