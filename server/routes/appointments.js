import express from 'express';
import appointmentController from '../controllers/appointmentController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * Appointment routes
 */
router.get('/', authenticateToken, authorize('ADMIN', 'DOCTOR'), appointmentController.getAllAppointments);
router.post('/', authenticateToken, appointmentController.createAppointment);
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);
router.put('/:id', authenticateToken, authorize('DOCTOR', 'ADMIN'), appointmentController.updateAppointment);
router.post('/:id/cancel', authenticateToken, appointmentController.cancelAppointment);
router.post('/:id/reschedule', authenticateToken, appointmentController.rescheduleAppointment);
router.post('/:id/complete', authenticateToken, authorize('DOCTOR', 'ADMIN'), appointmentController.completeAppointment);

export default router;
